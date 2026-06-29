# Contexto do Projeto Playwright
Este é um projeto de testes automatizados utilizando Playwright com TypeScript no VS Code.

## Regras de Código:
- Sempre use Page Object Model (POM).
- Os testes devem rodar em modo Headless por padrão.
- Use seletores baseados em acessibilidade (`getByRole`, `getByText`) em vez de XPath ou seletores CSS brutos.

## Comandos Úteis:
- Rodar todos os testes: `npx playwright test`
- Abrir o relatório: `npx playwright show-report`
- Rodar um teste específico: `npx playwright test <nome-do-arquivo>`