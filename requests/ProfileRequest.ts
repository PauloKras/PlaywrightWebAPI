import { APIRequestContext } from '@playwright/test';

export class ProfileRequest {
  private request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

async getUserProfile(token: string) {
    return await this.request.get(`${process.env.BASE_URL_API}/users/profile`, {
        headers: {
            'x-auth-token': token, // A API do ExpandTesting exige este formato
        },
    });
}
}
