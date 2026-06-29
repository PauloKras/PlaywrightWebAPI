import { test, expect } from '@playwright/test';
import { AuthRequest } from '../../requests/AuthRequest';
import { ProfileRequest } from '../../requests/ProfileRequest';

test.describe('GET /users/profile', () => {
  let auth: AuthRequest;
  let profile: ProfileRequest;
  let authToken: string;

  test.beforeAll(async ({ request }) => {
    auth = new AuthRequest(request);
    // Realiza o login para obter o token de autenticação
    const loginResponse = await auth.login(
      process.env.NOTES_EMAIL!,
      process.env.NOTES_PASSWORD!,
    );
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.data.token;
  });

  test.beforeEach(({ request }) => {
    profile = new ProfileRequest(request);
  });

  test.afterEach(async () => {
    console.log('Aguardando 3 segundos após o teste...');
    await new Promise(resolve => setTimeout(resolve, 3000));
  });

  test('deve retornar 200 e as informações do perfil do usuário', async () => {
    // Usa o token obtido para buscar o perfil do usuário
    const response = await profile.getUserProfile(authToken);

    console.log('URL chamada:', response.url());
    console.log('Status:', response.status());
    console.log('Token enviado:', authToken);
    // console.log('Resposta:', await response.text());

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

  test('deve retornar 401 para token inválido/ausente', async ({ request }) => {
    profile = new ProfileRequest(request);
    const response = await profile.getUserProfile('invalid_token');

    expect(response.status()).toBe(401);
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toContain('Access token is not valid or has expired, you will need to login');
  });
});
