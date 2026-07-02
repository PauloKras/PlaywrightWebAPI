# Playwright Web API Testes

Este projeto contém testes de automação para APIs e interfaces Web utilizando o framework [Playwright](https://playwright.dev/). Ele é estruturado para facilitar a execução e manutenção de testes para diferentes tipos de interações.

## Tecnologias Utilizadas

*   [Playwright](https://playwright.dev/) para automação de testes.
*   [TypeScript](https://www.typescriptlang.org/) para tipagem e melhor organização do código.
*   [Dotenv](https://www.npmjs.com/package/dotenv) para gerenciamento de variáveis de ambiente.

## Estrutura do Projeto

O projeto está organizado da seguinte forma:

*   `tests/`: Contém todos os arquivos de teste.
    *   `tests/api/`: Testes de API.
    *   `tests/web/`: Testes de interface Web.
*   `pages/`: Contém Page Object Models para as páginas web.
*   `requests/`: Contém classes para abstrair requisições de API.
*   `playwright.config.ts`: Configuração principal do Playwright.
*   `.env.example`: Exemplo de arquivo para variáveis de ambiente.

## Configuração

Para configurar o ambiente de desenvolvimento, siga os passos abaixo:

1.  **Clone o repositório:**
    ```bash
    git clone <URL_DO_REPOSITORIO>
    cd PlaywrightWebAPI
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Configure as variáveis de ambiente:**
    Crie um arquivo `.env` na raiz do projeto, baseado no `.env.example`, e preencha com as informações necessárias. As variáveis esperadas incluem `BASE_URL`, `BASE_URL_API`, `EMAIL` e `PASSWORD`.
    
    Exemplo de `.env`:
    ```
    BASE_URL=https://sua-url-web.com
    BASE_URL_API=https://sua-url-api.com
    EMAIL=seu.email@example.com
    PASSWORD=sua_senha
    ```

## Como Executar os Testes

Você pode executar os testes de diferentes maneiras:

*   **Executar todos os testes (API e Web):**
    ```bash
    npx playwright test
    ```
*   **Executar apenas testes de API:**
    ```bash
    npx playwright test --project=api
    ```
*   **Executar apenas testes Web:**
    ```bash
    npx playwright test --project=web
    ```
*   **Executar um arquivo de teste específico:**
    ```bash
    npx playwright test tests/api/login.api.spec.ts
    ```

## Relatórios de Teste

Após a execução dos testes, você pode visualizar o relatório HTML gerado pelo Playwright com o seguinte comando:

```bash
npx playwright show-report
```

Os relatórios são gerados no diretório `playwright-report/`.