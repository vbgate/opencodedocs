---
title: "v1.2.0-v1.2.4: Suporte Copilot e Melhorias | opencode-mystatus"
sidebarTitle: "v1.2.0 - v1.2.4"
subtitle: "v1.2.0 - v1.2.4: Suporte Copilot e Melhorias"
description: "Entenda as atualizações v1.2.0-v1.2.4 do opencode-mystatus: novo suporte para consulta de cota GitHub Copilot, melhorias na documentação e correção de erros."
tags:
  - "changelog"
  - "v1.2.0"
  - "v1.2.1"
  - "v1.2.2"
  - "Copilot"
order: 1
---

# v1.2.0 - v1.2.4: novo suporte Copilot e melhorias na documentação

## Visão geral da versão

Esta atualização (v1.2.0 - v1.2.4) traz melhorias importantes de funcionalidade para o opencode-mystatus, sendo a mais notável o **novo suporte para consulta de cota do GitHub Copilot**. Também foram melhoradas a documentação de instalação e corrigidos erros de lint no código.

**Principais alterações**:
- ✅ Nova consulta de cota GitHub Copilot Premium Requests
- ✅ Integração com API interna GitHub
- ✅ Atualização da documentação em chinês e inglês
- ✅ Melhoria nas instruções de instalação, remoção de limitação de versão
- ✅ Correção de erros de lint no código

---

## [1.2.2] - 2026-01-14

### Melhorias na documentação

- **Atualização das instruções de instalação**: Removida a limitação de versão em `README.md` e `README.zh-CN.md`
- **Suporte de atualização automática**: Agora os usuários podem receber automaticamente a versão mais recente, sem necessidade de modificar o número da versão manualmente

**Impacto**: Ao instalar ou atualizar o plugin, não é mais necessário especificar uma versão específica; é possível obter a versão mais recente através da tag `@latest`.

---

## [1.2.1] - 2026-01-14

### Correção de bug

- **Correção de erro de lint**: Removida a importação não utilizada `maskString` em `copilot.ts`

**Impacto**: Melhoria da qualidade do código, passando na verificação ESLint, sem alterações funcionais.

---

## [1.2.0] - 2026-01-14

### Novas funcionalidades

#### Suporte GitHub Copilot

Esta é a funcionalidade principal desta atualização:

- **Nova consulta de cota Copilot**: Suporte para consultar o uso de GitHub Copilot Premium Requests
- **Integração com API interna GitHub**: Novo módulo `copilot.ts`, obtendo dados de cota através da API GitHub
- **Atualização da documentação**: Adicionada documentação relacionada ao Copilot em `README.md` e `README.zh-CN.md`

**Métodos de autenticação suportados**:
1. **Fine-grained PAT** (recomendado): Fine-grained Personal Access Token criado pelo usuário
2. **OAuth Token**: OAuth Token OpenCode (requer permissões do Copilot)

**Conteúdo da consulta**:
- Total e uso de Premium Requests
- Detalhes de uso por modelo
- Identificação do tipo de assinatura (free, pro, pro+, business, enterprise)

**Exemplo de uso**:

```bash
# Executar comando mystatus
/mystatus

# Você verá a seção GitHub Copilot na saída
Account:        GitHub Copilot (@username)

  Premium Requests  ██████████░░░░░░░░░░ 75% (75/300)

  模型使用明细:
    gpt-4: 150 Requests
    claude-3.5-sonnet: 75 Requests

  计费周期: 2026-01
```

---

## Guia de atualização

### Atualização automática (recomendada)

Como a versão v1.2.2 atualizou as instruções de instalação, removendo a limitação de versão, agora você pode:

```bash
# Instalar usando a tag latest
opencode plugin install vbgate/opencode-mystatus@latest
```

### Atualização manual

Se você já instalou uma versão anterior, pode atualizar diretamente:

```bash
# Desinstalar versão antiga
opencode plugin uninstall vbgate/opencode-mystatus

# Instalar nova versão
opencode plugin install vbgate/opencode-mystatus@latest
```

### Configurar Copilot

Após atualizar, você pode configurar a consulta de cota do GitHub Copilot:

#### Método 1: Usar Fine-grained PAT (recomendado)

1. Crie um Fine-grained Personal Access Token no GitHub
2. Crie o arquivo de configuração `~/.config/opencode/copilot-quota-token.json`:

```json
{
  "token": "ghp_your_fine_grained_pat_here",
  "username": "your-github-username",
  "tier": "pro"
}
```

3. Execute `/mystatus` para consultar a cota

#### Método 2: Usar OAuth Token OpenCode

Certifique-se de que seu OAuth Token OpenCode tenha permissões do Copilot, execute `/mystatus` diretamente.

::: tip Dica
Para obter configuração detalhada de autenticação do Copilot, consulte o tutorial [Configuração de autenticação Copilot](/pt/vbgate/opencode-mystatus/advanced/copilot-auth/).
:::

---

## Problemas conhecidos

### Problemas de permissão do Copilot

Se seu OAuth Token OpenCode não tiver permissões do Copilot, uma mensagem de aviso será exibida durante a consulta. Solução:

1. Use Fine-grained PAT (recomendado)
2. Reautorize o OpenCode, garantindo que a permissão Copilot esteja marcada

Para obter a solução detalhada, consulte o tutorial [Configuração de autenticação Copilot](/pt/vbgate/opencode-mystatus/advanced/copilot-auth/).

---

## Planos futuros

Versões futuras podem incluir as seguintes melhorias:

- [ ] Suporte para mais tipos de assinatura GitHub Copilot
- [ ] Otimizar o formato de exibição da cota Copilot
- [ ] Adicionar funcionalidade de alerta de cota
- [ ] Suporte para mais plataformas de IA

---

## Documentação relacionada

- [Consulta de cota Copilot](/pt/vbgate/opencode-mystatus/platforms/copilot-usage/)
- [Configuração de autenticação Copilot](/pt/vbgate/opencode-mystatus/advanced/copilot-auth/)
- [Solução de problemas comuns](/pt/vbgate/opencode-mystatus/faq/troubleshooting/)

---

## Registro de alterações completo

Para ver todas as alterações das versões, visite [GitHub Releases](https://github.com/vbgate/opencode-mystatus/releases).
