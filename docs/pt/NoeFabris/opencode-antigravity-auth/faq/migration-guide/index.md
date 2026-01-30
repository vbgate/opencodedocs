---
title: "Migração de Conta: Configuração Multi-Dispositivo | Antigravity Auth"
sidebarTitle: "Continuar em Outro Computador"
subtitle: "Migrar Conta: Configuração Entre Máquinas e Atualização de Versão"
description: "Aprenda como migrar arquivos de conta Antigravity Auth entre macOS/Linux/Windows, entenda o mecanismo de atualização automática de formato de armazenamento e resolva problemas de autenticação após migração."
tags:
  - "Migração"
  - "Multi-Máquina"
  - "Atualização de Versão"
  - "Gerenciamento de Conta"
prerequisite:
  - "quick-install"
order: 2
---

# Migrar Conta: Configuração Entre Máquinas e Atualização de Versão

## O Que Você Vai Aprender

- ✅ Migrar uma conta de uma máquina para outra
- ✅ Entender as mudanças de versão do formato de armazenamento (v1/v2/v3)
- ✅ Resolver problemas de autenticação após migração (erro invalid_grant)
- ✅ Compartilhar a mesma conta em múltiplos dispositivos

## O Problema Que Você Está Enfrentando

Comprou um novo computador e precisa continuar usando o Antigravity Auth no novo equipamento para acessar o Claude e o Gemini 3, mas não quer passar por todo o fluxo de autenticação OAuth novamente. Ou, após atualizar a versão do plugin, descobriu que os dados da conta antiga não estão mais funcionando.

## Quando Usar Esta Solução

- 📦 **Novo Dispositivo**: Migrar de um computador antigo para um novo
- 🔄 **Sincronização Multi-Dispositivo**: Compartilhar contas entre desktop e laptop
- 🆙 **Atualização de Versão**: Mudanças no formato de armazenamento após atualização do plugin
- 💾 **Backup e Restauração**: Fazer backup regular dos dados da conta

## Conceito Central

A **migração de conta** é o processo de copiar o arquivo da conta (antigravity-accounts.json) de uma máquina para outra. O plugin lida automaticamente com a atualização do formato de armazenamento.

### Visão Geral do Mecanismo de Migração

O formato de armazenamento é versionado (atualmente v3), e o plugin **lida automaticamente com a migração de versão**:

| Versão | Mudança Principal | Status Atual |
| --- | --- | --- |
| v1 → v2 | Estruturação do status de rate limit | ✅ Migração Automática |
| v2 → v3 | Suporte a pools duplos de quota (gemini-antigravity/gemini-cli) | ✅ Migração Automática |

Local do arquivo de armazenamento (multi-plataforma):

| Plataforma | Caminho |
| --- | --- |
| macOS/Linux | `~/.config/opencode/antigravity-accounts.json` |
| Windows | `%APPDATA%\opencode\antigravity-accounts.json` |

::: tip Lembrete de Segurança
O arquivo da conta contém o OAuth refresh token, **equivalente a uma senha**. Ao transferir, use métodos criptografados (ex: SFTP, ZIP criptografado).
:::

## 🎒 Antes de Começar

- [ ] O OpenCode está instalado na máquina de destino
- [ ] O plugin Antigravity Auth está instalado na máquina de destino: `opencode plugin add opencode-antigravity-auth@beta`
- [ ] Garantir que ambas as máquinas possam transferir arquivos com segurança (SSH, pendrive USB, etc.)

## Passo a Passo

### Passo 1: Localizar o Arquivo da Conta na Máquina de Origem

**Por que**
É necessário localizar o arquivo JSON que contém as informações da conta.

```bash
# macOS/Linux
ls -la ~/.config/opencode/antigravity-accounts.json

# Windows PowerShell
Get-ChildItem "$env:APPDATA\opencode\antigravity-accounts.json"
```

**Você deve ver**: O arquivo existe, contendo conteúdo semelhante a:

```json
{
  "version": 3,
  "accounts": [...],
  "activeIndex": 0
}
```

Se o arquivo não existir, significa que nenhuma conta foi adicionada ainda. Execute `opencode auth login` primeiro.

### Passo 2: Copiar o Arquivo da Conta para a Máquina de Destino

**Por que**
Transferir as informações da conta (refresh token e Project ID) para o novo dispositivo.

::: code-group

```bash [macOS/Linux]
# Método 1: Usando scp (via SSH)
scp ~/.config/opencode/antigravity-accounts.json user@new-machine:/tmp/

# Método 2: Usando pendrive USB
cp ~/.config/opencode/antigravity-accounts.json /Volumes/USB/
```

```powershell [Windows]
# Método 1: Usando PowerShell Copy-Item (via SMB)
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "\\new-machine\c$\Users\user\Downloads\"

# Método 2: Usando pendrive USB
Copy-Item "$env:APPDATA\opencode\antigravity-accounts.json" "E:\"
```

:::

**Você deve ver**: O arquivo foi copiado com sucesso para o diretório temporário da máquina de destino (ex: `/tmp/` ou `Downloads/`).

### Passo 3: Instalar o Plugin na Máquina de Destino

**Por que**
Garantir que a versão do plugin na máquina de destino seja compatível.

```bash
opencode plugin add opencode-antigravity-auth@beta
```

**Você deve ver**: Mensagem de sucesso na instalação do plugin.

### Passo 4: Colocar o Arquivo no Local Correto

**Por que**
O plugin só procura o arquivo da conta em um caminho fixo.

::: code-group

```bash [macOS/Linux]
# Criar diretório (se não existir)
mkdir -p ~/.config/opencode

# Copiar arquivo
cp /tmp/antigravity-accounts.json ~/.config/opencode/

# Verificar permissões
chmod 600 ~/.config/opencode/antigravity-accounts.json
```

```powershell [Windows]
# Copiar arquivo (o diretório será criado automaticamente)
Copy-Item "$env:Downloads\antigravity-accounts.json" "$env:APPDATA\opencode\"

# Verificar
Test-Path "$env:APPDATA\opencode\antigravity-accounts.json"
```

:::

**Você deve ver**: O arquivo existe no diretório de configuração.

### Passo 5: Verificar o Resultado da Migração

**Por que**
Confirmar que a conta foi carregada corretamente.

```bash
# Listar contas (isso aciona o plugin a carregar o arquivo da conta)
opencode auth login

# Se já existirem contas, será exibido:
# 2 account(s) saved:
#   1. user1@gmail.com
#   2. user2@gmail.com
# (a)dd new account(s) or (f)resh start? [a/f]:
```

Pressione `Ctrl+C` para sair (não é necessário adicionar novas contas).

**Você deve ver**: O plugin reconheceu com sucesso a lista de contas, incluindo os e-mails das contas migradas.

### Passo 6: Testar a Primeira Requisição

**Por que**
Verificar se o refresh token ainda é válido.

```bash
# No OpenCode, faça uma requisição de teste
# Selecione: google/antigravity-gemini-3-flash
```

**Você deve ver**: O modelo responde normalmente.

## Pontos de Verificação ✅

- [ ] A máquina de destino consegue listar as contas migradas
- [ ] A requisição de teste foi bem-sucedida (sem erro de autenticação)
- [ ] Não há mensagens de erro no log do plugin

## Avisos de Problemas Comuns

### Problema 1: Erro "API key missing"

**Sintoma**: Após a migração, as requisições retornam erro `API key missing`.

**Causa**: O refresh token pode ter expirado ou sido revogado pelo Google (ex: mudança de senha, evento de segurança).

**Solução**:

```bash
# Limpar o arquivo da conta e reautenticar
rm ~/.config/opencode/antigravity-accounts.json  # macOS/Linux
del "%APPDATA%\opencode\antigravity-accounts.json"  # Windows

opencode auth login
```

### Problema 2: Versão do Plugin Incompatível

**Sintoma**: Após a migração, o arquivo da conta não é carregado e o log mostra `Unknown storage version`.

**Causa**: A versão do plugin na máquina de destino é muito antiga e não suporta o formato de armazenamento atual.

**Solução**:

```bash
# Atualizar para a versão mais recente
opencode plugin add opencode-antigravity-auth@latest

# Testar novamente
opencode auth login
```

### Problema 3: Perda de Dados do Pool Duplo de Quota

**Sintoma**: Após a migração, o modelo Gemini só usa um pool de quota, sem fallback automático.

**Causa**: Durante a migração, apenas o `antigravity-accounts.json` foi copiado, mas o arquivo de configuração `antigravity.json` não foi migrado.

**Solução**:

Copie também o arquivo de configuração (se o `quota_fallback` estiver ativado):

::: code-group

```bash [macOS/Linux]
# Copiar arquivo de configuração
cp ~/.config/opencode/antigravity.json ~/.config/opencode/
```

```powershell [Windows]
# Copiar arquivo de configuração
Copy-Item "$env:APPDATA\opencode\antigravity.json" "$env:APPDATA\opencode\"
```

:::

### Problema 4: Erro de Permissão de Arquivo

**Sintoma**: No macOS/Linux, aparece erro `Permission denied`.

**Causa**: As permissões do arquivo estão incorretas, o plugin não consegue ler.

**Solução**:

```bash
# Corrigir permissões
chmod 600 ~/.config/opencode/antigravity-accounts.json
chown $USER ~/.config/opencode/antigravity-accounts.json
```

## Explicação Detalhada da Migração Automática de Formato de Armazenamento

Quando o plugin carrega as contas, detecta automaticamente a versão do armazenamento e realiza a migração:

```
v1 (versão antiga)
  ↓ migrateV1ToV2()
v2
  ↓ migrateV2ToV3()
v3 (versão atual)
```

**Regras de Migração**:
- v1 → v2: Dividir `rateLimitResetTime` em dois campos: `claude` e `gemini`
- v2 → v3: Dividir `gemini` em `gemini-antigravity` e `gemini-cli` (suporte a pools duplos de quota)
- Limpeza automática: Tempo de limite de taxa expirado é filtrado (`> Date.now()`)

::: info Desduplicação Automática
Ao carregar contas, o plugin remove duplicatas automaticamente com base no e-mail, mantendo apenas as contas mais recentes (ordenadas por `lastUsed` e `addedAt`).
:::

## Resumo da Aula

Passos principais para migração de conta:

1. **Localizar o arquivo**: Encontrar o `antigravity-accounts.json` na máquina de origem
2. **Copiar e transferir**: Transferir com segurança para a máquina de destino
3. **Colocar no local correto**: Mover para o diretório de configuração (`~/.config/opencode/` ou `%APPDATA%\opencode\`)
4. **Verificar e testar**: Executar `opencode auth login` para confirmar o reconhecimento

O plugin **lida automaticamente com a migração de versão**, não é necessário modificar manualmente o formato do arquivo de armazenamento. Mas se encontrar o erro `invalid_grant`, a reautenticação será necessária.

## Próxima Aula

> Na próxima aula, aprenderemos sobre **[Aviso de ToS](../tos-warning/)**.
>
> Você aprenderá:
> - Os riscos ao usar o Antigravity Auth
> - Como evitar a suspensão da conta
> - Restrições nos Termos de Serviço do Google

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-23

| Funcionalidade | Caminho do Arquivo | Linhas |
| --- | --- | --- |
| Definição do Formato de Armazenamento | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L128-L198) | 128-198 |
| Migração v1→v2 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L366-L395) | 366-395 |
| Migração v2→v3 | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L397-L431) | 397-431 |
| Carregamento de Contas (inclui migração automática) | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L433-L518) | 433-518 |
| Caminho do Diretório de Configuração | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L202-L213) | 202-213 |
| Lógica de Desduplicação de Arquivos | [`src/plugin/storage.ts`](https://github.com/NoeFabris/opencode-antigravity-auth/blob/main/src/plugin/storage.ts#L301-L364) | 301-364 |

**Interfaces Principais**:

- `AccountStorageV3` (formato de armazenamento v3):
  ```typescript
  interface AccountStorageV3 {
    version: 3;
    accounts: AccountMetadataV3[];
    activeIndex: number;
    activeIndexByFamily?: { claude?: number; gemini?: number; };
  }
  ```

- `AccountMetadataV3` (metadados da conta):
  ```typescript
  interface AccountMetadataV3 {
    email?: string;                    // E-mail da conta Google
    refreshToken: string;              // OAuth refresh token (core)
    projectId?: string;                // ID do projeto GCP
    managedProjectId?: string;         // ID do projeto gerenciado
    addedAt: number;                   // Timestamp de adição
    lastUsed: number;                  // Último uso
    lastSwitchReason?: "rate-limit" | "initial" | "rotation";
    rateLimitResetTimes?: RateLimitStateV3;  // Tempo de reset de rate limit (v3 suporta dual pools)
    coolingDownUntil?: number;          // Tempo de fim do cooldown
    cooldownReason?: CooldownReason;   // Motivo do cooldown
  }
  ```

- `RateLimitStateV3` (estado de rate limit v3):
  ```typescript
  interface RateLimitStateV3 {
    claude?: number;                  // Tempo de reset da quota Claude
    "gemini-antigravity"?: number;    // Tempo de reset da quota Gemini Antigravity
    "gemini-cli"?: number;            // Tempo de reset da quota Gemini CLI
  }
  ```

**Funções Principais**:
- `loadAccounts()`: Carrega o arquivo de contas, detecta versão automaticamente e migra (storage.ts:433)
- `migrateV1ToV2()`: Migra formato v1 para v2 (storage.ts:366)
- `migrateV2ToV3()`: Migra formato v2 para v3 (storage.ts:397)
- `deduplicateAccountsByEmail()`: Remove duplicatas por e-mail, mantém conta mais recente (storage.ts:301)
- `getStoragePath()`: Obtém caminho do arquivo de armazenamento, compatível multi-plataforma (storage.ts:215)

**Lógica de Migração**:
- Detecta campo `data.version` (storage.ts:446)
- v1: Primeiro migra para v2, depois para v3 (storage.ts:447-457)
- v2: Migra direto para v3 (storage.ts:458-468)
- v3: Sem migração necessária, carrega direto (storage.ts:469-470)
- Limpa automaticamente tempos de rate limit expirados (storage.ts:404-410)

</details>
