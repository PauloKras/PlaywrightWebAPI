import { type APIRequestContext } from '@playwright/test';

export class AuthRequest {
  constructor(private request: APIRequestContext) {}

  async login(email: string, password: string) {
  return this.request.post(`${process.env.BASE_URL_API}/users/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: { email, password },
  });

  }
}