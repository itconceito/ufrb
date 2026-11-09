# Claquete: catálogo de filmes e séries

Trabalho 3 (JavaScript interativo). Aplicação web que busca filmes e séries na API do **TMDB**, mostra os detalhes de cada título e guarda os favoritos no navegador.

## Funcionalidades

- Busca por título (ao digitar ou ao enviar o formulário), com alternância entre **Filmes** e **Séries**
- Resultados em grid responsivo (mobile-first)
- Modal com pôster, sinopse, nota, duração/temporadas e gêneros
- Favoritos no **LocalStorage**, com página própria (`favoritos.html`)
- Filtro por gênero e paginação
- Loading spinner, mensagens de erro claras e formulário para informar a chave da API

## Como obter a chave da API

1. Crie uma conta gratuita em https://www.themoviedb.org
2. Abra *Configurações > API* e solicite uma chave
3. Use **uma** destas opções:
   - Abra o site e cole a chave no formulário que aparece (fica salva só no seu navegador); ou
   - Edite `js/config.js` e preencha `TMDB_API_KEY`.

Funciona com a chave v3 (curta) e com o token v4 (começa com `eyJ`).

> Aviso: em um site estático, qualquer chave colocada no código fica visível para quem abrir o DevTools. Prefira o formulário na tela e **não** publique uma chave pessoal no repositório. A chave gratuita do TMDB tem risco baixo, mas o cuidado vale como boa prática.

## Como rodar

O projeto usa módulos ES (`type="module"`), então precisa de um servidor local (abrir o `index.html` com duplo clique não funciona):

- VS Code: extensão **Live Server** > *Go Live*; ou
- Terminal: `python3 -m http.server 8000` e acesse http://localhost:8000

## Deploy (GitHub Pages)

1. Suba os arquivos para um repositório no GitHub
2. *Settings > Pages > Deploy from a branch > main / (root)*
3. Acesse o link gerado e informe sua chave no formulário

## Estrutura

```
trabalho3/
├── index.html        # busca, filtros, grid e paginação
├── favoritos.html    # lista de favoritos
├── css/style.css     # estilos e responsividade
├── js/
│   ├── app.js        # interface, eventos e estado
│   ├── api.js        # chamadas ao TMDB (fetch + async/await)
│   ├── storage.js    # LocalStorage (favoritos e chave)
│   └── config.js     # chave da API (opcional)
├── images/
└── README.md
```

## Decisões técnicas

- **Delegação de eventos**: um único listener no grid trata cliques de todos os cards.
- **Corrida de requisições**: cada busca recebe um id, e respostas antigas são descartadas.
- **Filtro de gênero com busca**: o endpoint de busca do TMDB não aceita gênero, então, quando há texto digitado, o filtro é aplicado aos resultados da página atual. Sem texto, o filtro usa o endpoint `discover`, que filtra no servidor.
- **Segurança**: os cards são criados com `createElement`/`textContent`, sem `innerHTML`.

## Desenhado e desenvolvido por Marcio Oliveira para Disciplina de Desenvolvimento de Software
