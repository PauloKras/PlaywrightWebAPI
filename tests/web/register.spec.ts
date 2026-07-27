import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';

// —— Credenciais ——————————————————————————————————————————————————————————————
// Para criar uma conta: https://practice.expandtesting.com/notes/app/register
const VALID_NAME     = process.env.NOTES_NAME!;
const VALID_PASSWORD = process.env.NOTES_PASSWORD!;
// ————————————————————————————————————————————————————————————————————————————

test.describe('Register - Notes App', () => {

  let registerPage: RegisterPage;

  test.beforeEach(async ({ page }) => {
    // Bloqueia anúncios e trackers (Google Ads, analytics, etc.) usando expressão regular
    await page.route(/(googleads|googlesyndication|doubleclick|google-analytics|adservice)/, route => route.abort());

    registerPage = new RegisterPage(page);
    await registerPage.goto();
  });
/*
  // — Cenário 0: Registro com sucesso ————————————————————————————————————————
  test('deve registrar usuário paulo com dados válidos', async () => {
    // Gera e-mail único para não colidir com cadastros anteriores
    await registerPage.register(VALID_NAME, VALID_EMAIL, VALID_PASSWORD);
    await registerPage.expectSuccessMessage();
    await registerPage.expectRedirectToLogin();
  });
*/
  // — Cenário 1: Criar registro com sucesso ————————————————————————————————————————
  test('deve registrar usuário com dados válidos', async () => {
    // Gera e-mail único para não colidir com cadastros anteriores
    const uniqueEmail = `test_${Date.now()}@example.com`;
    await registerPage.register(VALID_NAME, uniqueEmail, VALID_PASSWORD);
    await registerPage.expectSuccessMessage();
    await registerPage.expectRedirectToLogin();
  });

  // — Cenário 2: Criar com E-mail inválido ——————————————————————————————————————————————
  test('deve exibir erro com email inválido', async () => {
    await registerPage.register(VALID_NAME, 'email-invalido', VALID_PASSWORD);
    await registerPage.expectErrorMessage('Email address is invalid');
    await registerPage.expectStillOnRegisterPage();
  });

  // — Cenário 3: Criar com Senha muito curta ———————————————————————————————————————————
  test('deve exibir erro com senha muito curta', async () => {
    // Note: This test uses VALID_EMAIL, which is from .env. 
    // If .env.NOTES_EMAIL is already registered, this test might behave unexpectedly.
    // For robust testing, consider dynamically generating a new user or explicitly ensuring the email state.
    await registerPage.register(VALID_NAME, process.env.NOTES_EMAIL!, '123');
    await registerPage.expectErrorMessage('Password should be between 6 and 30 characters');
    await registerPage.expectStillOnRegisterPage();
  });

  // — Cenário 4: Criar com Campos obrigatórios vazios ——————————————————————————————————
  // test('deve exibir erro ao submeter formulário vazio', async () => {
  //   await registerPage.register('', '', '');
  //   await registerPage.expectErrorMessage('Please enter your name.'); // Corrected assertion
  //   await registerPage.expectStillOnRegisterPage();
  // });

  // — Cenário 5: Criar com E-mail já cadastrado ————————————————————————————————————————
  // test('deve exibir erro ao tentar registrar e-mail já existente', async ({ page }) => {
  //   const uniqueEmail = `duplicate_email_${Date.now()}@example.com`;
  //   const uniquePassword = `duplicate_password_${Date.now()}!`;

  //   // Register the user successfully first
  //   await registerPage.register(VALID_NAME, uniqueEmail, uniquePassword);
  //   // Removed expectSuccessMessage() and expectRedirectToLogin() here

  //   // Go back to the registration page to attempt duplicate registration
  //   await registerPage.goto();
  //   await registerPage.register(VALID_NAME, uniqueEmail, uniquePassword);
  //   await registerPage.expectErrorMessage('An account already exists with the same email address');
  //   await registerPage.expectStillOnRegisterPage();
  // });
  
});
