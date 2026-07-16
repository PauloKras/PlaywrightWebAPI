import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;

  // Locators
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorAlert: Locator;
  /**
   * Localizador para o título da página de login (h1, h2, etc.) que contém o texto "Login".
   */
  private readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput     = page.locator('#email');
    this.passwordInput  = page.locator('input[type="password"]');
    this.submitButton   = page.getByTestId('login-submit');
    this.errorAlert     = page.locator('[data-testid="alert-message"]');
    this.pageTitle      = page.getByRole('heading', { name: /login/i });
  }

  async goto() {
    await this.page.goto(process.env.BASE_URL + '/login'); // via .env
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async pause() {
    await this.page.pause();
  }

  async expectSuccessRedirect() {
    await expect(this.page).toHaveURL(/\/notes\/app$/);
  }

  async expectErrorMessage(message: string) {
    await expect(this.errorAlert).toBeVisible();
    await expect(this.errorAlert).toContainText(message);
  }

  async expectStillOnLoginPage() {
    await expect(this.page).toHaveURL(/\/login$/);
  }
}
