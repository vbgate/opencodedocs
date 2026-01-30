---
title: "Avancé: Gestion de l'Écosystème de Compétences | opencode-agent-skills"
sidebarTitle: "Maîtriser l'Écosystème Complexe de Compétences"
subtitle: "Fonctionnalités Avancées"
order: 3
description: "Maîtrisez les fonctionnalités avancées d'opencode-agent-skills, y compris la compatibilité Claude Code, l'intégration Superpowers, les espaces de noms et le mécanisme de compression de contexte, pour améliorer vos capacités de gestion des compétences."
---

# Fonctionnalités Avancées

Ce chapitre explore en profondeur les fonctionnalités avancées d'OpenCode Agent Skills, notamment la compatibilité avec Claude Code, l'intégration des flux de travail Superpowers, le système de priorité des espaces de noms et le mécanisme de résilience à la compression de contexte. Après avoir maîtrisé ces concepts, vous serez mieux équipé pour gérer des écosystèmes de compétences complexes et garantir la disponibilité des compétences lors des sessions prolongées.

## Prérequis

::: warning Veuillez confirmer avant de commencer
Avant d'étudier ce chapitre, assurez-vous d'avoir complété :

- [Installation d'OpenCode Agent Skills](../start/installation/) - Le plugin est correctement installé et fonctionnel
- [Créer votre première compétence](../start/creating-your-first-skill/) - Comprendre la structure de base des compétences
- [Mécanisme de découverte des compétences en détail](../platforms/skill-discovery-mechanism/) - Comprendre les emplacements de découverte des compétences
- [Charger les compétences dans le contexte de session](../platforms/loading-skills-into-context/) - Maîtriser l'utilisation de l'outil `use_skill`
:::

## Contenu de ce Chapitre

<div class="grid-cards">

<a href="./claude-code-compatibility/" class="card">
  <h3>Compatibilité des Compétences Claude Code</h3>
  <p>Comprendre comment le plugin est compatible avec le système de compétences et plugins de Claude Code, maîtriser le mécanisme de mappage des outils et réutiliser l'écosystème de compétences Claude.</p>
</a>

<a href="./superpowers-integration/" class="card">
  <h3>Intégration des Flux de Travail Superpowers</h3>
  <p>Configurer et utiliser le mode Superpowers pour obtenir des directives strictes sur les flux de développement logiciel, améliorer l'efficacité du développement et la qualité du code.</p>
</a>

<a href="./namespaces-and-priority/" class="card">
  <h3>Espaces de Noms et Priorité des Compétences</h3>
  <p>Comprendre le système d'espaces de noms des compétences et les règles de priorité de découverte, résoudre les conflits de compétences portant le même nom et contrôler précisément la source des compétences.</p>
</a>

<a href="./context-compaction-resilience/" class="card">
  <h3>Mécanisme de Résilience à la Compression de Contexte</h3>
  <p>Comprendre comment les compétences restent disponibles lors des sessions prolongées, maîtriser les moments de déclenchement et le processus d'exécution de la récupération après compression.</p>
</a>

</div>

## Parcours d'Apprentissage

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Ordre d'Apprentissage Recommandé                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Compatibilité Claude Code ──→ 2. Intégration Superpowers ──→ 3. Espaces de Noms │
│         │                              │                              │             │
│         ▼                              ▼                              ▼             │
│   Réutiliser les compétences Claude  Activer les directives de flux    Contrôler précisément la source │
│                                                                         │
│                                         │                                      │
│                                         ▼                                      │
│                                                                         │
│                         4. Résilience à la Compression de Contexte              │
│                                         │                                      │
│                                         ▼                                      │
│                         Persistance des compétences en session prolongée       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Apprentissage recommandé dans l'ordre** :

1. **Commencez par la compatibilité Claude Code** - Si vous avez des compétences Claude Code ou souhaitez utiliser les compétences du marketplace Claude, c'est la première étape
2. **Puis l'intégration Superpowers** - Pour les utilisateurs souhaitant des directives de flux strictes, apprenez comment activer et configurer
3. **Ensuite les espaces de noms** - Lorsque le nombre de compétences augmente et que des conflits de noms apparaissent, ce point est crucial
4. **Enfin la récupération après compression** - Comprendre comment les compétences restent disponibles lors des sessions prolongées, contenu plus théorique

::: tip Apprentissage selon les besoins
- **Migration depuis Claude Code** : Concentrez-vous sur la leçon 1 (compatibilité) et la leçon 3 (espaces de noms)
- **Souhaitez des flux de travail standardisés** : Concentrez-vous sur la leçon 2 (Superpowers)
- **Rencontrez des conflits de compétences** : Consultez directement la leçon 3 (espaces de noms)
- **Perte de compétences en session prolongée** : Consultez directement la leçon 4 (récupération après compression)
:::

## Prochaines Étapes

Après avoir terminé ce chapitre, vous pouvez continuer avec :

- [Dépannage des Problèmes Courants](../faq/troubleshooting/) - Consultez le guide de dépannage en cas de problèmes
- [Considérations de Sécurité](../faq/security-considerations/) - Comprendre les mécanismes de sécurité du plugin et les meilleures pratiques
- [Référence des Outils API](../appendix/api-reference/) - Consulter les paramètres détaillés et les valeurs de retour de tous les outils disponibles
- [Meilleures Pratiques de Développement de Compétences](../appendix/best-practices/) - Maîtriser les techniques et normes pour écrire des compétences de haute qualité

<style>
.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin: 1.5rem 0;
}

.grid-cards .card {
  display: block;
  padding: 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  transition: border-color 0.25s, box-shadow 0.25s;
}

.grid-cards .card:hover {
  border-color: var(--vp-c-brand-1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.grid-cards .card h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.grid-cards .card p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  line-height: 1.5;
}
</style>
