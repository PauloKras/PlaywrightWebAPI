import { Page, expect } from '@playwright/test';

export class RegisterPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(process.env.BASE_URL + '/register'); // via .env
  }

async register(name: string, email: string, password: string) {
  await this.page.getByTestId('register-name').fill(name);
  await this.page.getByTestId('register-email').fill(email);
  await this.page.getByTestId('register-password').fill(password);
  await this.page.getByTestId('register-confirm-password').fill(password);
  await this.page.getByTestId('register-submit').click();
}

  async expectSuccessMessage() {
    //await this.page.pause(); // adiciona aqui
    await expect(
      this.page.getByText(/User account created successfully/i)
    ).toBeVisible();
  }

  async expectRedirectToLogin() {
    await this.page.getByText('Click here to Log In').click();
    await expect(this.page).toHaveURL(/\/login/);
  }

  async expectErrorMessage(message: string) {
    await expect(this.page.getByText(message)).toBeVisible();
  }

  async expectStillOnRegisterPage() {
    await expect(this.page).toHaveURL(/\/register/);
  }
}
