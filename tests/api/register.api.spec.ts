import { test, expect } from '@playwright/test';
import { AuthRequest, RegisterPayload } from '../../requests/AuthRequest';

test.describe('API de Registro de Usuário', () => {
  let auth: AuthRequest;

  test.beforeEach(({ request }) => {
    auth = new AuthRequest(request);
  });

  test('deve registrar um novo usuário com sucesso', async () => {
    const randomEmail = `test${Date.now()}@example.com`;
    const registerPayload: RegisterPayload = {
      name: 'Test User',
      email: randomEmail,
      password: 'password123!',
    };

    const response = await auth.register(registerPayload);

    expect(response.status()).toBe(201); // Ou 200, dependendo da API
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(201);
    expect(body.message).toBe('User account created successfully');
    expect(body.data).toBeDefined();
    expect(body.data.email).toBe(randomEmail);
  });

  test('não deve registrar usuário com e-mail já existente', async () => {
    // Primeiro, registra um usuário
    const existingEmail = `existing${Date.now()}@example.com`;
    const registerPayload: RegisterPayload = {
      name: 'Existing User',
      email: existingEmail,
      password: 'password123!',
    };
    await auth.register(registerPayload);

    // Tenta registrar com o mesmo e-mail novamente
    const response = await auth.register(registerPayload);

    expect(response.status()).toBe(409); // Ou outro código de erro para conflito
    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.status).toBe(409);
    expect(body.message).toContain('An account already exists with the same email address');
  });

  // Outros testes para validação de campos, etc.
});
