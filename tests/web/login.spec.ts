import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

// ─── Credenciais ──────────────────────────────────────────────────────────────
// Para criar uma conta: https://practice.expandtesting.com/notes/app/register
const VALID_EMAIL    = process.env.NOTES_EMAIL!;
const VALID_PASSWORD = process.env.NOTES_PASSWORD!;
// ─────────────────────────────────────────────────────────────────────────────

test.describe('Login - Notes App', () => {

  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    // Bloqueia anúncios e trackers (Google Ads, analytics, etc.) usando expressão regular TESTE
    await page.route(/(googleads|googlesyndication|doubleclick|google-analytics|adservice)/, route => route.abort());

    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // ── Cenário 1: Login com sucesso ──────────────────────────────────────────
  test('deve fazer login com credenciais válidas', async () => {
    await loginPage.login(VALID_EMAIL, VALID_PASSWORD);
    await loginPage.expectSuccessRedirect();
  });

  // ── Cenário 2: Login com Email inválido ─────────────────────────────────────────────
  test('deve exibir erro com email inválido', async () => {
    await loginPage.login('invalido@email.com', VALID_PASSWORD);
    await loginPage.expectErrorMessage('Incorrect email address or password');
    await loginPage.expectStillOnLoginPage();
  });

  // ── Cenário 3: Login com Senha errada ───────────────────────────────────────────────
  test('deve exibir erro com senha incorreta', async () => {
    await loginPage.login(VALID_EMAIL, 'SenhaErrada!999');
    await loginPage.expectErrorMessage('Incorrect email address or password');
    await loginPage.expectStillOnLoginPage();
  });

  // ── Cenário 4: Login com Campos em branco ───────────────────────────────────────────
  test('deve impedir envio com campos vazios', async ({ page }) => {
    await loginPage.submitButton.click();

    // O browser nativo bloqueia o submit via required; validamos que não houve redirect
    await expect(page).toHaveURL(/\/login$/);
  });

  // ── Cenário 5: Login com Formato de email inválido ──────────────────────────────────
  test('deve rejeitar email sem formato válido', async ({ page }) => {
    await loginPage.emailInput.fill('nao-é-um-email');
    await loginPage.passwordInput.fill(VALID_PASSWORD);
    await loginPage.submitButton.click();

    // Validação nativa do browser impede submit
    await expect(page).toHaveURL(/\/login$/);
  });

  // ── Cenário 6: Login com Verificação da página de login ─────────────────────────────
  test('deve exibir os elementos essenciais da página', async ({ page }) => {
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
    await expect(loginPage.submitButton).toBeEnabled();
    await expect(page).toHaveTitle(/Notes/i);
  });

});
