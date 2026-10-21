ls Trabalho 1: Site Institucional com HTML Semântico

**Instituição (fictícia):** Instituto Horizonte de Educação
**Disciplina / Curso:** Licenciatura em Computação (EAD), UFRB


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

## Páginas e requisitos

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

# ufrb
