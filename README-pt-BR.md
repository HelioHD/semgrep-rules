# semgrep-rules

> [English](README.md) · [Português (Brasil)](README-pt-BR.md)

Regras de análise estática para backends **Node / TypeScript** feitos com **Prisma,
NestJS, Express e JWT**. Cada regra mira uma classe de bug real e realista e vem com
seu próprio arquivo de teste. Dois apps de exemplo — um vulnerável, um corrigido —
provam que a regra pega o bug e silencia quando ele é corrigido.

> *"Cada bug real que encontrei virou uma regra que impede a regressão."*

## O que é

- `rules/{prisma,nest,express,jwt}/*.yml` — uma regra por arquivo, cada uma com um
  `*.test.ts` irmão validado por `semgrep --test` (as anotações `// ruleid:` / `// ok:`).
- `examples/vulnerable/` — uma API pequena em NestJS + Prisma + Express com os bugs.
- `examples/fixed/` — a mesma API com os controles de segurança no lugar.

As 10 regras passam no `semgrep --test` (10/10). Rodando o conjunto contra
`examples/vulnerable/` saem 11 achados (as 10 regras disparam); contra
`examples/fixed/`, 0.

## Começo rápido (2 minutos)

Precisa de Docker. Não precisa de Python, Node nem Go para rodar as regras.

Validar cada regra contra seu arquivo de teste:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --test /src/rules
```

Escanear seu próprio código com as regras:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 \
  semgrep --config /src/rules /src/caminho/do/seu/app
```

Ver as regras pegando o exemplo vulnerável e ficando quietas no corrigido:

```bash
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --config /src/rules /src/examples/vulnerable
docker run --rm -v "$(pwd):/src" semgrep/semgrep:1.184.0 semgrep --config /src/rules /src/examples/fixed
```

Imagem fixada: **`semgrep/semgrep:1.184.0`** (lançada em 2026-11-05). Use sempre a
mesma tag para resultados reprodutíveis.

## Regras

| Regra | O que pega | Severidade |
|---|---|---|
| `prisma-raw-unsafe-taint` | input do usuário (`req.body/query/params`) chegando em `$queryRawUnsafe` / `$executeRawUnsafe` / `Prisma.raw`, mesmo passando por variável ou concatenação (taint mode) | ERROR |
| `jwt-decode-as-auth` | `jwt.decode()` (sem checar assinatura) usado para decidir permissão/identidade | ERROR |
| `express-cors-reflect-credentials` | CORS refletindo o Origin da requisição junto com `credentials: true` | ERROR |
| `nest-validationpipe-no-whitelist` | `ValidationPipe` sem `whitelist: true` (mass assignment) | WARNING |
| `nest-public-on-write-route` | `@Public()` em rota `@Post/@Put/@Patch/@Delete` | WARNING |
| `cookie-session-insecure` | cookie de sessão sem `httpOnly` / `secure` / `sameSite` | WARNING |
| `open-redirect` | input do usuário chegando em `res.redirect()` (taint mode) | WARNING |
| `prisma-find-by-param-no-owner` *(heurística)* | `findUnique/findFirst` só pela id vinda da requisição, sem escopo de dono (`ownerId/userId/tenantId`) — possível IDOR | INFO |
| `nest-controller-no-guard` *(heurística)* | rota de escrita sem `@UseGuards` no método nem na classe do controller | INFO |
| `jwt-verify-no-algorithms` *(heurística)* | `jwt.verify()` sem lista explícita de `algorithms` | INFO |

### Sobre as regras heurísticas

As três marcadas como *(heurística)* têm ruído por natureza. Elas apontam padrões que
**costumam** estar errados mas têm exceções legítimas (um guard global do Nest, uma id
que já vem com escopo de dono antes, o jsonwebtoken v9 já restringindo algoritmos por
tipo de chave). A **taxa de falso positivo ainda não foi medida** — essa medição tem
que ser feita em repositórios reais antes de forçá-las no CI. Nenhum número de FP é
publicado aqui porque nenhum foi medido.

## Motores: Semgrep e Opengrep

As regras são validadas no Semgrep. Depois que a Semgrep mudou a **licença do seu
registro de regras** em dezembro de 2024, a comunidade criou o
**[Opengrep](https://opengrep.dev)**, um fork aberto do motor. Estas regras são de
propósito **licenciadas sob MIT** (ver `LICENSE`) e usam só recursos de pattern do
núcleo, então rodam livremente em **qualquer motor compatível**, Semgrep ou Opengrep.
O CI inclui um job Opengrep "melhor esforço"; ele não foi executado pelo autor (ver
"O que não foi verificado").

## Por que essa arquitetura

Cada decisão e cada dependência, e o porquê:

- **Por que Semgrep como motor.** Regra legível (parece o código que ela pega) e modo
  de teste nativo (`--test`) com anotações `// ruleid:` / `// ok:`, então cada regra é
  provada contra código real no CI. Descartados: plugin de ESLint (prende a regra a uma
  stack só, análise cross-file / taint mais fraca) e CodeQL (poderoso mas pesado, e a
  linguagem de query fica longe do código).
- **Por que taint mode** (em `prisma-raw-unsafe-taint` e `open-redirect`). Pattern
  literal só pega quando o input é escrito *dentro* da chamada. O taint mode segue o
  dado da origem (`req.body/query/params`) até o sink mesmo passando por variável
  intermediária ou concatenação — que é como o bug aparece de verdade. Limitação: o
  taint do Semgrep CE é por arquivo.
- **Por que focar em Prisma + Nest.** Os registros públicos são fracos nessa stack, e é
  a stack do dia a dia do autor (pentest web / AppSec em backends Node). Regras que o
  registro já cobre bem (ex.: `dangerouslySetInnerHTML`) ficam de fora.
- **Por que Docker para rodar.** O repositório é desenvolvido numa máquina sem Python.
  A imagem oficial `semgrep/semgrep` dispensa instalar Python/Semgrep local, e fixar a
  tag exata torna o resultado reprodutível entre máquinas e no CI.
- **Por que o par vulnerável + corrigido** em vez de só snippets soltos. O par prova
  duas coisas de uma vez: a regra pega um bug realista (11 achados em
  `examples/vulnerable/`) **e** o código corrigido passa limpo (0 achados em
  `examples/fixed/`). Também serve de referência de como corrigir cada achado.
- **Por que regras sob MIT.** Para rodarem em qualquer motor, livres da Semgrep Rules
  License, incluindo o Opengrep.
- **Dependências dos apps de exemplo** (`@nestjs/common`, `@nestjs/core`,
  `@prisma/client`, `express`, `express-session`, `cors`, `jsonwebtoken`, `typescript`)
  existem só para os exemplos serem código real e idiomático de cada framework-alvo.
  Não são necessárias para rodar as regras.

## O que não foi verificado

- O job e a referência de imagem/instalação do **Opengrep** **não foram executados**; a
  tag exata da imagem do Opengrep não pôde ser confirmada pelo autor. Confirme antes de
  depender dele.
- O CI **não foi rodado** pelo autor (sem execução de GitHub Actions neste ambiente).
- Os apps de exemplo **não passaram por `npm install` / typecheck** neste ambiente; são
  escritos para compilar contra as versões fixadas, mas o `tsc` não foi rodado.
- As taxas de falso positivo das heurísticas estão **sem medição** (ver acima).

## Licença

MIT — ver [`LICENSE`](LICENSE). Copyright (c) 2026 Hélio Delfino.
Política de segurança: [`SECURITY.md`](SECURITY.md).
