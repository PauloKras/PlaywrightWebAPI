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

  async updateUserProfile(token: string, profileData: any) {
    return await this.request.put(`${process.env.BASE_URL_API}/users/profile`, {
      headers: {
        'x-auth-token': token,
      },
      data: profileData,
    });
  }

  async patchUserProfile(token: string, partialProfileData: any) {
    return await this.request.patch(`${process.env.BASE_URL_API}/users/profile`, {
      headers: {
        'x-auth-token': token,
      },
      data: partialProfileData,
    });
  }

  async deleteUserProfile(token: string) {
    return await this.request.delete(`${process.env.BASE_URL_API}/users/delete-account`, {
      headers: {
        'x-auth-token': token,
      },
    });
  }
}
