
---

### Passo 5: Verificar a Leitura da IA

Agora, deixe o agente de IA ler o AGENTS.md e veja se ele sabe quais skills estão disponíveis.

**Exemplo de diálogo**:

```
Usuário:
Quero extrair dados de tabela de um arquivo PDF

Agente de IA:
Posso usar o skill `pdf` para ajudá-lo a extrair dados da tabela. Deixe-me primeiro ler o conteúdo detalhado deste skill.

IA executa:
npx openskills read pdf

Saída:
Skill: pdf
Base Directory: /path/to/project/.claude/skills/pdf

[Conteúdo detalhado do skill PDF...]

IA:
Ok, já carreguei o skill PDF. Agora posso ajudá-lo a extrair dados da tabela...
```

**Você deve ver**:

- O agente de IA identifica que pode usar o skill `pdf`
- A IA executa automaticamente `npx openskills read pdf` para carregar o conteúdo do skill
- A IA executa tarefas de acordo com as instruções do skill

---

### Passo 6 (Opcional): Caminho de Saída Personalizado

Se você quiser sincronizar skills para outro arquivo (como `.ruler/AGENTS.md`), use a opção `-o` ou `--output`:

```bash
npx openskills sync -o .ruler/AGENTS.md
```

**Por quê**

Algumas ferramentas (como Windsurf) podem esperar o AGENTS.md em um diretório específico. Usando `-o` você pode personalizar flexivelmente o caminho de saída.

**Você deve ver**:

```
Created .ruler/AGENTS.md
✅ Synced 2 skill(s) to .ruler/AGENTS.md
```

::: tip Sincronização Não-Interativa

Em ambientes CI/CD, você pode usar o sinalizador `-y` ou `--yes` para pular a seleção interativa e sincronizar todos os skills:

```bash
npx openskills sync -y
```

:::

---

## Ponto de Verificação ✅

Após completar os passos acima, por favor confirme:

- [ ] A linha de comando exibiu a interface de seleção interativa
- [ ] Selecionou com sucesso pelo menos um skill (com `◉` na frente)
- [ ] Sincronização bem-sucedida, exibiu a mensagem `✅ Synced X skill(s) to AGENTS.md`
- [ ] O arquivo `AGENTS.md` foi criado ou atualizado
- [ ] O arquivo contém a tag XML `<skills_system>`
- [ ] O arquivo contém a lista de skills `<available_skills>`
- [ ] Cada `<skill>` contém `<name>`, `<description>`, `<location>`

Se todos os itens de verificação acima passarem, parabéns! Os skills foram sincronizados com sucesso para AGENTS.md, e agora os agentes de IA podem conhecê-los e usá-los.

---

## Avisos de Armadilhas Comuns

### Problema 1: Nenhum skill encontrado

**Sintoma**:

```
No skills installed. Install skills first:
  npx openskills install anthropics/skills --project
```

**Causa**:

- Nenhum skill instalado no diretório atual ou global

**Solução**:

1. Verifique se há skills instalados:

```bash
npx openskills list
```

2. Se não houver, instale os skills primeiro:

```bash
npx openskills install anthropics/skills
```

---

### Problema 2: AGENTS.md não atualizado

**Sintoma**:

Após executar `openskills sync`, o conteúdo de AGENTS.md não mudou.

**Causa**:

- Usou o sinalizador `-y`, mas a lista de skills é a mesma de antes
- AGENTS.md já existe, mas os skills sincronizados são os mesmos

**Solução**:

1. Verifique se usou o sinalizador `-y`

```bash
# Remova -y, entre no modo interativo para reselecionar
npx openskills sync
```

2. Verifique se o diretório atual está correto

```bash
# Confirme que está no diretório do projeto onde os skills foram instalados
pwd
ls .claude/skills/
```

---

### Problema 3: Agente de IA não conhece os skills

**Sintoma**:

AGENTS.md foi gerado, mas o agente de IA ainda não sabe que os skills estão disponíveis.

**Causa**:

- O agente de IA não leu AGENTS.md
- O formato de AGENTS.md está incorreto
- O agente de IA não suporta o sistema de skills

**Solução**:

1. Confirme que AGENTS.md está no diretório raiz do projeto
2. Verifique se o formato de AGENTS.md está correto (contém a tag `<skills_system>`)
3. Verifique se o agente de IA suporta AGENTS.md (Claude Code suporta, outras ferramentas podem precisar de configuração)

---

### Problema 4: Arquivo de saída não é markdown

**Sintoma**:

```
Error: Output file must be a markdown file (.md)
```

**Causa**:

- Usou a opção `-o`, mas o arquivo especificado não tem a extensão `.md`

**Solução**:

1. Certifique-se de que o arquivo de saída termine com `.md`

```bash
# ❌ Errado
npx openskills sync -o skills.txt

# ✅ Correto
npx openskills sync -o skills.md
```

---

### Problema 5: Cancelar todas as seleções

**Sintoma**:

Na interface interativa, após desmarcar todos os skills, a seção de skills em AGENTS.md é excluída.

**Causa**:

Este é o comportamento normal. Se cancelar todos os skills, a ferramenta removerá a seção de skills de AGENTS.md.

**Solução**:

Se isso foi uma operação acidental, execute novamente `openskills sync` e selecione os skills que deseja sincronizar.

---

## Resumo da Aula

Nesta aula, você aprendeu:

- **Usar `openskills sync`** para gerar o arquivo AGENTS.md
- **Compreender o fluxo de sincronização de skills**: Instalação → Sincronização → IA Lê → Carregamento Sob Demanda
- **Selecionar skills interativamente**, controlando o tamanho do contexto da IA
- **Caminhos de saída personalizados**, integração com sistemas de documentação existentes
- **Compreender o formato AGENTS.md**, contém tags XML `<skills_system>` e lista de skills

**Comandos Principais**:

| Comando | Função |
| --- | --- |
| `npx openskills sync` | Sincroniza skills interativamente para AGENTS.md |
| `npx openskills sync -y` | Sincroniza todos os skills de forma não-interativa |
| `npx openskills sync -o custom.md` | Sincroniza para arquivo personalizado |
| `cat AGENTS.md` | Visualiza o conteúdo gerado de AGENTS.md |

**Pontos Importantes do Formato AGENTS.md**:

- Usa tags XML `<skills_system>` para encapsular
- Contém instruções de uso `<usage>`
- Contém lista de skills `<available_skills>`
- Cada `<skill>` contém `<name>`, `<description>`, `<location>`

---

## Prévia da Próxima Aula

> Na próxima aula aprenderemos **[Usando Skills](../read-skills/)**.
>
> Você aprenderá:
> - Como os agentes de IA usam o comando `openskills read` para carregar skills
> - O fluxo completo de carregamento de skills
> - Como ler múltiplos skills
> - A estrutura e composição do conteúdo do skill

Sincronizar skills é apenas fazer a IA saber quais ferramentas estão disponíveis, quando realmente usá-las, a IA carregará o conteúdo específico do skill através do comando `openskills read`.

---

## Apêndice: Referência do Código Fonte

<details>
<summary><strong>Clique para expandir e ver a localização do código fonte</strong></summary>

> Última atualização: 2026-01-24

| Função | Caminho do Arquivo | Número da Linha |
| --- | --- | --- |
| Entrada do comando sync | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L18-L109) | 18-109 |
| Validação do arquivo de saída | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L19-L26) | 19-26 |
| Criar arquivo inexistente | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L28-L36) | 28-36 |
| Interface de seleção interativa | [`src/commands/sync.ts`](https://github.com/numman-ali/openskills/blob/main/src/commands/sync.ts#L46-L93) | 46-93 |
| Analisar AGENTS.md existente | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L6-L18) | 6-18 |
| Gerar XML de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L23-L62) | 23-62 |
| Substituir seção de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L67-L93) | 67-93 |
| Excluir seção de skills | [`src/utils/agents-md.ts`](https://github.com/numman-ali/openskills/blob/main/src/utils/agents-md.ts#L98-L122) | 98-122 |

**Funções-chave**:
- `syncAgentsMd()` - Sincroniza skills para o arquivo AGENTS.md
- `parseCurrentSkills()` - Analisa nomes de skills no AGENTS.md existente
- `generateSkillsXml()` - Gera lista de skills em formato XML
- `replaceSkillsSection()` - Substitui ou adiciona seção de skills ao arquivo
- `removeSkillsSection()` - Remove seção de skills do arquivo

**Constantes-chave**:
- `AGENTS.md` - Nome padrão do arquivo de saída
- `<skills_system>` - Tag XML, usada para marcar definição do sistema de skills
- `<available_skills>` - Tag XML, usada para marcar lista de skills disponíveis

**Lógica importante**:
- Por padrão, pré-seleciona skills já existentes no arquivo (atualização incremental)
- Na primeira sincronização, seleciona por padrão todos os skills de projeto
- Suporta dois formatos de marcação: tags XML e comentários HTML
- Quando cancela todas as seleções, exclui a seção de skills em vez de manter lista vazia

</details>
