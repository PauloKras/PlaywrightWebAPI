import { test, expect } from '@playwright/test';
import { AuthRequest, LoginPayload } from '../../requests/AuthRequest';
import { ProfileRequest } from '../../requests/ProfileRequest';
//import { validLoginPayload } from '../payloads/login/validLoginPayload';

test.describe('API de Perfil de Usuário', () => {
  let auth: AuthRequest;
  let profile: ProfileRequest;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    auth = new AuthRequest(request);
    // Realiza o login para obter o token de autenticação
    const loginPayload: LoginPayload = {
      email: process.env.NOTES_EMAIL!,
      password: process.env.NOTES_PASSWORD!,
    };
    const loginResponse = await auth.login(loginPayload);
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.data.token;
  });

  test.beforeEach(({ request }) => {
    profile = new ProfileRequest(request);
  });

  test.afterEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 3000)); // Pequena pausa para evitar rate limiting em APIs gratuitas
  });

  test('GET /users/profile: deve retornar 200 e as informações do perfil do usuário', async () => {
    const response = await profile.getUserProfile(authToken);

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Profile successful');
    expect(body.data).toBeDefined();
    expect(body.data.email).toBe(process.env.NOTES_EMAIL!.toLowerCase());
    expect(body.data.name).toBe(process.env.NOTES_NAME);
    expect(typeof body.data.id).toBe('string');
  });

  test('GET /users/profile: deve retornar 401 para token inválido/ausente', async ({ request }) => {
    profile = new ProfileRequest(request);
    const response = await profile.getUserProfile('invalid_token');

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Access token is not valid or has expired, you will need to login');
  });
  
  test('PUT /users/profile: deve atualizar o perfil do usuário (PUT)', async ({ request }) => {
    profile = new ProfileRequest(request);
    const updatedName = 'Nome Atualizado PUT';
    const updatedEmail = 'put.email@example.com'; // Usar um e-mail diferente para evitar conflitos
    const updatedProfile = {
      name: updatedName,
      email: updatedEmail,
    };

    const response = await profile.updateUserProfile(authToken, updatedProfile);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Profile updated successfully');
    expect(body.data.name).toBe(updatedName);
    expect(body.data.email).toBe(updatedEmail);

    const getResponse = await profile.getUserProfile(authToken);
    const getBody = await getResponse.json();
    expect(getBody.data.name).toBe(updatedName);
    expect(getBody.data.email).toBe(updatedEmail);
  });

  test('PATCH /users/profile: deve atualizar parcialmente o perfil do usuário (PATCH)', async ({ request }) => {
    profile = new ProfileRequest(request);
    const partialUpdate = {
      name: 'Nome Parcialmente Atualizado PATCH',
    };

    const response = await profile.patchUserProfile(authToken, partialUpdate);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Profile updated successful');
    expect(body.data.name).toBe(partialUpdate.name);

    const getResponse = await profile.getUserProfile(authToken);
    const getBody = await getResponse.json();
    expect(getBody.data.name).toBe(partialUpdate.name);
  });

  test('DELETE /users/delete-account: deve excluir o perfil do usuário', async ({ request }) => {
    profile = new ProfileRequest(request);
    const response = await profile.deleteUserProfile(authToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('User account successfully deleted');

    const getResponse = await profile.getUserProfile(authToken);
    expect(getResponse.status()).toBe(401);
  });
});
