---
title: "Changelog de Versões: Novos Recursos, Melhorias e Alterações Importantes | Tutorial Clawdbot"
sidebarTitle: "Novidades da Versão"
subtitle: "Changelog de Versões: Novos Recursos, Melhorias e Alterações Importantes"
description: "Acompanhe o histórico de versões do Clawdbot, incluindo novos recursos, melhorias, correções e alterações importantes. Este tutorial ajuda você a monitorar a evolução do produto e manter seu sistema atualizado com os recursos e correções de segurança mais recentes."
tags:
  - "changelog"
  - "histórico de versões"
  - "atualizações"
prerequisite: []
order: 380
---

# Changelog de Versões: Novos Recursos, Melhorias e Alterações Importantes

O Clawdbot está em constante evolução, trazendo novos recursos, melhorias de desempenho e aprimoramentos de segurança a cada versão. Este changelog ajuda você a entender rapidamente a evolução do produto e decidir quando e como atualizar.

## O Que Você Vai Aprender

- Conhecer os novos recursos e destaques das versões mais recentes
- Entender as alterações importantes de cada versão para evitar interrupções durante atualizações
- Consultar a lista de correções para verificar se seu problema foi resolvido
- Acompanhar o roadmap de recursos para planejar o uso de novas funcionalidades

::: tip Formato do Número de Versão
Formato: `AAAA.M.D` (Ano.Mês.Dia)

- **Versão principal**: Mudanças no ano ou mês geralmente indicam atualizações significativas
- **Versão de patch**: `-1`, `-2`, `-3` representam versões de correção, contendo apenas correções de bugs
:::

---

## 2026.1.25
**Status**: Não lançada

### Destaques (Highlights)

Nenhum por enquanto

### Melhorias (Changes)

- **Agents**: Respeitar `tools.exec.safeBins` na verificação de allowlist do exec (#2281)
- **Docs**: Refinar etapas de deploy privado no Fly (#2289) - Agradecimentos a @dguido
- **Gateway**: Alertar sobre hook token passado via query parameter; documentar autenticação via header como método preferido (#2200) - Agradecimentos a @YuriNachos
- **Gateway**: Adicionar flag perigosa de bypass de autenticação de dispositivo na Control UI + aviso de auditoria (#2248)
- **Doctor**: Alertar quando gateway sem autenticação estiver exposto (#2016) - Agradecimentos a @Alex-Alaniz
- **Discord**: Adicionar gateway intents privilegiados configuráveis (presences/members) (#2266) - Agradecimentos a @kentaro
- **Docs**: Adicionar Vercel AI Gateway na sidebar de providers (#1901) - Agradecimentos a @jerilynzheng
- **Agents**: Expandir descrição da ferramenta cron com documentação completa do schema (#1988) - Agradecimentos a @tomascupr
- **Skills**: Adicionar metadados de dependências ausentes para GitHub, Notion, Slack, Discord (#1995) - Agradecimentos a @jackheuberger
- **Docs**: Adicionar guia de deploy no Render (#1975) - Agradecimentos a @anurag
- **Docs**: Adicionar guia de proxy da API Claude Max (#1875) - Agradecimentos a @atalovesyou
- **Docs**: Adicionar guia de deploy na DigitalOcean (#1870) - Agradecimentos a @0xJonHoldsCrypto
- **Docs**: Adicionar guia de instalação no Raspberry Pi (#1871) - Agradecimentos a @0xJonHoldsCrypto
- **Docs**: Adicionar guia de deploy no GCP Compute Engine (#1848) - Agradecimentos a @hougangdev
- **Docs**: Adicionar guia do canal LINE - Agradecimentos a @thewilloftheshadow
- **Docs**: Creditar dois contribuidores pela atualização da Control UI (#1852) - Agradecimentos a @EnzeD
- **Onboarding**: Adicionar chave de API Venice ao fluxo não interativo (#1893) - Agradecimentos a @jonisjongithub
- **Onboarding**: Reforçar texto de aviso de segurança beta + expectativas de controle de acesso
- **Tlon**: Formatar ID de resposta de thread como `@ud` (#1837) - Agradecimentos a @wca4a
- **Gateway**: Priorizar metadados de sessão mais recentes ao mesclar armazenamento (#1823) - Agradecimentos a @emanuelst
- **Web UI**: Manter respostas de anúncio de sub-agent visíveis no WebChat (#1977) - Agradecimentos a @andrescardonas7
- **CI**: Aumentar tamanho do heap do Node para verificações no macOS (#1890) - Agradecimentos a @realZachi
- **macOS**: Evitar crash ao renderizar blocos de código atualizando Textual para 0.3.1 (#2033) - Agradecimentos a @garricn
- **Browser**: Fallback para correspondência de URL na resolução de destino de relay da extensão (#1999) - Agradecimentos a @jonit-dev
- **Update**: Ignorar dist/control-ui na verificação de dirty e restaurar após build da UI (#1976) - Agradecimentos a @Glucksberg
- **Telegram**: Permitir parâmetro caption ao enviar mídia (#1888) - Agradecimentos a @mguellsegarra
- **Telegram**: Suportar channelData de sendPayload de plugin (mídia/botões) e validar comandos de plugin (#1917) - Agradecimentos a @JoshuaLelon
- **Telegram**: Evitar respostas em bloco quando streaming estiver desabilitado (#1885) - Agradecimentos a @ivancasco
- **Auth**: Exibir URL de autenticação Google copiável após prompt ASCII (#1787) - Agradecimentos a @robbyczgw-cla
- **Routing**: Pré-compilar regex de chave de sessão (#1697) - Agradecimentos a @Ray0907
- **TUI**: Evitar overflow de largura ao renderizar lista de seleção (#1686) - Agradecimentos a @mossein
- **Telegram**: Preservar ID de tópico em notificações de reinício do sentinel (#1807) - Agradecimentos a @hsrvc
- **Config**: Aplicar `config.env` antes da substituição `${VAR}` (#1813) - Agradecimentos a @spanishflu-est1918
- **Slack**: Limpar reação de ack após resposta em streaming (#2044) - Agradecimentos a @fancyboi999
- **macOS**: Manter nome de usuário SSH personalizado em destinos remotos (#2046) - Agradecimentos a @algal

### Correções (Fixes)

- **Telegram**: Envolver itálico de reasoning por linha para evitar underscores brutos (#2181) - Agradecimentos a @YuriNachos
- **Voice Call**: Forçar validação de assinatura de webhook Twilio para URLs ngrok; desabilitar bypass de camada gratuita ngrok por padrão
- **Security**: Fortalecer autenticação Tailscale Serve verificando identidade do tailscaled local antes de confiar em headers
- **Build**: Alinhar dependência peer de memory-core com lockfile
- **Security**: Adicionar modo de descoberta mDNS, minimizado por padrão para reduzir vazamento de informações (#1882) - Agradecimentos a @orlyjamie
- **Security**: Fortalecer fetch de URL com DNS pinning para reduzir risco de rebinding - Agradecimentos a Chris Zheng
- **Web UI**: Melhorar preview de colagem de imagem no WebChat e permitir envio apenas de imagem (#1925) - Agradecimentos a @smartprogrammer93
- **Security**: Envolver conteúdo de hook externo com opção de opt-out por hook por padrão (#1827) - Agradecimentos a @mertcicekci0
- **Gateway**: Autenticação padrão agora falha fechada (requer token/senha; identidade Tailscale Serve ainda permitida)
- **Onboarding**: Remover seleção de auth "off" não suportada do gateway do fluxo onboarding/configure e flags CLI

---

## 2026.1.24-3

### Correções (Fixes)

- **Slack**: Corrigir falha de download de imagem devido a header Authorization ausente em redirecionamento cross-origin (#1936) - Agradecimentos a @sanderhelgesen
- **Gateway**: Fortalecer detecção de cliente local e tratamento de proxy reverso para conexões de proxy não autenticadas (#1795) - Agradecimentos a @orlyjamie
- **Security audit**: Marcar Control UI loopback com autenticação desabilitada como crítico (#1795) - Agradecimentos a @orlyjamie
- **CLI**: Restaurar sessão claude-cli e transmitir respostas CLI para cliente TUI (#1921) - Agradecimentos a @rmorse

---

## 2026.1.24-2

### Correções (Fixes)

- **Packaging**: Incluir saída dist/link-understanding no tarball npm (corrige import apply.js ausente na instalação)

---

## 2026.1.24-1

### Correções (Fixes)

- **Packaging**: Incluir saída dist/shared no tarball npm (corrige import reasoning-tags ausente na instalação)

---

## 2026.1.24

### Destaques (Highlights)

- **Providers**: Descoberta Ollama + documentação; upgrade do guia Venice + links cruzados (#1606) - Agradecimentos a @abhaymundhara
- **Channels**: Plugin LINE (Messaging API) com suporte a respostas ricas + respostas rápidas (#1630) - Agradecimentos a @plum-dawg
- **TTS**: Fallback Edge (sem chave) + modo automático `/tts` (#1668, #1667) - Agradecimentos a @steipete, @sebslight
- **Exec approvals**: Aprovação no chat via `/approve` em todos os canais (incluindo plugins) (#1621) - Agradecimentos a @czekaj
- **Telegram**: Tópicos de DM como sessões independentes + toggle de preview de link de saída (#1597, #1700) - Agradecimentos a @rohannagpal, @zerone0x

### Melhorias (Changes)

- **Channels**: Adicionar plugin LINE (Messaging API) com suporte a respostas ricas, respostas rápidas e registro HTTP de plugin (#1630) - Agradecimentos a @plum-dawg
- **TTS**: Adicionar fallback de provider Edge TTS, padrão Edge sem chave, retry MP3 em falha de formato (#1668) - Agradecimentos a @steipete
- **TTS**: Adicionar enum de modo automático (off/always/inbound/tagged) com override `/tts` por sessão (#1667) - Agradecimentos a @sebslight
- **Telegram**: Tratar tópicos de DM como sessões independentes e manter limite de histórico de DM estável com sufixo de thread (#1597) - Agradecimentos a @rohannagpal
- **Telegram**: Adicionar `channels.telegram.linkPreview` para toggle de preview de link de saída (#1700) - Agradecimentos a @zerone0x
- **Web search**: Adicionar parâmetro de filtro de frescor Brave para resultados com limite de tempo (#1688) - Agradecimentos a @JonUleis
- **UI**: Atualizar design system do dashboard da Control UI (cores, ícones, tipografia) (#1745, #1786) - Agradecimentos a @EnzeD, @mousberg
- **Exec approvals**: Encaminhar prompts de aprovação para chat, suportar todos os canais (incluindo plugins) via `/approve` (#1621) - Agradecimentos a @czekaj
- **Gateway**: Expor `config.patch` em ferramentas do gateway para atualizações parciais seguras + sentinel de reinício (#1653) - Agradecimentos a @Glucksberg
- **Diagnostics**: Adicionar flags de diagnóstico para logs de debug direcionados (config + override de env)
- **Docs**: Expandir FAQ (migração, agendamento, concorrência, recomendações de modelo, autenticação de assinatura OpenAI, tamanho Pi, instalação hackável, workaround SSL de docs)
- **Docs**: Adicionar guia detalhado de troubleshooting do instalador
- **Docs**: Adicionar guia de VM macOS com opções local/hospedado + orientação VPS/node (#1693) - Agradecimentos a @f-trycua
- **Docs**: Adicionar setup de role de instância EC2 Bedrock + etapas IAM (#1625) - Agradecimentos a @sergical
- **Docs**: Atualizar instruções do guia Fly.io
- **Dev**: Adicionar hooks pre-commit prek + config de atualização semanal de dependências (#1720) - Agradecimentos a @dguido

### Correções (Fixes)

- **Web UI**: Corrigir overflow de layout config/debug, scroll e tamanho de bloco de código (#1715) - Agradecimentos a @saipreetham589
- **Web UI**: Exibir botão de parar durante execução ativa, alternar para nova sessão quando ocioso (#1664) - Agradecimentos a @ndbroadbent
- **Web UI**: Limpar banner de desconexão obsoleto ao reconectar; permitir salvar formulário sem caminho de schema suportado mas bloquear schema ausente (#1707) - Agradecimentos a @Glucksberg
- **Web UI**: Ocultar prompt interno `message_id` em bolhas de chat
- **Gateway**: Permitir autenticação apenas por token da Control UI pular pareamento de dispositivo mesmo quando identidade de dispositivo existe (`gateway.controlUi.allowInsecureAuth`) (#1679) - Agradecimentos a @steipete
- **Matrix**: Proteger anexos de mídia E2EE descriptografados com tamanho de preflight (#1744) - Agradecimentos a @araa47
- **BlueBubbles**: Rotear destinos de número de telefone para DM, evitar vazamento de ID de roteamento e criar DM ausente automaticamente (requer Private API) (#1751) - Agradecimentos a @tyler6204
- **BlueBubbles**: Preservar GUID de part-index em tags de resposta quando ID curto estiver ausente
- **iMessage**: Normalizar prefixos chat_id/chat_guid/chat_identifier sem distinção de maiúsculas e manter handles com prefixo de serviço estáveis (#1708) - Agradecimentos a @aaronn
- **Signal**: Corrigir envio de reaction (destino group/UUID + flag author CLI) (#1651) - Agradecimentos a @vilkasdev
- **Signal**: Adicionar timeout de inicialização signal-cli configurável + documentação de modo daemon externo (#1677)
- **Telegram**: Definir fetch duplex="half" para uploads no Node 22 para evitar falha de sendPhoto (#1684) - Agradecimentos a @commdata2338
- **Telegram**: Usar fetch envolvido para long polling no Node para normalizar tratamento de AbortSignal (#1639)
- **Telegram**: Respeitar proxy por conta para chamadas de API de saída (#1774) - Agradecimentos a @radek-paclt
- **Telegram**: Fallback para texto quando nota de voz estiver bloqueada por configurações de privacidade (#1725) - Agradecimentos a @foeken
- **Voice Call**: Retornar TwiML de streaming no webhook Twilio inicial para chamadas de sessão de saída (#1634)
- **Voice Call**: Serializar reprodução TTS Twilio e cancelar em interrupção para evitar sobreposição (#1713) - Agradecimentos a @dguido
- **Google Chat**: Refinar correspondência de allowlist de email, sanitizar entrada, limites de mídia e onboarding/docs/tests (#1635) - Agradecimentos a @iHildy
- **Google Chat**: Normalizar destinos de espaço sem prefixo duplo `spaces/`
- **Agents**: Auto-comprimir em erro de prompt de overflow de contexto (#1627) - Agradecimentos a @rodrigouroz
- **Agents**: Usar perfil de auth ativo para recuperação de auto-compressão
- **Media understanding**: Pular compreensão de imagem quando modelo principal já suporta visão (#1747) - Agradecimentos a @tyler6204
- **Models**: Usar padrão para campos ausentes de provider personalizado para aceitar configuração mínima
- **Messaging**: Manter divisão de bloco de quebra de linha segura para blocos markdown cercados entre canais
- **Messaging**: Tratar processamento de bloco de quebra de linha como consciente de parágrafo (divisão por linha vazia) para manter listas e títulos juntos (#1726) - Agradecimentos a @tyler6204
- **TUI**: Recarregar histórico após reconexão do gateway para restaurar estado da sessão (#1663)
- **Heartbeat**: Normalizar identificadores de destino para manter roteamento consistente
- **Exec**: Manter aprovação para ask elevado a menos que seja modo completo (#1616) - Agradecimentos a @ivancasco
- **Exec**: Tratar tags de plataforma Windows como Windows para seleção de shell de node (#1760) - Agradecimentos a @ymat19
- **Gateway**: Incluir variáveis de env de config inline no ambiente de instalação de serviço (#1735) - Agradecimentos a @Seredeep
- **Gateway**: Pular probe DNS Tailscale quando tailscale.mode for off (#1671)
- **Gateway**: Reduzir ruído de log de chamadas atrasadas + probes de node remoto; debounce de refresh de skills (#1607) - Agradecimentos a @petter-b
- **Gateway**: Esclarecer prompt de erro de autenticação Control UI/WebChat com token ausente (#1690)
- **Gateway**: Escutar loopback IPv6 quando vinculado a 127.0.0.1 para webhooks localhost funcionarem
- **Gateway**: Armazenar lockfile em diretório temporário para evitar locks obsoletos em volumes persistentes (#1676)
- **macOS**: Transferência direta de URL `ws://` padrão para porta 18789; documentar `gateway.remote.transport` (#1603) - Agradecimentos a @ngutman
- **Tests**: Limitar workers Vitest no CI macOS para reduzir timeouts (#1597) - Agradecimentos a @rohannagpal
- **Tests**: Evitar dependência de fake-timer em mock de stream de runner embutido para reduzir instabilidade CI (#1597) - Agradecimentos a @rohannagpal
- **Tests**: Aumentar timeout de teste de ordenação de runner embutido para reduzir instabilidade CI (#1597) - Agradecimentos a @rohannagpal

---

## 2026.1.23-1

### Correções (Fixes)

- **Packaging**: Incluir saída dist/tts no tarball npm (corrige dist/tts/tts.js ausente)

---

## 2026.1.23

### Destaques (Highlights)

- **TTS**: Mover TTS do Telegram para core + habilitar tags TTS orientadas por modelo por padrão para respostas de áudio expressivas (#1559) - Agradecimentos a @Glucksberg
- **Gateway**: Adicionar endpoint HTTP `/tools/invoke` para invocação direta de ferramentas (aplica autenticação + política de ferramentas) (#1575) - Agradecimentos a @vignesh07
- **Heartbeat**: Controle de visibilidade por canal (OK/alerts/indicator) (#1452) - Agradecimentos a @dlauer
- **Deploy**: Adicionar suporte a deploy Fly.io + guia (#1570)
- **Channels**: Adicionar plugin de canal Tlon/Urbit (DM, menções de grupo, respostas em thread) (#1544) - Agradecimentos a @wca4a

### Melhorias (Changes)

- **Channels**: Permitir política de allow/deny de ferramentas por grupo em canais built-in + plugins (#1546) - Agradecimentos a @adam91holt
- **Agents**: Adicionar padrões de auto-descoberta Bedrock + override de config (#1553) - Agradecimentos a @fal3
- **CLI**: Adicionar `clawdbot system` para eventos de sistema + controle de heartbeat; remover `wake` standalone
- **CLI**: Adicionar probe de auth em tempo real a `clawdbot models status` para verificação por perfil
- **CLI**: Reiniciar gateway por padrão após `clawdbot update`; adicionar `--no-restart` para pular
- **Browser**: Adicionar auto-roteamento de proxy de host de node para gateways remotos (configurável por gateway/node)
- **Plugins**: Adicionar ferramenta `llm-task` JSON-only opcional para workflows (#1498) - Agradecimentos a @vignesh07
- **Markdown**: Adicionar conversão de tabela por canal (Signal/WhatsApp usam bullets, outros usam bloco de código) (#1495) - Agradecimentos a @odysseus0
- **Agents**: Manter prompt de sistema apenas com timezone e mover hora atual para `session_status` para melhor cache hit
- **Agents**: Remover aliases redundantes de ferramenta bash do registro/exibição de ferramentas (#1571) - Agradecimentos a @Takhoffman
- **Docs**: Adicionar guia de decisão cron vs heartbeat (com notas de workflow Lobster) (#1533) - Agradecimentos a @JustYannicc
- **Docs**: Esclarecer que arquivo HEARTBEAT.md vazio pula heartbeat, arquivo ausente ainda executa (#1535) - Agradecimentos a @JustYannicc

### Correções (Fixes)

- **Sessions**: Aceitar sessionIds não-UUID para history/send/status enquanto preserva escopo de agent
- **Heartbeat**: Aceitar ids de canal de plugin para validação de destino de heartbeat + prompt de UI
- **Messaging/Sessions**: Espelhar envio de saída para chave de sessão de destino (thread + dmScope), criar entrada de sessão no envio e normalizar case de chave de sessão (#1520)
- **Sessions**: Rejeitar armazenamento de sessão com suporte a array para evitar apagamento silencioso (#1469)
- **Gateway**: Comparar tempo de início de processo Linux para evitar loop de lock de reciclagem de PID; manter lock a menos que obsoleto (#1572) - Agradecimentos a @steipete
- **Gateway**: Aceitar campos opcionais null em requisições de aprovação exec (#1511) - Agradecimentos a @pvoo
- **Exec approvals**: Persistir id de entrada de allowlist para manter linhas de allowlist macOS estáveis (#1521) - Agradecimentos a @ngutman
- **Exec**: Respeitar padrões ask/security de tools.exec para aprovações elevadas (evitar prompts desnecessários)
- **Daemon**: Usar separador PATH de plataforma ao construir caminho mínimo de serviço
- **Linux**: Incluir raiz de bin de usuário configurada por env no PATH systemd e alinhar auditoria de PATH (#1512) - Agradecimentos a @robbyczgw-cla
- **Tailscale**: Retry serve/funnel com sudo apenas em erro de permissão e manter detalhes de falha original (#1551) - Agradecimentos a @sweepies
- **Docker**: Atualizar comando de gateway em docker-compose e guia Hetzner (#1514)
- **Agents**: Exibir fallback de erro de ferramenta quando último turno de assistente apenas chamou ferramentas (evitar parada silenciosa)
- **Agents**: Ignorar placeholders de template IDENTITY.md ao resolver identidade (#1556)
- **Agents**: Excluir blocos de reasoning de OpenAI Responses órfãos em troca de modelo (#1562) - Agradecimentos a @roshanasingh4
- **Agents**: Adicionar dica de log CLI em mensagem "agent falhou antes de responder" (#1550) - Agradecimentos a @sweepies
- **Agents**: Alertar e ignorar allowlists de ferramentas que referenciam apenas ferramentas de plugin desconhecidas ou não carregadas (#1566)
- **Agents**: Tratar allowlists de ferramentas apenas de plugin como opt-in; manter ferramentas core habilitadas (#1467)
- **Agents**: Respeitar override de enqueue para execuções embutidas para evitar deadlock de fila em testes
- **Slack**: Respeitar groupPolicy aberto para canais não listados em gate de mensagem + slash (#1563) - Agradecimentos a @itsjaydesu
- **Discord**: Limitar bypass de menção de auto-thread a threads de propriedade do bot; manter gate de menção de reação ack (#1511) - Agradecimentos a @pvoo
- **Discord**: Retry de resolução de allowlist com rate limit + deploy de comando para evitar crash do gateway
- **Mentions**: Ignorar correspondência de mentionPattern em chat de grupo quando outra menção explícita existe (Slack/Discord/Telegram/WhatsApp)
- **Telegram**: Renderizar markdown em legendas de mídia (#1478)
- **MS Teams**: Remover sufixo `.default` de escopos Graph e escopos de probe Bot Framework (#1507, #1574) - Agradecimentos a @Evizero
- **Browser**: Manter aba de relay de extensão controlável quando extensão reutiliza id de sessão após troca de aba (#1160)
- **Voice wake**: Auto-salvar palavra de despertar em blur/submit entre iOS/Android e alinhar limites com macOS
- **UI**: Manter sidebar da Control UI visível ao rolar páginas longas (#1515) - Agradecimentos a @pookNast
- **UI**: Cachear renderização markdown da Control UI + memoizar extração de texto de chat para reduzir jitter de entrada no Safari
- **TUI**: Encaminhar comandos slash desconhecidos, incluir comandos Gateway em autocomplete e renderizar respostas slash como saída de sistema
- **CLI**: Polir saída de probe de auth (saída em tabela, erros inline, reduzir ruído e correção de quebra de linha em `clawdbot models status`)
- **Media**: Analisar tags `MEDIA:` apenas quando começam no início da linha para evitar remover menções em prosa (#1206)
- **Media**: Preservar alpha PNG quando possível; fallback para JPEG quando ainda exceder limite de tamanho (#1491) - Agradecimentos a @robbyczgw-cla
- **Skills**: Restringir instalação bird Homebrew ao macOS (#1569) - Agradecimentos a @bradleypriest

---

## Recomendações de Atualização

### Verificação Pré-Atualização

Antes de atualizar para uma nova versão, recomendamos:

1. **Ler as alterações importantes**: Verificar se há alterações importantes que afetarão sua configuração
2. **Fazer backup da configuração**: Fazer backup de `~/.clawdbot/clawdbot.json`
3. **Executar diagnóstico**: `clawdbot doctor` para garantir que o estado atual do sistema está saudável
4. **Verificar dependências**: Garantir que a versão do Node.js atende aos requisitos (≥22)

### Verificação Pós-Atualização

Após concluir a atualização, execute as seguintes verificações:

```bash
# 1. Verificar versão
clawdbot --version

# 2. Verificar status
clawdbot status

# 3. Verificar conexão de canais
clawdbot channels status

# 4. Testar envio de mensagem
clawdbot message "Hello" --target=<seu-canal>
```

### Consultar Changelog Completo

Para ver histórico de versões mais detalhado e links de issues, visite:

- **GitHub Releases**: https://github.com/moltbot/moltbot/releases
- **Documentação oficial**: https://docs.clawd.bot

---

## Versões Anteriores

Para ver atualizações de versões mais antigas, visite [GitHub Releases](https://github.com/moltbot/moltbot/releases) ou o [CHANGELOG.md](https://github.com/moltbot/moltbot/blob/main/CHANGELOG.md) no diretório raiz do projeto.

::: tip Contribua
Se você encontrou um bug ou tem sugestões de recursos, sinta-se à vontade para enviar em [GitHub Issues](https://github.com/moltbot/moltbot/issues).
:::
