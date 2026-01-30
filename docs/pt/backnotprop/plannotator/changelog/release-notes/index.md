---
title: "Changelog: Histórico de Versões | Plannotator"
sidebarTitle: "Veja as Novidades"
subtitle: "Changelog: Histórico de Versões | Plannotator"
description: "Conheça o histórico de versões e novidades do Plannotator. Veja as principais atualizações, correções de bugs e melhorias de desempenho, incluindo revisão de código, anotação de imagens e integração com Obsidian."
tags:
  - "changelog"
  - "histórico de versões"
  - "novidades"
  - "correção de bugs"
order: 1
---

# Changelog: Histórico de Versões e Novidades do Plannotator

## O Que Você Vai Aprender

- ✅ Conhecer o histórico de versões e novidades do Plannotator
- ✅ Entender as principais atualizações e melhorias de cada versão
- ✅ Acompanhar correções de bugs e otimizações de desempenho

---

## Versão Mais Recente

### v0.6.7 (2026-01-24)

**Novos Recursos**:
- **Comment mode**: Adicionado modo de comentário, permitindo inserir comentários diretamente no plano
- **Type-to-comment shortcut**: Adicionado atalho para digitar comentários diretamente

**Melhorias**:
- Corrigido problema de sub-agent blocking no plugin OpenCode
- Corrigida vulnerabilidade de segurança de prompt injection (CVE)
- Melhorada a detecção inteligente de agent switching no OpenCode

**Referência do Código-fonte**:
- Comment mode: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L23-L42)
- Type-to-comment: [`packages/ui/components/AnnotationToolbar.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationToolbar.tsx#L80-L100)

---

### v0.6.6 (2026-01-20)

**Correções**:
- Corrigida vulnerabilidade de segurança CVE no plugin OpenCode
- Corrigido problema de sub-agent blocking para prevenir prompt injection
- Melhorada a lógica de detecção inteligente de agent switching

**Referência do Código-fonte**:
- OpenCode plugin: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L245-L280)
- Agent switching: [`packages/ui/utils/agentSwitch.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/agentSwitch.ts#L1-L50)

---

### v0.6.5 (2026-01-15)

**Melhorias**:
- **Aumento do hook timeout**: Hook timeout aumentado do valor padrão para 4 dias, adequado para planos de IA de longa duração
- **Correção da função copy**: Preservadas as quebras de linha na operação de cópia
- **Novo atalho Cmd+C**: Adicionado suporte ao atalho Cmd+C

**Referência do Código-fonte**:
- Hook timeout: [`apps/hook/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/hook/server/index.ts#L44-L50)
- Copy newlines: [`packages/ui/components/Viewer.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/Viewer.tsx#L150-L170)

---

### v0.6.4 (2026-01-10)

**Novos Recursos**:
- **Atalho Cmd+Enter**: Suporte para usar Cmd+Enter (Windows: Ctrl+Enter) para enviar aprovação ou feedback

**Melhorias**:
- Otimizada a experiência de operação por teclado

**Referência do Código-fonte**:
- Keyboard shortcuts: [`packages/ui/components/AnnotationPanel.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/AnnotationPanel.tsx#L323)
  (Funcionalidade do atalho Cmd+Enter implementada diretamente nos componentes)

---

### v0.6.3 (2026-01-05)

**Correções**:
- Corrigido problema de skip-title-generation-prompt

**Referência do Código-fonte**:
- Skip title: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L67-L71)

---

### v0.6.2 (2026-01-01)

**Correções**:
- Corrigido problema de arquivos HTML não incluídos no pacote npm do plugin OpenCode

**Referência do Código-fonte**:
- OpenCode plugin build: [`apps/opencode-plugin/index.ts`](https://github.com/backnotprop/plannotator/blob/main/apps/opencode-plugin/index.ts#L1-L50)

---

### v0.6.1 (2025-12-20)

**Novos Recursos**:
- **Integração com Bear**: Suporte para salvar automaticamente planos aprovados no aplicativo de notas Bear

**Melhorias**:
- Melhorada a lógica de geração de tags na integração com Obsidian
- Otimizado o mecanismo de detecção de vault do Obsidian

**Referência do Código-fonte**:
- Integração com Bear: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L234-L280)
- Integração com Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L220)

---

## Lançamentos de Recursos Importantes

### Funcionalidade de Code Review (2026-01)

**Novos Recursos**:
- **Ferramenta de revisão de código**: Execute o comando `/plannotator-review` para revisar visualmente o Git diff
- **Comentários por linha**: Clique no número da linha para selecionar o intervalo de código e adicionar anotações do tipo comment/suggestion/concern
- **Múltiplas visualizações de diff**: Suporte para alternar entre diferentes tipos de diff como uncommitted/staged/last-commit/branch
- **Integração com Agent**: Envie feedback estruturado para o agente de IA com suporte a resposta automática

**Como Usar**:
```bash
# Execute no diretório do projeto
/plannotator-review
```

**Tutoriais Relacionados**:
- [Fundamentos de Code Review](../../platforms/code-review-basics/)
- [Adicionando Anotações de Código](../../platforms/code-review-annotations/)
- [Alternando Visualizações de Diff](../../platforms/code-review-diff-types/)

**Referência do Código-fonte**:
- Code review server: [`packages/server/review.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/review.ts)
- Code review UI: [`packages/review-editor/App.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/review-editor/App.tsx)
- Ferramenta Git diff: [`packages/server/git.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/git.ts)

---

### Funcionalidade de Anotação de Imagens (2026-01)

**Novos Recursos**:
- **Upload de imagens**: Faça upload de anexos de imagem em planos e revisões de código
- **Ferramentas de anotação**: Três ferramentas de anotação disponíveis: pincel, seta e círculo
- **Anotação visual**: Anote diretamente nas imagens para melhorar o feedback de revisão

**Tutoriais Relacionados**:
- [Adicionando Anotações de Imagem](../../platforms/plan-review-images/)

**Referência do Código-fonte**:
- Image annotator: [`packages/ui/components/ImageAnnotator/index.tsx`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/components/ImageAnnotator/index.tsx)
- Upload API: [`packages/server/index.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/index.ts#L160-L180)

---

### Integração com Obsidian (2025-12)

**Novos Recursos**:
- **Detecção automática de vaults**: Detecta automaticamente o caminho do arquivo de configuração do vault do Obsidian
- **Salvamento automático de planos**: Planos aprovados são salvos automaticamente no Obsidian
- **Geração de frontmatter**: Inclui automaticamente frontmatter como created, source e tags
- **Extração inteligente de tags**: Extrai palavras-chave do conteúdo do plano como tags

**Configuração**:
Nenhuma configuração adicional necessária. O Plannotator detecta automaticamente o caminho de instalação do Obsidian.

**Tutoriais Relacionados**:
- [Integração com Obsidian](../../advanced/obsidian-integration/)

**Referência do Código-fonte**:
- Detecção do Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L136-L145)
- Salvamento no Obsidian: [`packages/server/integrations.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/integrations.ts#L180-L220)
- Geração de frontmatter: [`packages/ui/utils/obsidian.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/obsidian.ts#L50-L80)

---

### Funcionalidade de Compartilhamento por URL (2025-11)

**Novos Recursos**:
- **Compartilhamento sem backend**: Comprime planos e anotações no hash da URL, sem necessidade de servidor backend
- **Compartilhamento com um clique**: Clique em Export → Share as URL para gerar link de compartilhamento
- **Modo somente leitura**: Colaboradores podem visualizar ao abrir a URL, mas não podem enviar decisões

**Implementação Técnica**:
- Usa algoritmo de compressão Deflate
- Codificação Base64 + substituição de caracteres seguros para URL
- Suporta payload máximo de aproximadamente 7 tags

**Tutoriais Relacionados**:
- [Compartilhamento por URL](../../advanced/url-sharing/)

**Referência do Código-fonte**:
- Sharing utils: [`packages/ui/utils/sharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/utils/sharing.ts)
- Share hook: [`packages/ui/hooks/useSharing.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/ui/hooks/useSharing.ts)

---

### Modo Remoto/Devcontainer (2025-10)

**Novos Recursos**:
- **Suporte a modo remoto**: Use o Plannotator em ambientes remotos como SSH, devcontainer e WSL
- **Porta fixa**: Defina uma porta fixa através de variável de ambiente
- **Encaminhamento de porta**: Exibe automaticamente a URL para o usuário abrir manualmente o navegador
- **Controle do navegador**: Controle se o navegador abre automaticamente através da variável de ambiente `PLANNOTATOR_BROWSER`

**Variáveis de Ambiente**:
- `PLANNOTATOR_REMOTE=1`: Ativa o modo remoto
- `PLANNOTATOR_PORT=3000`: Define porta fixa
- `PLANNOTATOR_BROWSER=disabled`: Desativa abertura automática do navegador

**Tutoriais Relacionados**:
- [Modo Remoto/Devcontainer](../../advanced/remote-mode/)
- [Configuração de Variáveis de Ambiente](../../advanced/environment-variables/)

**Referência do Código-fonte**:
- Remote mode: [`packages/server/remote.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/remote.ts)
- Browser control: [`packages/server/browser.ts`](https://github.com/backnotprop/plannotator/blob/main/packages/server/browser.ts)

---

## Compatibilidade de Versões

| Versão Plannotator | Claude Code | OpenCode | Versão Mínima Bun |
| --- | --- | --- | --- |
| v0.6.x | 2.1.7+ | 1.0+ | 1.0+ |
| v0.5.x | 2.1.0+ | 0.9+ | 0.7+ |

**Recomendações de Atualização**:
- Mantenha o Plannotator na versão mais recente para obter os recursos e correções de segurança mais recentes
- Claude Code e OpenCode também devem ser mantidos atualizados

---

## Alterações de Licença

**Versão Atual (v0.6.7+)**: Business Source License 1.1 (BSL-1.1)

**Detalhes da Licença**:
- Permitido: uso pessoal, uso comercial interno
- Restrito: fornecer serviços hospedados, produtos SaaS
- Detalhes em [LICENSE](https://github.com/backnotprop/plannotator/blob/main/LICENSE)

---

## Feedback e Suporte

**Reportar Problemas**:
- GitHub Issues: https://github.com/backnotprop/plannotator/issues

**Sugestões de Recursos**:
- Envie um feature request no GitHub Issues

**Vulnerabilidades de Segurança**:
- Por favor, reporte vulnerabilidades de segurança através de canais privados

---

## Prévia da Próxima Lição

> Você agora conhece o histórico de versões e novidades do Plannotator.
>
> Próximos passos:
> - Volte ao [Início Rápido](../../start/getting-started/) para aprender como instalar e usar
> - Consulte as [Perguntas Frequentes](../../faq/common-problems/) para resolver problemas de uso
> - Leia a [Referência da API](../../appendix/api-reference/) para conhecer todos os endpoints da API
