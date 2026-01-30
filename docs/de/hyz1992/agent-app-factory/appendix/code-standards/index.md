---
title: "Code-Standards: TypeScript-Kodierungsstandards, Dateistruktur und Fehlercodes | AI App Factory Tutorial"
sidebarTitle: "Code-Standards"
subtitle: "Code-Standards: TypeScript-Kodierungsstandards, Dateistruktur und Fehlercodes"
description: "Lernen Sie die TypeScript-Kodierungsstandards, Dateistrukturen, Kommentaranforderungen und das Fehlercodesystem, denen AI App Factory generierter Code folgen sollte. Dieses Tutorial erklärt detailliert allgemeine Standards, TypeScript-Standards, Frontend- und Backend-Standards, Prisma-Standards, Kommentierungsstandards und ein einheitliches Fehlercodesystem, um Ihnen zu helfen, die Qualität des generierten Codes zu verstehen und zu pflegen."
tags:
  - "Anhang"
  - "Code-Standards"
  - "TypeScript"
  - "Fehlercodes"
prerequisite:
  - "start-init-project"
order: 230
---

# Code-Standards: TypeScript-Kodierungsstandards, Dateistruktur und Fehlercodes

## Was Sie nach Abschluss können

- ✅ Die Kodierungsstandards verstehen, denen AI App Factory generierter Code folgen sollte
- ✅ TypeScript-Typen und Benennungskonventionen beherrschen
- ✅ Die Dateistrukturen und Organisationsweisen für Frontend- und Backend-Code verstehen
- ✅ Die Verwendung des einheitlichen Fehlercodesystems lernen

## Kernkonzept

Der von AI App Factory generierte Code muss einheitlichen Kodierungsstandards folgen, um konsistente Codequalität, Wartbarkeit und Verständlichkeit zu gewährleisten. Diese Standards umfassen allgemeine Formatierung, das TypeScript-Typsystem, Frontend- und Backend-Architekturdesign, Kommentierungsstile und Fehlerbehandlungsmechanismen.

**Warum sind Code-Standards notwendig?**

- **Konsistenz**: Einheitlicher Code-Stil für alle Agent-generierten Codes, senkt die Lernkurve
- **Wartbarkeit**: Klare Benennung und Struktur erleichtern nachträgliche Änderungen
- **Lesbarkeit**: Standardisierter Code ermöglicht Teammitgliedern, die Absicht schnell zu verstehen
- **Sicherheit**: Strenge Typsysteme und Fehlerbehandlung reduzieren Laufzeitfehler

---

## 1. Allgemeine Standards

### 1.1 Sprache und Formatierung

| Projekt | Standard |
|--------|----------|
| Sprache | TypeScript (Strikter Modus) |
| Einrückung | 2 Leerzeichen |
| Zeilenende | LF (Unix) |
| Kodierung | UTF-8 |
| Maximale Zeilenlänge | 100 Zeichen (Code), 80 Zeichen (Kommentare) |
| Semikolon | Erforderlich |
| Anführungszeichen | Einfache Anführungszeichen (Strings), doppelte Anführungszeichen (JSX-Attribute) |

### 1.2 Benennungskonventionen

| Typ | Stil | Beispiel |
|------|------|----------|
| Dateiname (normal) | camelCase.ts | `userService.ts`, `apiClient.ts` |
| Dateiname (Komponente) | PascalCase.tsx | `Button.tsx`, `HomeScreen.tsx` |
| Dateiname (Test) | *.test.ts/tsx | `user.test.ts`, `Button.test.tsx` |
| Variable | camelCase | `userName`, `isLoading` |
| Funktion | camelCase | `getUserById`, `formatDate` |
| Klasse/Interface/Typ | PascalCase | `User`, `ApiResponse`, `CreateItemDto` |
| Konstante | UPPER_SNAKE_CASE | `API_URL`, `MAX_RETRY_COUNT` |
| Private Eigenschaft | Kein Unterstrich-Präfix | Verwenden Sie TypeScript-private-Schlüsselwort |
| Boolesche Variable | is/has/can-Präfix | `isActive`, `hasPermission`, `canEdit` |
| Event-Handler | handle-Präfix | `handleClick`, `handleSubmit` |
| Hook | use-Präfix | `useItems`, `useAuth` |

::: tip Benennungstipps
Gute Benennungen sollten **selbsterklärend** sein und keine zusätzlichen Kommentare zur Erklärung des Zwecks benötigen. Zum Beispiel ist `isValid` klarer als `check`, und `getUserById` ist spezifischer als `getData`.
:::

### 1.3 Dateiorganisation

**Jede Datei mit einer Verantwortung**:
- Eine Komponente pro Datei
- Ein Service pro Datei
- Verwandte Typen können in derselben types.ts-Datei platziert werden

**Import-Reihenfolge**:
```typescript
// 1. Node.js integrierte Module
import path from 'path';

// 2. Externe Abhängigkeiten
import express from 'express';
import { z } from 'zod';

// 3. Interne Module (absolute Pfade)
import { prisma } from '@/lib/prisma';
import { config } from '@/config';

// 4. Relative Pfad-Imports
import { UserService } from './userService';
import type { User } from './types';
```

---

## 2. TypeScript-Standards

### 2.1 Typdefinitionen

**Bevorzugte Verwendung von interface zur Definition von Objekttypen**:
```typescript
// ✅ Gut
interface User {
  id: number;
  name: string;
  email: string;
}

// ❌ Vermeiden (außer für Union-Typen oder Mapped-Typen)
type User = {
  id: number;
  name: string;
  email: string;
};
```

**Definition von Typen für alle öffentlichen APIs**:
```typescript
// ✅ Gut
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

// ❌ Vermeiden
function createUser(data: any): Promise<any> {
  // ...
}
```

### 2.2 Typbehauptungen

::: warning Verwendung von any verboten
Die Verwendung des `any`-Typs ist im generierten Code **absolut verboten**. Sie müssen `unknown` verwenden und Typen-Wächter hinzufügen.
:::

**Vermeiden Sie die Verwendung von `any`**:
```typescript
// ✅ Gut
function parseJson(text: string): unknown {
  return JSON.parse(text);
}

const data = parseJson(text);
if (isUser(data)) {
  // data wird als User inferiert
}

// ❌ Vermeiden
const data: any = JSON.parse(text);
```

**Verwendung von Typen-Wächtern**:
```typescript
// ✅ Gut
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Vermeiden
const user = data as User; // Unsichere Behauptung
```

### 2.3 Generics

**Verwendung von aussagekräftigen Namen für Generic-Parameter**:
```typescript
// ✅ Gut
interface Repository<TEntity> {
  findById(id: number): Promise<TEntity | null>;
  save(entity: TEntity): Promise<TEntity>;
}

// ❌ Vermeiden
interface Repository<T> {
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
}
```

---

## 3. Backend-Standards

### 3.1 Express-Routen

**Organisation von Routen mit Router**:
```typescript
// ✅ Gut
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

**RESTful-Benennung**:
```typescript
// ✅ Gut
GET    /api/items         // Liste
GET    /api/items/:id     // Details
POST   /api/items         // Erstellen
PUT    /api/items/:id     // Aktualisieren
DELETE /api/items/:id     // Löschen

// ❌ Vermeiden
GET    /api/getItems
POST   /api/createItem
POST   /api/items/delete/:id
```

### 3.2 Controller

**Controller einfach halten**:
```typescript
// ✅ Gut
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

### 3.3 Service-Layer

**Geschäftslogik im Service-Layer**:
```typescript
// ✅ Gut
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
      throw new AppError(404, 'Item nicht gefunden');
    }
    return item;
  },

  async create(data: CreateItemDto) {
    return prisma.item.create({ data });
  },
};
```

### 3.4 Fehlerbehandlung

**Verwendung einer einheitlichen Fehlerklasse**:
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

// Verwendung
throw new AppError(404, 'Item nicht gefunden');
throw new AppError(400, 'Validierung fehlgeschlagen', errors);
```

**Globale Fehlerbehandlung-Middleware**:
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

  // Interne Fehler in der Produktion ausblenden
  const message =
    process.env.NODE_ENV === 'production'
      ? 'Interner Serverfehler'
      : error.message;

  res.status(500).json({
    success: false,
    error: { message },
  });
}
```

---

## 4. Frontend-Standards

### 4.1 Komponentenstruktur

**Funktionskomponenten-Format**:
```tsx
// ✅ Gut
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

### 4.2 Hook-Standards

**Benutzerdefinierte Hooks geben Objekte zurück**:
```typescript
// ✅ Gut
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

### 4.3 Stil-Standards

**Verwendung von StyleSheet**:
```typescript
// ✅ Gut
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

// ❌ Inline-Stile vermeiden
<View style={{ flex: 1, padding: 16 }}>
```

**Verwendung des Theme-Systems**:
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

**Typsichere Navigationsparameter**:
```typescript
// src/navigation/types.ts
export type RootStackParamList = {
  Home: undefined;
  Detail: { id: number };
  Create: undefined;
};

// Verwendung
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
navigation.navigate('Detail', { id: 1 });
```

---

## 5. Prisma-Standards

### 5.1 Schema-Definition

**Modellbenennung verwendet PascalCase Singular**:
```prisma
// ✅ Gut
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

### 5.2 Abfrage-Standards

**Verwendung von select zum Einschränken der zurückgegebenen Felder**:
```typescript
// ✅ Gut (gibt nur benötigte Felder zurück)
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
  },
});

// ❌ Vermeiden (gibt alle Felder zurück, einschließlich sensibler Informationen)
const users = await prisma.user.findMany();
```

---

## 6. Kommentierungsstandards

### 6.1 Wann Kommentare hinzufügen

**Szenarien, die Kommentare erfordern**:
- Komplexe Geschäftslogik
- Nicht offensichtliche Designentscheidungen
- Gründe für Performance-Optimierungen
- Öffentliche APIs

**Szenarien, die keine Kommentare erfordern**:
- Selbsterklärender Code
- Einfache getter/setter
- Offensichtliche Implementierungen

### 6.2 Kommentarformat

```typescript
// ✅ Gut - erklärt warum
// Optimistische Updates für bessere Benutzererfahrung, Rollback bei Fehlern
const optimisticUpdate = async (id: number, data: UpdateDto) => {
  const previousData = items;
  setItems(prev => prev.map(item => item.id === id ? { ...item, ...data } : item));

  try {
    await api.update(id, data);
  } catch {
    setItems(previousData); // Rollback
    throw new Error('Update fehlgeschlagen');
  }
};

// ❌ Vermeiden - erklärt was (Code zeigt es bereits)
// Setze items
setItems(newItems);
```

::: tip Kommentierungsprinzip
Kommentare sollten **warum** erklären, nicht **was**. Guter Code sollte selbsterklärend sein; Kommentare ergänzen nur Informationen, die nicht direkt aus dem Code ersichtlich sind.
:::

---

## 7. Fehlercode-Standards

### 7.1 Fehlercodestruktur

**Formatdefinition**:
```
[Businessmodule]_[Fehlertyp]_[Spezifischer Fehler]

Beispiel: AUTH_VALIDATION_INVALID_EMAIL
```

**Benennungskonventionen**:
- **Großbuchstaben**: Verwendung von SCREAMING_SNAKE_CASE
- **Businessmodule**: 2-4 Zeichen, die das Funktionsmodul darstellen (z. B. AUTH, USER, ITEM)
- **Fehlertyp**: Generische Fehlertypen (z. B. VALIDATION, NOT_FOUND, FORBIDDEN)
- **Spezifischer Fehler**: Detaillierte Beschreibung (optional)

### 7.2 Standardfehlertypen

#### 1. Validierungsfehler (VALIDATION)

**HTTP-Statuscode**: 400

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `[MODULE]_VALIDATION_REQUIRED` | Fehlendes Pflichtfeld | title nicht beim Erstellen angegeben |
| `[MODULE]_VALIDATION_INVALID_FORMAT` | Falsches Format | Email-Format falsch |
| `[MODULE]_VALIDATION_OUT_OF_RANGE` | Außerhalb des Bereichs | amount < 0 oder > 10000 |
| `[MODULE]_VALIDATION_DUPLICATE` | Doppelter Wert | E-Mail bereits vorhanden |

**Beispiele**:
```typescript
AUTH_VALIDATION_REQUIRED       // Fehlendes Pflichtfeld
AUTH_VALIDATION_INVALID_EMAIL  // E-Mail-Format falsch
ITEM_VALIDATION_OUT_OF_RANGE   // Betrag außerhalb des Bereichs
```

#### 2. Nicht-gefunden-Fehler (NOT_FOUND)

**HTTP-Statuscode**: 404

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `[MODULE]_NOT_FOUND` | Ressource existiert nicht | Abgefragte ID existiert nicht |
| `[MODULE]_ROUTE_NOT_FOUND` | Route existiert nicht | Zugriff auf undefinierten Endpunkt |

**Beispiele**:
```typescript
ITEM_NOT_FOUND   // Item-ID existiert nicht
USER_NOT_FOUND   // User-ID existiert nicht
```

#### 3. Berechtigungsfehler (FORBIDDEN / UNAUTHORIZED)

**HTTP-Statuscode**: 401 (nicht authentifiziert), 403 (keine Berechtigung)

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `AUTH_UNAUTHORIZED` | Nicht eingeloggt oder Token ungültig | JWT abgelaufen |
| `[MODULE]_FORBIDDEN` | Keine Berechtigung zum Zugriff | Versuch, auf fremde Daten zuzugreifen |

**Beispiele**:
```typescript
AUTH_UNAUTHORIZED     // Token abgelaufen oder fehlend
ITEM_FORBIDDEN        // Versuch, fremdes Item zu löschen
```

#### 4. Konfliktfehler (CONFLICT)

**HTTP-Statuscode**: 409

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `[MODULE]_CONFLICT_DUPLICATE` | Ressourcenkonflikt | Erstellen einer bereits existierenden Ressource |
| `[MODULE]_CONFLICT_STATE` | Zustandskonflikt | Operation stimmt nicht mit aktuellem Zustand überein |

**Beispiele**:
```typescript
USER_CONFLICT_DUPLICATE   // E-Mail bereits registriert
ITEM_CONFLICT_STATE       // Abgeschlossenes Projekt kann nicht gelöscht werden
```

#### 5. Serverfehler (INTERNAL_ERROR)

**HTTP-Statuscode**: 500

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `INTERNAL_ERROR` | Unbekannter interner Fehler | Datenbankverbindung fehlgeschlagen |
| `DATABASE_ERROR` | Datenbankfehler | Prisma-Abfrage fehlgeschlagen |
| `EXTERNAL_SERVICE_ERROR` | Externer Service-Fehler | Drittanbieter-API fehlgeschlagen |

**Beispiele**:
```typescript
INTERNAL_ERROR             // Allgemeiner Serverfehler
DATABASE_ERROR             // Datenbankoperation fehlgeschlagen
EXTERNAL_SERVICE_ERROR     // Drittanbieter-API-Aufruf fehlgeschlagen
```

#### 6. Rate-Limit-Fehler (RATE_LIMIT)

**HTTP-Statuscode**: 429

| Fehlercode | Beschreibung | Beispielszenario |
|------------|--------------|------------------|
| `RATE_LIMIT_EXCEEDED` | Anforderungsfranzlimit überschritten | Über 100 Anfragen in 1 Minute |

### 7.3 Fehlerantwortformat

**Standardantwortstruktur**:
```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;           // Fehlercode
    message: string;        // Benutzerfreundliche Fehlermeldung
    details?: unknown;      // Detaillierte Informationen (optional, nur in Entwicklungsumgebung)
    timestamp?: string;     // Zeitstempel (optional)
    path?: string;          // Anforderungspfad (optional)
  };
}
```

**Antwortbeispiele**:

**Validierungsfehler**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Fehlendes Pflichtfeld: title",
    "details": {
      "field": "title",
      "constraint": "required"
    }
  }
}
```

**Nicht-gefunden-Fehler**:
```json
{
  "success": false,
  "error": {
    "code": "ITEM_NOT_FOUND",
    "message": "Projekt mit ID 123 nicht gefunden"
  }
}
```

**Serverfehler**:
```json
{
  "success": false,
  "error": {
    "code": "DATABASE_ERROR",
    "message": "Datenbankoperation fehlgeschlagen, bitte versuchen Sie es später erneut"
  }
}
```

### 7.4 Fehlerklassendefinition

**`src/lib/errors.ts`**:
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

// Validierungsfehler
export class ValidationError extends AppError {
  constructor(code: string, message: string, details?: unknown) {
    super(400, code, message, details);
  }
}

// Nicht-gefunden-Fehler
export class NotFoundError extends AppError {
  constructor(code: string, message: string) {
    super(404, code, message);
  }
}

// Berechtigungsfehler
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unautorisierter Zugriff') {
    super(401, 'AUTH_UNAUTHORIZED', message);
  }
}

export class ForbiddenError extends AppError {
  constructor(code: string, message: string) {
    super(403, code, message);
  }
}

// Konfliktfehler
export class ConflictError extends AppError {
  constructor(code: string, message: string) {
    super(409, code, message);
  }
}

// Serverfehler
export class InternalError extends AppError {
  constructor(message: string = 'Interner Serverfehler') {
    super(500, 'INTERNAL_ERROR', message);
  }
}
```

### 7.5 Fehlercode-Konstanten

**`src/constants/error-codes.ts`**:
```typescript
// Projektmodul-Fehlercodes
export const ITEM_ERRORS = {
  NOT_FOUND: 'ITEM_NOT_FOUND',
  VALIDATION_REQUIRED: 'ITEM_VALIDATION_REQUIRED',
  VALIDATION_INVALID_AMOUNT: 'ITEM_VALIDATION_INVALID_AMOUNT',
  FORBIDDEN: 'ITEM_FORBIDDEN',
} as const;

// Benutzermodul-Fehlercodes
export const USER_ERRORS = {
  NOT_FOUND: 'USER_NOT_FOUND',
  CONFLICT_DUPLICATE: 'USER_CONFLICT_DUPLICATE',
  VALIDATION_INVALID_EMAIL: 'USER_VALIDATION_INVALID_EMAIL',
} as const;

// Authentifizierungs-Fehlercodes
export const AUTH_ERRORS = {
  UNAUTHORIZED: 'AUTH_UNAUTHORIZED',
  VALIDATION_INVALID_EMAIL: 'AUTH_VALIDATION_INVALID_EMAIL',
  VALIDATION_REQUIRED: 'AUTH_VALIDATION_REQUIRED',
} as const;
```

### 7.6 Verwendungsbeispiele

**Service-Layer**:
```typescript
import { NotFoundError, ValidationError } from '@/lib/errors';
import { ITEM_ERRORS } from '@/constants/error-codes';

export const itemService = {
  async findById(id: number) {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundError(
        ITEM_ERRORS.NOT_FOUND,
        `Projekt mit ID ${id} nicht gefunden`
      );
    }

    return item;
  },

  async create(data: CreateItemDto) {
    if (!data.title) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_REQUIRED,
        'Fehlendes Pflichtfeld: title',
        { field: 'title' }
      );
    }

    if (data.amount < 0) {
      throw new ValidationError(
        ITEM_ERRORS.VALIDATION_INVALID_AMOUNT,
        'Betrag kann nicht negativ sein',
        { field: 'amount', value: data.amount }
      );
    }

    return prisma.item.create({ data });
  },
};
```

### 7.7 Frontend-Fehlerbehandlung

**Fehlercode-Mapping**:
```typescript
// client/src/constants/error-messages.ts
export const ERROR_MESSAGES: Record<string, string> = {
  // Projektfehler
  ITEM_NOT_FOUND: 'Projekt existiert nicht',
  ITEM_VALIDATION_REQUIRED: 'Bitte füllen Sie die Pflichtfelder aus',
  ITEM_VALIDATION_INVALID_AMOUNT: 'Betrag muss größer als 0 sein',

  // Benutzerfehler
  USER_NOT_FOUND: 'Benutzer existiert nicht',
  USER_CONFLICT_DUPLICATE: 'Diese E-Mail ist bereits registriert',
  USER_VALIDATION_INVALID_EMAIL: 'E-Mail-Format ist ungültig',

  // Authentifizierungsfehler
  AUTH_UNAUTHORIZED: 'Bitte melden Sie sich zuerst an',

  // Allgemeine Fehler
  INTERNAL_ERROR: 'Serverfehler, bitte versuchen Sie es später erneut',
  RATE_LIMIT_EXCEEDED: 'Zu viele Anfragen, bitte versuchen Sie es später erneut',

  // Standardfehler
  DEFAULT: 'Operation fehlgeschlagen, bitte versuchen Sie es später erneut',
};

export function getErrorMessage(code: string): string {
  return ERROR_MESSAGES[code] || ERROR_MESSAGES.DEFAULT;
}
```

**API-Client**:
```typescript
// client/src/api/client.ts
import axios, { AxiosError } from 'axios';
import { getErrorMessage } from '@/constants/error-messages';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

// Antwort-Interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorCode = error.response?.data?.error?.code || 'DEFAULT';
    const errorMessage = getErrorMessage(errorCode);

    // Gibt standardisierten Fehler zurück
    return Promise.reject({
      code: errorCode,
      message: errorMessage,
      originalError: error,
    });
  }
);
```

---

## 8. Verbotene Praktiken

Die folgenden Praktiken sind im generierten Code **absolut verboten**:

1. **Verwendung des `any`-Typs** - Verwenden Sie `unknown` und fügen Sie Typen-Wächter hinzu
2. **Hardcodierung sensibler Informationen** - Verwenden Sie Umgebungsvariablen
3. **Fehlerbehandlung ignorieren** - Alle async-Operationen benötigen try-catch
4. **Verwendung von `console.log` zum Debuggen** - Verwenden Sie strukturiertes Logging
5. **Inline-Stile** - Verwenden Sie StyleSheet
6. **Typdefinitionen überspringen** - Alle öffentlichen Schnittstellen benötigen Typen
7. **Verwendung von `var`** - Verwenden Sie `const` oder `let`
8. **Verwendung von `==`** - Verwenden Sie `===`
9. **Ändern von Funktionsparametern** - Erstellen Sie neue Objekte/Arrays
10. **Verschachtelung von ifs über 3 Ebenen** - Frühe Rückgabe oder Aufteilung von Funktionen

---

## Häufig gestellte Fragen

### 1. Warum ist die Verwendung des any-Typs verboten?

::: warning Typsicherheit
Der `any`-Typ umgeht die Typprüfung von TypeScript und führt zu Laufzeitfehlern. Die Verwendung von `unknown` mit Typen-Wächtern gewährleistet Typsicherheit bei gleichzeitiger Flexibilität.
:::

**Vergleichsbeispiele**:
```typescript
// ❌ Gefährlich
function processData(data: any) {
  return data.value; // Wenn data kein value-Attribut hat, tritt der Fehler erst zur Laufzeit auf
}

// ✅ Sicher
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: string }).value;
  }
  throw new Error('Ungültiges Datenformat');
}
```

### 2. Wie teilen sich Frontend und Backend Fehlercodedefinitionen?

Dies kann auf folgende Weise erfolgen:

1. **Gemeinsame Typdatei**: Exportieren von Fehlercode-Typen im Backend-Projekt, Frontend ruft über API ab oder synchronisiert manuell
2. **Monorepo**: Frontend und Backend im selben Repository, direkter Bezug möglich
3. **OpenAPI/Swagger**: Fehlercodes in der API-Dokumentation definieren, Frontend generiert Typen automatisch

### 3. Wie unterstützen Fehlercodes Mehrsprachigkeit?

**Empfohlene Vorgehensweise**:
```typescript
// Backend: Gibt Fehlercode und Parameter zurück
{
  "success": false,
  "error": {
    "code": "ITEM_VALIDATION_REQUIRED",
    "message": "Missing required field",
    "details": { "field": "title" }
  }
}

// Frontend: Mapped Fehlercode zu lokalisierten Nachrichten
export const ERROR_MESSAGES = {
  en: { ITEM_VALIDATION_REQUIRED: 'Missing required field' },
  de: { ITEM_VALIDATION_REQUIRED: 'Fehlendes Pflichtfeld' },
};
```

### 4. Wie debugge ich Probleme im Zusammenhang mit Fehlercodes?

1. **Backend-Protokolle prüfen**: Bestätigen, ob der Fehlercode korrekt geworfen wird
2. **Frontend-Mapping prüfen**: Bestätigen, ob es einen entsprechenden Eintrag in `ERROR_MESSAGES` gibt
3. **Netzwerk-Panel verwenden**: Vollständige Fehlerantwort der API prüfen
4. **Details in Entwicklungsumgebung anzeigen**: In der Entwicklungsumgebung werden detaillierte Fehlerinformationen zurückgegeben

---

## Zusammenfassung

In dieser Lektion haben wir detailliert die Standards erklärt, denen AI App Factory generierter Code folgen sollte:

- ✅ **Allgemeine Standards**: Sprache und Formatierung, Benennungskonventionen, Dateiorganisation
- ✅ **TypeScript-Standards**: Typdefinitionen, Typbehauptungen, Generics
- ✅ **Backend-Standards**: Express-Routen, Controller, Service-Layer, Fehlerbehandlung
- ✅ **Frontend-Standards**: Komponentenstruktur, Hook-Standards, Stil-Standards, Navigation
- ✅ **Prisma-Standards**: Schema-Definition, Abfrage-Standards
- ✅ **Kommentierungsstandards**: Wann Kommentare hinzufügen, Kommentarformat
- ✅ **Fehlercode-Standards**: Fehlercodestruktur, Standardfehlertypen, Fehlerantwortformat
- ✅ **Verbotene Praktiken**: 10 absolut verbotene Praktiken

Durch die Einhaltung dieser Standards kann sichergestellt werden, dass der generierte Code konsistent, wartbar und leicht verständlich ist.

---

## Vorschau auf die nächste Lektion

> In der nächsten Lektion lernen wir **[Tech-Stack-Details](../tech-stack/)**.
>
> Sie werden lernen:
> - Der Tech-Stack, den generierte Anwendungen verwenden
> - Die Kombination aus Node.js + Express + Prisma + React Native
> - Eigenschaften und Best Practices des jeweiligen Tech-Stacks

---

## Anhang: Quellcode-Referenz

<details>
<summary><strong>Klicken, um Quellcode-Positionen anzuzeigen</strong></summary>

> Aktualisierungsdatum: 2026-01-29

| Funktion | Dateipfad | Zeile |
|----------|------------|-------|
| Code-Standards-Dokument | [`source/hyz1992/agent-app-factory/policies/code-standards.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/code-standards.md) | 1-604 |
| Fehlercode-Standards | [`source/hyz1992/agent-app-factory/policies/error-codes.md`](https://github.com/hyz1992/agent-app-factory/blob/main/policies/error-codes.md) | 1-469 |

**Wichtige Standards**:
- **Code-Standards**: Allgemeine Standards, TypeScript-Standards, Backend-Standards, Frontend-Standards, Prisma-Standards, Kommentierungsstandards, ESLint-Konfiguration, Verbotene Praktiken
- **Fehlercode-Standards**: Fehlercodestruktur, Standardfehlertypen (VALIDATION, NOT_FOUND, FORBIDDEN, CONFLICT, INTERNAL_ERROR, RATE_LIMIT), Fehlerantwortformat, Frontend- und Backend-Fehlerbehandlung

**Wichtige Konfigurationen**:
- **Backend ESLint**: `@typescript-eslint/no-explicit-any`-Regel auf `error` gesetzt
- **Frontend ESLint**: `@typescript-eslint/no-explicit-any`-Regel auf `error` gesetzt
- **Fehlercode-Format**: `[MODULE]_[ERROR_TYPE]_[SPECIFIC]`
- **Fehlerantwortstruktur**: Enthält `success`, `error.code`, `error.message`, `error.details`

</details>
