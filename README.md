# Trabalho 1: Site Institucional com HTML Semântico

**Instituição (fictícia):** Instituto Horizonte de Educação
**Disciplina / Curso:** Licenciatura em Computação (EAD), UFRB
**Período:** Semanas 1-2, valor de 15 pontos
**Equipe:** _(preencher: nomes dos 2-3 integrantes)_

## Descrição

Site institucional de uma organização educacional fictícia, desenvolvido
**apenas com HTML5 semântico** (sem CSS, sem JavaScript, sem frameworks ou
templates). O foco está na estrutura correta do conteúdo, no uso apropriado
das tags semânticas e na acessibilidade.

## Estrutura de arquivos

```
trabalho1/
├── index.html      Página inicial
├── sobre.html      Sobre Nós (história, equipe, infraestrutura)
├── cursos.html     Cursos e Programas (lista + tabela comparativa)
├── contato.html    Contato (formulário, endereço, mapa)
├── images/         18 imagens (logo, hero, cursos, docentes, infraestrutura)
└── README.md       Este arquivo
```

## Páginas e requisitos atendidos

| Página | Conteúdo |
|--------|----------|
| `index.html` | Cabeçalho com logo e menu; seção hero; missão, visão e valores; 3 destaques de cursos; aside com avisos; rodapé com contato |
| `sobre.html` | História com linha do tempo; 6 membros da equipe; 3 espaços de infraestrutura e lista de recursos |
| `cursos.html` | 6 cursos com descrição; tabela comparativa de 6 colunas x 7 linhas (com cabeçalho) |
| `contato.html` | Formulário completo com validações HTML5; endereço com `<address>`; mapa em `<iframe>` |

## Tags semânticas utilizadas

`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`,
`<footer>`, `<h1>` a `<h3>` (hierarquia lógica, um único `<h1>` por página),
`<figure>` e `<figcaption>`, `<address>`, `<table>` com `<caption>`,
`<thead>`, `<tbody>` e `<th scope>`, listas `<ol>` e `<ul>`, `<fieldset>` e
`<legend>`, `<small>`.

## Formulário (contato.html)

- Nome completo: `text`, obrigatório
- E-mail: `email`, obrigatório (validação nativa do HTML5)
- Telefone: `tel`, opcional, com `pattern` brasileiro
- Assunto: `select` com 6 opções, obrigatório
- Mensagem: `textarea`, obrigatória, `minlength="20"`
- Checkbox da política de privacidade: obrigatório
- Botões: **Enviar** (`type="submit"`) e **Limpar** (`type="reset"`)

O formulário não envia dados a um servidor; as validações são todas nativas
do navegador.

## Acessibilidade

- Todas as imagens possuem `alt` descritivo
- Atributo `title` em links, campos e iframe
- Todos os campos têm `<label>` associado por `for`/`id`
- Link de salto ("Pular para o conteúdo principal") para navegação por teclado
- `aria-label` nos menus e `aria-labelledby` nas seções
- `aria-current="page"` no item ativo do menu
- Atributo `lang="pt-BR"` em todas as páginas

## Boas práticas de código

- Indentação consistente de 2 espaços
- Tags em minúsculas e atributos entre aspas duplas
- Comentários explicativos nas seções importantes

## Como executar

Basta abrir o arquivo `index.html` em qualquer navegador. Não há etapa de
instalação nem de build. O mapa da página de contato requer conexão com a
internet.

## Sobre as imagens

As imagens foram geradas como ilustrações simples para este trabalho, sem uso
de material com direitos autorais.

## Validação recomendada antes da entrega

1. Validar cada página em <https://validator.w3.org/>
2. Rodar a extensão WAVE para verificar a acessibilidade
3. Testar a navegação apenas com o teclado (Tab, Shift+Tab, Enter)
4. Testar o formulário com campos vazios, e-mail inválido e mensagem curta

## Organização da equipe

_(preencher: divisão de tarefas por integrante e fluxo de trabalho no Git/GitHub)_

Sugestão de divisão: cada integrante fica responsável por 1-2 páginas, com
commits pequenos e mensagens descritivas, e a validação final é feita em
conjunto.
# ufrb
