import { type APIRequestContext } from '@playwright/test';

export interface LoginPayload {
  email?: string;
  password?: string;
}

export interface RegisterPayload {
  name?: string;
  email?: string;
  password?: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  password: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export class AuthRequest {
  constructor(private request: APIRequestContext) {}

  async login(payload: LoginPayload) {
  return this.request.post(`${process.env.BASE_URL_API}/users/login`, {
    headers: { 'Content-Type': 'application/json' },
    data: payload,
  });

  }

  async register(payload: RegisterPayload) {
    return this.request.post(`${process.env.BASE_URL_API}/users/register`, {
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });
  }

  async forgotPassword(payload: ForgotPasswordPayload) {
    return this.request.post(`${process.env.BASE_URL_API}/users/forgot-password`, {
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });
  }

  async verifyResetPasswordToken(token: string) {
    return this.request.post(`${process.env.BASE_URL_API}/users/verify-reset-password-token`, {
      headers: { 'Content-Type': 'application/json' },
      data: { token },
    });
  }

  async resetPassword(payload: ResetPasswordPayload) {
    return this.request.post(`${process.env.BASE_URL_API}/users/reset-password`, {
      headers: { 'Content-Type': 'application/json' },
      data: payload,
    });
  }

  async changePassword(token: string, payload: ChangePasswordPayload) {
    return this.request.post(`${process.env.BASE_URL_API}/users/change-password`, {
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      data: payload,
    });
  }

  async logout(token: string) {
    return this.request.delete(`${process.env.BASE_URL_API}/users/logout`, {
      headers: {
        'x-auth-token': token,
      },
    });
  }
}