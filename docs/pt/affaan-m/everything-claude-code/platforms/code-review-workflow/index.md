---
title: "Revisão de Código: Fluxo /code-review | Everything Claude Code"
subtitle: "Revisão de Código: Fluxo /code-review"
sidebarTitle: "Revise antes do commit"
description: "Aprenda a usar o comando /code-review. Domine as verificações de qualidade e segurança com os agents code-reviewer e security-reviewer, identificando vulnerabilidades e problemas antes do commit."
tags:
  - "code-review"
  - "security"
  - "code-quality"
  - "owasp"
prerequisite:
  - "start-quickstart"
order: 80
---

# Fluxo de Revisão de Código: /code-review e Auditoria de Segurança

## O que você vai aprender

**Revisão de código** é uma etapa crucial para garantir qualidade e segurança. Este tutorial ajuda você a:

- ✅ Usar o comando `/code-review` para verificar automaticamente as alterações de código
- ✅ Entender a diferença entre o agent code-reviewer e o security-reviewer
- ✅ Dominar a checklist de segurança (OWASP Top 10)
- ✅ Detectar e corrigir vulnerabilidades comuns (SQL injection, XSS, chaves hardcoded, etc.)
- ✅ Aplicar padrões de qualidade de código (tamanho de funções, comprimento de arquivos, cobertura de testes, etc.)
- ✅ Entender os critérios de aprovação (CRITICAL, HIGH, MEDIUM, LOW)

## Seu problema atual

Você terminou de escrever o código e está pronto para commitar, mas:

- ❌ Não sabe se há vulnerabilidades de segurança no código
- ❌ Preocupa-se em ter deixado passar problemas de qualidade
- ❌ Não tem certeza se seguiu as melhores práticas
- ❌ Verificação manual é demorada e propensa a erros
- ❌ Quer encontrar problemas automaticamente antes do commit

O fluxo de revisão de código do **Everything Claude Code** resolve esses problemas:

- **Verificação automatizada**: O comando `/code-review` analisa automaticamente todas as alterações
- **Revisão especializada**: O agent code-reviewer foca em qualidade, o security-reviewer foca em segurança
- **Classificação padronizada**: Problemas são categorizados por severidade (CRITICAL, HIGH, MEDIUM, LOW)
- **Sugestões detalhadas**: Cada problema inclui recomendações específicas de correção

## Quando usar esta técnica

**Antes de cada commit** você deve executar a revisão de código:

- ✅ Após concluir código de nova funcionalidade
- ✅ Após corrigir bugs
- ✅ Após refatorar código
- ✅ Ao adicionar endpoints de API (obrigatório executar security-reviewer)
- ✅ Código que processa entrada do usuário (obrigatório executar security-reviewer)
- ✅ Código envolvendo autenticação/autorização (obrigatório executar security-reviewer)

::: tip Melhor prática
Crie o hábito: antes de cada `git commit`, execute `/code-review`. Se houver problemas CRITICAL ou HIGH, corrija antes de commitar.
:::

## 🎒 Preparação

**O que você precisa**:
- Everything Claude Code instalado (se ainda não instalou, veja o [Início Rápido](../../start/quickstart/))
- Algumas alterações de código (pode usar `/tdd` para escrever algum código primeiro)
- Conhecimento básico de operações Git

**O que você não precisa**:
- Não precisa ser especialista em segurança (o agent detecta para você)
- Não precisa memorizar todas as melhores práticas de segurança (o agent vai lembrá-lo)

---

## Conceito central

Everything Claude Code oferece dois agents especializados de revisão:

### Agent code-reviewer

**Foca em qualidade de código e melhores práticas**, verificando:

- **Qualidade de código**: Tamanho de funções (>50 linhas), comprimento de arquivos (>800 linhas), profundidade de aninhamento (>4 níveis)
- **Tratamento de erros**: Falta de try/catch, instruções console.log
- **Padrões de código**: Convenções de nomenclatura, código duplicado, padrões de imutabilidade
- **Melhores práticas**: Uso de emojis, TODO/FIXME sem ticket, JSDoc ausente
- **Cobertura de testes**: Código novo sem testes

**Cenário de uso**: Todas as alterações de código devem passar pelo code-reviewer.

### Agent security-reviewer

**Foca em vulnerabilidades e ameaças de segurança**, verificando:

- **OWASP Top 10**: SQL injection, XSS, CSRF, bypass de autenticação, etc.
- **Vazamento de chaves**: API keys, senhas, tokens hardcoded
- **Validação de entrada**: Validação de entrada do usuário ausente ou inadequada
- **Autenticação e autorização**: Verificações inadequadas de identidade e permissões
- **Segurança de dependências**: Pacotes desatualizados ou com vulnerabilidades conhecidas

**Cenário de uso**: Código sensível à segurança (API, autenticação, pagamentos, entrada do usuário) deve obrigatoriamente passar pelo security-reviewer.

### Níveis de severidade dos problemas

| Nível | Significado | Bloqueia commit? | Exemplo |
| --- | --- | --- | --- |
| **CRITICAL** | Vulnerabilidade grave ou problema crítico de qualidade | ❌ Deve bloquear | API key hardcoded, SQL injection |
| **HIGH** | Problema importante de segurança ou qualidade | ❌ Deve bloquear | Falta tratamento de erro, vulnerabilidade XSS |
| **MEDIUM** | Problema de prioridade média | ⚠️ Pode commitar com cautela | Uso de emoji, JSDoc ausente |
| **LOW** | Problema menor | ✓ Pode corrigir depois | Formatação inconsistente, números mágicos |

---

## Mãos à obra: Sua primeira revisão de código

### Passo 1: Criar algumas alterações de código

Primeiro use `/tdd` para escrever um endpoint de API simples (com algumas falhas de segurança):

```bash
/tdd
```

Peça ao Claude Code para criar uma API de login de usuário, o código será algo assim:

```typescript
// src/api/login.ts
export async function loginUser(email: string, password: string) {
  const query = `SELECT * FROM users WHERE email = '${email}'`  // ❌ Risco de SQL injection
  const user = await db.query(query)
  
  if (user.password === password) {  // ❌ Comparação de senha em texto plano
    const token = generateToken(user.id)
    console.log('User logged in:', { email, password })  // ❌ Vazamento de senha no log
    return { token }
  }
}
```

**Por quê**
Este código contém múltiplas falhas de segurança e problemas de qualidade, ideal para demonstrar a funcionalidade de revisão de código.

**O que você deve ver**: Arquivo de código criado.

---

### Passo 2: Executar a revisão de código

Agora execute o comando `/code-review`:

```bash
/code-review
```

**Por quê**
`/code-review` chamará automaticamente o agent code-reviewer para verificar todas as alterações não commitadas.

**O que você deve ver**: O agent começa a analisar o código e depois exibe o relatório de revisão.

---

### Passo 3: Analisar o relatório de revisão

O code-reviewer produzirá um relatório similar a este:

```markdown
# Code Review Report

## Critical Issues (Fix Immediately)

### 1. [CRITICAL] Hardcoded credentials
**File:** src/api/login.ts:3
**Issue:** Password logging in console
**Fix:** Remove password from logs, only log user ID

```typescript
// ❌ Bad
console.log('User logged in:', { email, password })

// ✓ Good
console.log('User logged in:', { email, userId: user.id })
```

---

### 2. [CRITICAL] SQL injection vulnerability
**File:** src/api/login.ts:2
**Issue:** String concatenation in SQL query
**Fix:** Use parameterized queries

```typescript
// ❌ Bad
const query = `SELECT * FROM users WHERE email = '${email}'`

// ✓ Good
const { data } = await supabase
  .from('users')
  .select('*')
  .eq('email', email)
```

---

## High Issues (Fix Before Production)

### 3. [HIGH] Plaintext password comparison
**File:** src/api/login.ts:4
**Issue:** Password stored in plaintext
**Fix:** Use bcrypt to hash passwords

```typescript
// ❌ Bad
if (user.password === password) {

// ✓ Good
import bcrypt from 'bcrypt'
const isValid = await bcrypt.compare(password, user.password)
```

---

## Recommendations

1. Add input validation for email format
2. Add rate limiting to prevent brute force attacks
3. Use JWT tokens instead of generating custom tokens

## Approval Status

❌ BLOCKED - 2 CRITICAL issues found

Please fix all CRITICAL and HIGH issues before committing.
```

**Por quê**
O relatório é categorizado por severidade, cada problema inclui localização, descrição, sugestão de correção e exemplo de código.

**O que você deve ver**: Relatório de revisão claro, apontando todos os problemas e sugestões de correção.

---

### Passo 4: Corrigir os problemas

Corrija o código conforme o relatório:

```typescript
// src/api/login.ts
import bcrypt from 'bcrypt'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function loginUser(input: unknown) {
  // Validação de entrada
  const validated = LoginSchema.parse(input)
  
  // Query parametrizada (previne SQL injection)
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.email)
    .single()
  
  if (!user) {
    throw new Error('Invalid credentials')
  }
  
  // Comparação de senha com hash
  const isValid = await bcrypt.compare(validated.password, user.password_hash)
  
  if (isValid) {
    const token = generateToken(user.id)
    console.log('User logged in:', { email: validated.email, userId: user.id })
    return { token }
  }
  
  throw new Error('Invalid credentials')
}
```

**Por quê**
Corrigir todos os problemas CRITICAL e HIGH, adicionar validação de entrada e comparação de senha com hash.

**O que você deve ver**: Código atualizado, vulnerabilidades de segurança eliminadas.

---

### Passo 5: Revisar novamente

Execute `/code-review` novamente:

```bash
/code-review
```

**Por quê**
Verificar que todos os problemas foram corrigidos, garantindo que o código pode ser commitado.

**O que você deve ver**: Um relatório de aprovação similar a este:

```markdown
# Code Review Report

## Summary

- **Critical Issues:** 0 ✓
- **High Issues:** 0 ✓
- **Medium Issues:** 1 ⚠️
- **Low Issues:** 1 💡

## Medium Issues (Fix When Possible)

### 1. [MEDIUM] Missing JSDoc for public API
**File:** src/api/login.ts:9
**Issue:** loginUser function missing documentation
**Fix:** Add JSDoc comments

```typescript
/**
 * Authenticates a user with email and password
 * @param input - Login credentials (email, password)
 * @returns Object with JWT token
 * @throws Error if credentials invalid
 */
export async function loginUser(input: unknown) {
```

---

## Low Issues (Consider Fixing)

### 2. [LOW] Add rate limiting
**File:** src/api/login.ts:9
**Issue:** Login endpoint lacks rate limiting
**Fix:** Add express-rate-limit middleware

```typescript
import rateLimit from 'express-rate-limit'

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts per window
})

app.post('/api/login', loginLimiter, loginUser)
```

---

## Approval Status

✅ APPROVED - No CRITICAL or HIGH issues

**Note:** Medium and Low issues can be fixed in follow-up commits.
```

**O que você deve ver**: Revisão aprovada, código pronto para commit.

---

### Passo 6: Revisão de segurança dedicada (opcional)

Se seu código envolve endpoints de API, autenticação, pagamentos ou outras funcionalidades sensíveis à segurança, você pode chamar especificamente o security-reviewer:

```bash
/security-reviewer
```

**Por quê**
O security-reviewer realiza uma análise mais profunda do OWASP Top 10, verificando mais padrões de vulnerabilidades de segurança.

**O que você deve ver**: Relatório detalhado de revisão de segurança, incluindo análise OWASP, verificação de vulnerabilidades de dependências, recomendações de ferramentas de segurança, etc.

---

## Checkpoint ✅

Após completar os passos acima, você deve:

- ✅ Saber executar o comando `/code-review`
- ✅ Entender a estrutura e conteúdo do relatório de revisão
- ✅ Saber corrigir problemas de código conforme o relatório
- ✅ Saber que problemas CRITICAL e HIGH devem ser corrigidos
- ✅ Entender a diferença entre code-reviewer e security-reviewer
- ✅ Ter o hábito de revisar antes de commitar

---

## Armadilhas comuns

### Erro comum 1: Pular a revisão de código

**Problema**: Achar que o código é simples e commitar diretamente, sem executar a revisão.

**Consequência**: Pode deixar passar vulnerabilidades de segurança, ser rejeitado pelo CI/CD ou causar incidentes em produção.

**Abordagem correta**: Crie o hábito de executar `/code-review` antes de cada commit.

---

### Erro comum 2: Ignorar problemas MEDIUM

**Problema**: Ver problemas MEDIUM e não fazer nada, deixando acumular.

**Consequência**: Qualidade do código diminui, dívida técnica acumula, manutenção futura fica difícil.

**Abordagem correta**: Embora problemas MEDIUM não bloqueiem o commit, devem ser corrigidos em tempo razoável.

---

### Erro comum 3: Corrigir SQL injection manualmente

**Problema**: Escrever escape de strings você mesmo, em vez de usar queries parametrizadas.

**Consequência**: Escape incompleto, ainda há risco de SQL injection.

**Abordagem correta**: Sempre use ORM ou queries parametrizadas, não concatene SQL manualmente.

---

### Erro comum 4: Confundir os dois reviewers

**Problema**: Executar apenas code-reviewer para todo código, ignorando security-reviewer.

**Consequência**: Vulnerabilidades de segurança podem passar despercebidas, especialmente em código envolvendo API, autenticação, pagamentos.

**Abordagem correta**:
- Código comum: code-reviewer é suficiente
- Código sensível à segurança: deve executar security-reviewer também

---

## Resumo da lição

O **fluxo de revisão de código** é uma das funcionalidades principais do Everything Claude Code:

| Funcionalidade | Agent | O que verifica | Severidade |
| --- | --- | --- | --- |
| **Revisão de qualidade** | code-reviewer | Tamanho de funções, tratamento de erros, melhores práticas | HIGH/MEDIUM/LOW |
| **Revisão de segurança** | security-reviewer | OWASP Top 10, vazamento de chaves, vulnerabilidades de injeção | CRITICAL/HIGH/MEDIUM |

**Pontos-chave**:

1. **Antes de cada commit** execute `/code-review`
2. **Problemas CRITICAL/HIGH** devem ser corrigidos antes de commitar
3. **Código sensível à segurança** deve passar pelo security-reviewer
4. **Relatório de revisão** inclui localização detalhada e sugestões de correção
5. **Crie o hábito**: revisar → corrigir → revisar novamente → commitar

---

## Prévia da próxima lição

> Na próxima lição aprenderemos sobre **[Automação com Hooks](../../advanced/hooks-automation/)**.
>
> Você vai aprender:
> - O que são Hooks e como automatizar o fluxo de desenvolvimento
> - Como usar mais de 15 hooks de automação
> - Como personalizar Hooks para as necessidades do projeto
> - Cenários de aplicação de hooks como SessionStart, SessionEnd, PreToolUse

---

## Apêndice: Referência do código-fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código-fonte</strong></summary>

> Atualizado em: 2026-01-25

| Funcionalidade | Caminho do arquivo | Linha |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |
| --- | --- | --- |

**Constantes importantes**:
- Limite de tamanho de função: 50 linhas (code-reviewer.md:47)
- Limite de tamanho de arquivo: 800 linhas (code-reviewer.md:48)
- Limite de profundidade de aninhamento: 4 níveis (code-reviewer.md:49)

**Funções importantes**:
- `/code-review`: Chama o agent code-reviewer para revisão de qualidade de código
- `/security-reviewer`: Chama o agent security-reviewer para auditoria de segurança
- `git diff --name-only HEAD`: Obtém arquivos alterados não commitados (code-review.md:5)

**Critérios de aprovação** (code-reviewer.md:90-92):
- ✅ Approve: No CRITICAL or HIGH issues
- ⚠️ Warning: MEDIUM issues only (can merge with caution)
- ❌ Block: CRITICAL or HIGH issues found

</details>
