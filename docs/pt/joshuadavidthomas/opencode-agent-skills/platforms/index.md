---
title: "Funcionalidades da Plataforma: Descoberta Consulta Carregamento de Skills | opencode-agent-skills"
sidebarTitle: "Dominar as Seis Principais Funcionalidades de Skills"
subtitle: "Funcionalidades da Plataforma: Descoberta Consulta Carregamento de Skills | opencode-agent-skills"
description: "Aprenda os módulos de funcionalidades principais do opencode-agent-skills, incluindo descoberta de skills, consulta, carregamento e recomendação automática. Domine as funcionalidades principais do plugin em 10 minutos."
order: 2
---

# Funcionalidades da Plataforma

Este capítulo explica em profundidade os módulos de funcionalidades principais do OpenCode Agent Skills, incluindo descoberta de skills, consulta, carregamento, recomendação automática, execução de scripts e leitura de arquivos. Após dominar estas funcionalidades, você poderá aproveitar ao máximo a capacidade de gerenciamento de skills do plugin, permitindo que a AI sirva seu trabalho de desenvolvimento com maior eficiência.

## Pré-requisitos

::: warning Antes de começar, confirme
Antes de estudar este capítulo, certifique-se de ter completado:

- [Instalar o OpenCode Agent Skills](../start/installation/) - Plugin instalado corretamente e em execução
- [Criar sua primeira skill](../start/creating-your-first-skill/) - Entender a estrutura básica de skills
:::

## Conteúdo do Capítulo

| Curso | Descrição | Ferramenta Principal |
|--- | --- | ---|
| [Mecanismo de Descoberta de Skills](./skill-discovery-mechanism/) | Entender de quais posições o plugin descobre skills automaticamente, dominar regras de prioridade | - |
| [Consultar e Listar Skills Disponíveis](./listing-available-skills/) | Usar ferramenta `get_available_skills` para buscar e filtrar skills | `get_available_skills` |
| [Carregar Skills no Contexto da Sessão](./loading-skills-into-context/) | Usar ferramenta `use_skill` para carregar skills, entender mecanismo de injeção XML | `use_skill` |
| [Recomendação Automática de Skills](./automatic-skill-matching/) | Entender princípio de correspondência semântica, permitir que a AI descubra skills relevantes automaticamente | - |
| [Executar Scripts de Skills](./executing-skill-scripts/) | Usar ferramenta `run_skill_script` para executar scripts automatizados | `run_skill_script` |
| [Ler Arquivos de Skills](./reading-skill-files/) | Usar ferramenta `read_skill_file` para acessar arquivos de suporte de skills | `read_skill_file` |

## Caminho de Aprendizado

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Ordem de Aprendizado Recomendada                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   1. Mecanismo de Descoberta  ──→  2. Listar Skills  ──→  3. Carregar Skills │
│         │                     │                    │                    │
│         │                     │                    │                    │
│         ▼                     ▼                    ▼                    │
│   Entender de onde vêm skills      Aprender buscar skills      Dominar método de carregamento │
│                                                                         │
│                              │                                          │
│                              ▼                                          │
│                                                                         │
│   4. Recomendação Automática  ←──  5. Executar Scripts  ←──  6. Ler Arquivos │
│         │                    │                  │                       │
│         ▼                    ▼                  ▼                       │
│   Entender correspondência inteligente      Executar automação      Acessar arquivos de suporte │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Recomenda-se estudar em ordem**:

1. **Primeiro aprenda o mecanismo de descoberta** - Entender de onde vêm as skills, como a prioridade é determinada
2. **Depois aprenda a consultar skills** - Dominar o uso da ferramenta `get_available_skills`
3. **Então aprenda a carregar skills** - Entender `use_skill` e o mecanismo de injeção XML
4. **Em seguida aprenda a recomendação automática** - Entender como funciona a correspondência semântica (opcional, mais focado em princípios)
5. **Finalmente aprenda scripts e arquivos** - Estas duas são funcionalidades avançadas, aprenda conforme necessário

::: tip Caminho Rápido
Se você só quer começar rapidamente, pode estudar apenas os três primeiros cursos (Descoberta → Consulta → Carregamento), os outros preencha conforme necessário.
:::

## Próximos Passos

Após completar este capítulo, você pode continuar aprendendo:

- [Funcionalidades Avançadas](../advanced/) - Entenda em profundidade compatibilidade com Claude Code, integração com Superpowers, prioridade de namespaces e outros tópicos avançados
- [Perguntas Frequentes](../faq/) - Consulte solução de problemas e instruções de segurança quando encontrar problemas
- [Apêndice](../appendix/) - Consulte referência de API e melhores práticas
