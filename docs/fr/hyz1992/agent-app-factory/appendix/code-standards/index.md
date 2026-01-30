---
title: "Normes de code : TypeScript, structure de fichiers et codes d'erreur | Tutoriel AI App Factory"
sidebarTitle: "Normes de code"
subtitle: "Normes de code : spécifications de codage TypeScript, structure de fichiers et codes d'erreur"
description: "Apprenez les spécifications de codage TypeScript, la structure de fichiers, les exigences de commentaires et le système de codes d'erreur que le code généré par AI App Factory doit respecter. Ce tutoriel explique en détail les normes générales, les spécifications TypeScript, les normes front-end et back-end, les spécifications Prisma, les normes de commentaires et le système unifié de codes d'erreur."
tags:
  - "Annexe"
  - "Normes de code"
  - "TypeScript"
  - "Codes d'erreur"
prerequisite:
  - "start-init-project"
order: 230
---

# Normes de code : TypeScript, structure de fichiers et codes d'erreur

## Ce que vous saurez faire

- ✅ Comprendre les spécifications de codage que le code généré par AI App Factory doit respecter
- ✅ Maîtriser les types et les conventions de nommage TypeScript
- ✅ Comprendre la structure et l'organisation des fichiers front-end et back-end
- ✅ Apprendre à utiliser le système unifié de codes d'erreur

## Idée principale

Le code généré par AI App Factory doit respecter des spécifications de codage unifiées pour assurer une qualité de code cohérente, maintenable et facile à comprendre. Ces spécifications couvrent le format général, le système de types TypeScript, la conception de l'architecture front-end et back-end, le style de commentaires et les mécanismes de gestion des erreurs.

**Pourquoi avons-nous besoin de spécifications de code ?**

- **Cohérence** : Tous les styles de code générés par les agents sont uniformes, ce qui réduit les coûts d'apprentissage
- **Maintenabilité** : Une dénomination et une structure claires facilitent les modifications ultérieures
- **Lisibilité** : Le code standardisé permet aux membres de l'équipe de comprendre rapidement l'intention
- **Sécurité** : Un système de types strict et une gestion des erreurs réduisent les erreurs d'exécution

---

## I. Spécifications générales

### 1.1 Langage et format

| Élément | Spécification |
|---------|--------------|
| Langage | TypeScript (mode strict) |
| Indentation | 2 espaces |
| Fin de ligne | LF (Unix) |
| Encodage | UTF-8 |
| Longueur maximale de ligne | 100 caractères (code), 80 caractères (commentaires) |
| Point-virgule | Obligatoire |
| Guillemets | Guillemets simples (chaînes), guillemets doubles (attributs JSX) |

### 1.2 Conventions de nommage

| Type | Style | Exemple |
|------|-------|---------|
| Nom de fichier (normal) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Nom de fichier (composant) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Nom de fichier (test) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Variable | camelCase | `userName`, `isLoading` |
| Fonction | camelCase | `getUserById`, `formatDate` |
| Classe/Interface/Type | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Constante | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Propriété privée | Pas de préfixe underscore | Utiliser le mot-clé private de TypeScript |
| Variable booléenne | Préfixe is/has/can | `isActive`, `hasPermission`, `canEdit` |
| Gestionnaire d'événement | Préfixe handle | `handleClick`, `handleSubmit` |
| Hook | Préfixe use | `useItems`, `useAuth` |

::: tip Astuces de nommage
Un bon nom devrait être **auto-explicatif**, sans avoir besoin de commentaires supplémentaires pour expliquer son usage. Par exemple, `isValid` est plus clair que `check`, et `getUserById` est plus spécifique que `getData`.
:::

### 1.3 Organisation des fichiers

**Responsabilité unique par fichier** :
- Un composant par fichier
- Un service par fichier
- Les types connexes peuvent être placés dans le même fichier types.ts

**Ordre des imports** :
```typescript
// 1. Modules intégrés Node.js
import path from 'path';

// 2. Dépendances externes
import express from 'express';
import { z } from 'zod';

// 3. Modules internes (chemins absolus)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Imports relatifs
import { UserService } from './userService';
import type { User } from './types';
```

---

## II. Spécifications TypeScript

### 2.1 Définition de types

**Privilégier l'interface pour définir les types d'objets** :
```typescript
// ✅ Bon
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Éviter (sauf si besoin de types union ou types mappés)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Définir des types pour toutes les API publiques** :
```typescript
// ✅ Bon
interface CreateUserDto {
  name: string;
  email: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: unknown;
  };
}

function createUser(data: CreateUserDto): Promise<ApiResponse<User>> {
  // ...
}

// ❌ Éviter
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Assertion de type

::: warning Interdiction d'utiliser any
Le type `any` est **absolument interdit** dans le code généré, vous devez utiliser `unknown` et ajouter des gardes de type.
:::

**Éviter d'utiliser `any`** :
```typescript
// ✅ Bon
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data est déduit comme User
}

// ❌ Éviter
const data: any = JSON.parse(text);
```

**Utiliser des gardes de type** :
```typescript
// ✅ Bon
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Éviter
const user = data as User; // Assertion non sûre
```

### 2.3 Génériques

**Utiliser des noms significatifs pour les paramètres génériques** :
```typescript
// ✅ Bon
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Éviter
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## III. Spécifications back-end

### 3.1 Routes Express

**Organiser les routes avec Router** :
```typescript
// ✅ Bon
// src/routes/items.ts
import { Router } from 'express';
import { itemController } from '@/controllers/item';
import { validateRequest } from '@/middleware/validation';
import { createItemSchema, updateItemSchema } from '@/validators/item';

const router = Router();

router.get('/', itemController.list);
router.get('/:id', itemController.getById);
router.post('/', validateRequest(createItemSchema), itemController.create);
router.put('/:id', validateRequest(updateItemSchema), itemController.update);
router.delete('/:id', itemController.remove);

export default router;
```

**Nommage RESTful** :
```typescript
// ✅ Bon
GET    /api/items         // Liste
GET    /api/items/:id     // Détails
POST   /api/items         // Création
PUT    /api/items/:id     // Mise à jour
DELETE /api/items/:id     // Suppression

// ❌ Éviter
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 Contrôleurs

**Garder les contrôleurs concis** :
```typescript
// ✅ Bon
export const itemController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const items = await itemService.findAll();
      res.json({ success: true, data: items });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const item = await itemService.create(req.body);
      res.status(201).json({ success: true, data: item });
    } catch (error) {
      next(error);
    }
  },
};
```

### 3.3 Couche de service

**Placer la logique métier dans la couche de service** :
```typescript
// ✅ Bon
// src/services/item.ts
export const itemService = {
  async findAll() {
    return prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
    });
  },

  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });
    if (!item) {
      throw new AppError(404, 'Item non trouvé');
    }
    return item;
  },

  async create(data: CreateItemDto) {
    return prisma.item.create({ data });
  },
};
```

### 3.4 Gestion des erreurs

**Utiliser une classe d'erreur unifiée** :
```typescript
// src/lib/errors.ts
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Utilisation
throw new AppError(404, 'Item non trouvé');
throw new AppError(400, 'Échec de la validation', errors);
```

**Middleware de gestion globale des erreurs** :
```typescript
// src/middleware/errorHandler.ts
export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        details: error.details,
      },
    });
  }

  // Masquer les erreurs internes en production
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Erreur interne du serveur'
      : error.message;

  res.status(500).json({
    success: false,
    error: { message },
  });
}
```

---

## IV. Spécifications front-end

### 4.1 Structure des composants

**Format des composants fonctionnels** :
```tsx
// ✅ Bon
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  children,
  onPress,
  loading = false,
  disabled = false,
}: ButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={loading || disabled}
      style={styles.container}
    >
      {loading ? (
        <ActivityIndicator />
      ) : (
        <Text style={styles.text}>{children}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    // ...
  },
  text: {
    // ...
  },
});
```

### 4.2 Spécifications des Hooks

**Les Hooks personnalisés retournent un objet** :
```typescript
// ✅ Bon
export function useItems() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = async () => {
    // ...
  };

  const create = async (data: CreateItemDto) => {
    // ...
  };

  return {
    items,
    loading,
    error,
    refresh,
    create,
  };
}
```

### 4.3 Spécifications de style

**Utiliser StyleSheet** :
```typescript
// ✅ Bon
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

// ❌ Éviter les styles en ligne
<View style={{ flex: 1, padding: 16 }}>
```

**Utiliser le système de thèmes** :
```typescript
// src/styles/theme.ts
export const theme = {
  colors: {
    primary: '#2563eb',
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    background: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  fontSize: {
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
  },
};
```

### 4.4 Navigation

**Paramètres de navigation typés** :
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// Utilisation
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## V. Spécifications Prisma

### 5.1 Définition du schéma

**Nommage des modèles en PascalCase singulier** :
```prisma
// ✅ Bon
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  posts     Post[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### 5.2 Spécifications de requête

**Utiliser select pour limiter les champs retournés** :
```typescript
// ✅ Bon (ne retourne que les champs nécessaires)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Éviter (retourne tous les champs y compris les informations sensibles)
const users = await prisma.user.findMany();
```

---

## VI. Spécifications de commentaires

### 6.1 Quand ajouter des commentaires

**Scénarios nécessitant des commentaires** :
- Logique métier complexe
- Décisions de conception non évidentes
- Raisons des optimisations de performance
- Interfaces publiques d'API

**Scénarios ne nécessitant pas de commentaires** :
- Code auto-explicatif
- Getter/setter simples
- Implémentations évidentes

### 6.2 Format des commentaires

```typescript
// ✅ Bon - explique pourquoi
// Utiliser la mise à jour optimiste pour améliorer l'expérience utilisateur, annuler en cas d'échec
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // Annuler
    throw new Error('Échec de la mise à jour');
  }
};

// ❌ Éviter - explique quoi (le code l'explique déjà)
// Définir items
setItems(newItems);
```

::: tip Principe des commentaires
Les commentaires devraient expliquer **pourquoi** et non **quoi**. Le bon code devrait être auto-explicatif, les commentaires ne complètent que les informations qui ne peuvent pas être vues directement dans le code.
:::

---

## VII. Spécifications des codes d'erreur

### 7.1 Structure des codes d'erreur

**Définition du format** :
```
[MODULE_MÉTIER]_[TYPE_ERREUR]_[ERREUR_SPÉCIFIQUE]

Exemple: AUTH_VALIDATION_INVALID_EMAIL
```

**Conventions de nommage** :
- **Tout en majuscules** : Utiliser SCREAMING_SNAKE_CASE
- **Module métier** : 2-4 caractères, représentant le module fonctionnel (ex: AUTH, USER, ITEM)
- **Type d'erreur** : Type d'erreur générique (ex: VALIDATION, NOT_FOUND, FORBIDDEN)
- **Erreur spécifique** : Description détaillée (optionnel)

### 7.2 Types d'erreur standard

#### 1. Erreurs de validation (VALIDATION)

**Code d'état HTTP** : 400

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `[MODULE]_VALIDATION_REQUIRED` | Champ requis manquant | Title non fourni lors de la création |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Format incorrect | Format d'email erroné |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Hors plage | amount < 0 ou > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Valeur en double | Email déjà existant |

**Exemples** :
```typescript
AUTH_VALIDATION_REQUIRED       // Champ requis manquant
AUTH_VALIDATION_INVALID_EMAIL  // Format d'email incorrect
ITEM_VALIDATION_OUT_OF_RANGE   // Montant hors plage
```

#### 2. Erreurs de non trouvé (NOT_FOUND)

**Code d'état HTTP** : 404

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `[MODULE]_NOT_FOUND` | Ressource inexistante | ID recherché inexistant |
| `[MODULE]_ROUTE_NOT_FOUND` | Route inexistante | Accès à un endpoint non défini |

**Exemples** :
```typescript
ITEM_NOT_FOUND   // Item ID inexistant
USER_NOT_FOUND   // User ID inexistant
```

#### 3. Erreurs d'autorisation (FORBIDDEN / UNAUTHORIZED)

**Code d'état HTTP** : 401 (non authentifié), 403 (sans autorisation)

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `AUTH_UNAUTHORIZED` | Non connecté ou Token invalide | JWT expiré |
| `[MODULE]_FORBIDDEN` | Accès non autorisé | Tentative d'accès aux données d'autrui |

**Exemples** :
```typescript
AUTH_UNAUTHORIZED     // Token expiré ou manquant
ITEM_FORBIDDEN        // Tentative de suppression de l'Item d'autrui
```

#### 4. Erreurs de conflit (CONFLICT)

**Code d'état HTTP** : 409

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `[MODULE]_CONFLICT_DUPLICATE` | Conflit de ressource | Création d'une ressource existante |
| `[MODULE]_CONFLICT_STATE` | Conflit d'état | Opération ne correspondant pas à l'état actuel |

**Exemples** :
```typescript
USER_CONFLICT_DUPLICATE   // Email déjà enregistré
ITEM_CONFLICT_STATE       // Projet terminé ne peut pas être supprimé
```

#### 5. Erreurs serveur (INTERNAL_ERROR)

**Code d'état HTTP** : 500

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `INTERNAL_ERROR` | Erreur interne inconnue | Échec de connexion à la base de données |
| `DATABASE_ERROR` | Erreur de base de données | Échec de requête Prisma |
| `EXTERNAL_SERVICE_ERROR` | Erreur de service externe | Échec d'API tierce |

**Exemples** :
```typescript
INTERNAL_ERROR             // Erreur serveur générique
DATABASE_ERROR             // Échec d'opération de base de données
EXTERNAL_SERVICE_ERROR     // Échec d'appel d'API tierce
```

#### 6. Erreurs de limitation de débit (RATE_LIMIT)

**Code d'état HTTP** : 429

| Code d'erreur | Description | Scénario d'exemple |
|---------------|-------------|---------------------|
| `RATE_LIMIT_EXCEEDED` | Dépassement de la limite de fréquence | Plus de 100 requêtes en 1 minute |

### 7.3 Format de réponse d'erreur

**Structure de réponse standard** :
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Code d'erreur
    message: string;        // Message d'erreur convivial pour l'utilisateur
    details?: unknown;      // Informations détaillées (optionnel, environnement de développement uniquement)
    timestamp?: string;     // Horodatage (optionnel)
    path?: string;          // Chemin de requête (optionnel)
  };
}
```

**Exemples de réponse** :

**Erreur de validation** :
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Champ requis manquant : title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Erreur de non trouvé** :
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Projet avec ID 123 introuvable"
  }
}
```

**Erreur serveur** :
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Échec de l'opération de base de données, veuillez réessayer plus tard"
  }
}
```

### 7.4 Définition des classes d'erreur

**`src/lib/errors.ts`** :
```typescript
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    public message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Erreur de validation
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Erreur de non trouvé
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Erreur d'autorisation
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Accès non autorisé') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Erreur de conflit
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Erreur serveur
export class InternalError extends AppError {
  constructor(message: string = 'Erreur interne du serveur') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Constantes de codes d'erreur

**`src/constants/error-codes.ts`** :
```typescript
// Codes d'erreur du module projet
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// Codes d'erreur du module utilisateur
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Codes d'erreur d'authentification
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Exemples d'utilisation

**Couche Service** :
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `Projet avec ID ${id} introuvable`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Champ requis manquant : title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'Le montant ne peut pas être négatif',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Gestion des erreurs front-end

**Mappage des codes d'erreur** :
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Erreurs de projet
  ITEM_NOT_FOUND: 'Projet inexistant',
  ITEM_VALIDATION_REQUIRED: 'Veuillez remplir les champs requis',
  ITEM_VALIDATION_INVALID_AMOUNT: 'Le montant doit être supérieur à 0',

  // Erreurs utilisateur
  USER_NOT_FOUND: 'Utilisateur inexistant',
  USER_CONFLICT_DUPLICATE: 'Cet email est déjà enregistré',
  USER_VALIDATION_INVALID_EMAIL: 'Format d\'email incorrect',

  // Erreurs d'authentification
  AUTH_UNAUTHORIZED: 'Veuillez vous connecter d\'abord',

  // Erreurs générales
  INTERNAL_ERROR: 'Erreur serveur, veuillez réessayer plus tard',
  RATE_LIMIT_EXCEEDED: 'Trop de requêtes, veuillez réessayer plus tard',

  // Erreur par défaut
  DEFAULT: 'Échec de l\'opération, veuillez réessayer plus tard',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**Client API** :
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Retourner une erreur standardisée
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## VIII. Interdictions

Les pratiques suivantes sont **absolument interdites** dans le code généré :

1. **Utiliser le type `any`** - Utiliser `unknown` et ajouter des gardes de type
2. **Coder en dur des informations sensibles** - Utiliser des variables d'environnement
3. **Ignorer la gestion des erreurs** - Toutes les opérations async nécessitent try-catch
4. **Utiliser `console.log` pour le débogage** - Utiliser des journaux structurés
5. **Styles en ligne** - Utiliser StyleSheet
6. **Ignorer les définitions de type** - Toutes les interfaces publiques ont besoin de types
7. **Utiliser `var`** - Utiliser `const` ou `let`
8. **Utiliser `==`** - Utiliser `===`
9. **Modifier les paramètres de fonction** - Créer de nouveaux objets/tableaux
10. **If imbriqués sur plus de 3 niveaux** - Retour anticipé ou division de fonction

---

## Questions fréquentes

### 1. Pourquoi l'utilisation du type any est-elle interdite ?

::: warning Sécurité des types
Le type `any` contourne la vérification de type de TypeScript, ce qui entraîne des erreurs d'exécution. Utiliser `unknown` et ajouter des gardes de type permet de maintenir la flexibilité tout en garantissant la sécurité des types.
:::

**Comparaison d'exemples** :
```typescript
// ❌ Dangereux
function processData(data: any) {
  return data.value; // Si data n'a pas de propriété value, l'erreur ne sera levée qu'à l'exécution
}

// ✅ Sécurisé
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Format de données invalide');
}
```

### 2. Comment partager les définitions de codes d'erreur entre front-end et back-end ?

Les méthodes suivantes peuvent être utilisées pour le partage :

1. **Partage de fichiers de types** : Exporter les types de codes d'erreur dans le projet back-end, le front-end les obtient via API ou synchronisation manuelle
2. **Monorepo** : Front-end et back-end dans le même dépôt, import direct possible
3. **OpenAPI/Swagger** : Définir les codes d'erreur dans la documentation API, le front-end génère automatiquement les types

### 3. Comment les codes d'erreur prennent-ils en charge le multilingue ?

**Pratique recommandée** :
```typescript
// Back-end : retourne le code d'erreur et les paramètres
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Front-end : mapper le code d'erreur vers les messages localisés
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  zh: { ITEM_VALIDATION_REQUIRED: '缺少必填字段' },
};
```

### 4. Comment déboguer les problèmes liés aux codes d'erreur ?

1. **Vérifier les journaux back-end** : Confirmer que le code d'erreur est correctement levé
2. **Vérifier le mappage front-end** : Confirmer qu'il y a une entrée correspondante dans `ERROR_MESSAGES`
3. **Utiliser le panneau réseau** : Voir la réponse d'erreur complète renvoyée par l'API
4. **Afficher les détails en environnement de développement** : Environnement de développement renvoie des informations d'erreur détaillées

---

## Résumé du cours

Dans ce cours, nous avons expliqué en détail les spécifications que le code généré par AI App Factory doit respecter :

- ✅ **Spécifications générales** : format de langage, conventions de nommage, organisation des fichiers
- ✅ **Spécifications TypeScript** : définition de types, assertions de type, génériques
- ✅ **Spécifications back-end** : routes Express, contrôleurs, couche de service, gestion des erreurs
- ✅ **Spécifications front-end** : structure des composants, spécifications des Hooks, spécifications de style, navigation
- ✅ **Spécifications Prisma** : définition du schéma, spécifications de requête
- ✅ **Spécifications de commentaires** : quand ajouter des commentaires, format des commentaires
- ✅ **Spécifications des codes d'erreur** : structure des codes d'erreur, types d'erreur standard, format de réponse d'erreur
- ✅ **Interdictions** : 10 pratiques absolument interdites

Suivre ces spécifications garantit que le code généré a une qualité cohérente, est maintenable et facile à comprendre.

---

## Prochain cours

> Le prochain cours abordera **[Détails de la pile technologique](../tech-stack/)**.
>
> Vous apprendrez :
> - La pile technologique utilisée par les applications générées
> - La combinaison Node.js + Express + Prisma + React Native
> - Les caractéristiques et les meilleures pratiques de chaque pile technologique

---

## Annexe : Référence du code source

<details>
<summary><strong>Cliquer pour développer et voir les emplacements du code source</strong></summary>

> Date de mise à jour : 2026-01-29

| Fonction | Chemin du fichier | Numéro de ligne |
|----------|-------------------|-----------------|
| Documentation des normes de code | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Spécifications des codes d'erreur | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Spécifications clés** :
- **Normes de code** : spécifications générales, spécifications TypeScript, spécifications back-end, spécifications front-end, spécifications Prisma, spécifications de commentaires, configuration ESLint, interdictions
- **Spécifications des codes d'erreur** : structure des codes d'erreur, types d'erreur standard (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), format de réponse d'erreur, gestion des erreurs front-end et back-end

**Configurations clés** :
- **ESLint back-end** : règle `@typescript-eslint/no-explicit-any` définie à `error`
- **ESLint front-end** : règle `@typescript-eslint/no-explicit-any` définie à `error`
- **Format des codes d'erreur** : `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Structure de réponse d'erreur** : contient `success`, `error.code`, `error.message`, `error.details`

</details>
