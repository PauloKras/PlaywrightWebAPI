import { test, expect } from '@playwright/test';
import { AuthRequest, LoginPayload } from '../../requests/AuthRequest';
import { ProfileRequest } from '../../requests/ProfileRequest';
//import { validLoginPayload } from '../payloads/login/validLoginPayload';

test.describe('API de Perfil de Usuário', () => {
  let auth: AuthRequest;
  let profile: ProfileRequest;
  let authToken: string;
  let userName: string;

  let userEmail: string;
  let userPassword: string;

  test.beforeAll(async ({ request }) => {
    auth = new AuthRequest(request);

    // Gerar credenciais únicas para registro
    const timestamp = Date.now();
    userEmail = `test${timestamp}@example.com`;
    userPassword = `Password${timestamp}`;

    const registerPayload = {
      name: `Test User ${timestamp}`,
      email: userEmail,
      password: userPassword,
    };

    // Registrar um novo usuário
    const registerResponse = await auth.register(registerPayload);
    expect(registerResponse.status()).toBe(201); // Assumindo 201 Created para registro bem-sucedido

    // Realiza o login para obter o token de autenticação com as novas credenciais
    const loginPayload: LoginPayload = {
      email: userEmail,
      password: userPassword,
    };
    const loginResponse = await auth.login(loginPayload);
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.data.token;
    userName = registerPayload.name; // Armazenar o nome do usuário registrado
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
    expect(body.data.email).toBe(userEmail);
    expect(body.data.name).toBe(userName);
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
  
    // test('PUT /users/profile: deve atualizar o perfil do usuário (PUT)', async ({ request }) => {
    //   profile = new ProfileRequest(request);
    //   const updatedName = 'Nome Atualizado PUT';
    //   const updatedProfile = {
    //     name: updatedName,
    //   };
  
    //   const response = await profile.updateUserProfile(authToken, updatedProfile);
  
    //   expect(response.status()).toBe(200);
    //   const body = await response.json();
    //   expect(body.success).toBe(true);
    //   expect(body.status).toBe(200);
    //   expect(body.message).toBe('Profile updated successfully');
    //   expect(body.data.name).toBe(updatedName);
  
    //   const getResponse = await profile.getUserProfile(authToken);
    //   const getBody = await getResponse.json();
    //   expect(getBody.data.name).toBe(updatedName);
    // });

  test('PATCH /users/profile: deve atualizar parcialmente o perfil do usuário (PATCH)', async ({ request }) => {
    profile = new ProfileRequest(request);
    const partialUpdate = {
      name: 'UpdatedName',
    };

    const response = await profile.patchUserProfile(authToken, partialUpdate);

    expect(response.status()).toBe(200);
    const body = await response.json();
    console.log("PATCH Response Body:", body); // Adiciona log do corpo da resposta
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Profile updated successful');
    expect(body.data.name).toBe(partialUpdate.name);
    expect(body.message).toBe('Profile updated successful');

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
    expect(body.message).toBe('Account successfully deleted');

    const getResponse = await profile.getUserProfile(authToken);
    expect(getResponse.status()).toBe(401);
  });
});
