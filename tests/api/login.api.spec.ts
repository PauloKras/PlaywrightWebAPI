import { test, expect } from '@playwright/test';
import { AuthRequest } from '../../requests/AuthRequest';

test.describe('POST /users/login', () => {

  let auth: AuthRequest;

  test.beforeEach(({ request }) => {
    auth = new AuthRequest(request);
  });

  // ── Cenário 1: Login com sucesso ─────────────────────────────────────────
  test('deve retornar 200 e token com credenciais válidas', async () => {
    const response = await auth.login(
      process.env.NOTES_EMAIL!,
      process.env.NOTES_PASSWORD!,
    );
    console.log('URL chamada:', response.url());
    console.log('Status:', response.status());
    //console.log('Resposta:', await response.text())

    expect(response.status()).toBe(200);

    const body = await response.json();

    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Login successful');

    // token deve existir e ser uma string não vazia
    expect(body.data).toBeDefined();
    expect(typeof body.data.token).toBe('string');
    expect(body.data.token.length).toBeGreaterThan(0);

    // dados do usuário retornados
    expect(body.data.email).toBe(process.env.NOTES_EMAIL!.toLowerCase());
    expect(typeof body.data.name).toBe('string');
    expect(typeof body.data.id).toBe('string');
  });
  

  // ── Cenário 2: Email inválido ─────────────────────────────────────────────
  test('deve retornar 401 com email inexistente', async () => {
    const response = await auth.login(
      'nao-existe@email.com',
      process.env.NOTES_PASSWORD!,
    );

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.status).toBe(401);
    expect(body.message).toMatch(/incorrect email address or password/i);
  });

  // ── Cenário 3: Senha errada ───────────────────────────────────────────────
  test('deve retornar 401 com senha incorreta', async () => {
    const response = await auth.login(
      process.env.NOTES_EMAIL!,
      'SenhaErrada!999',
    );

    expect(response.status()).toBe(401);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/incorrect email address or password/i);
  });

  // ── Cenário 4: Email ausente no body ──────────────────────────────────────
  test('deve retornar 400 sem campo email', async () => {
    const response = await auth.login('', process.env.NOTES_PASSWORD!);

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.status).toBe(400);
  });

  // ── Cenário 5: Senha ausente no body ─────────────────────────────────────
  test('deve retornar 400 sem campo password', async () => {
    const response = await auth.login(process.env.NOTES_EMAIL!, '');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
    expect(body.status).toBe(400);
  });

  // ── Cenário 6: Formato de email inválido ──────────────────────────────────
  test('deve retornar 400 com email em formato inválido', async () => {
    const response = await auth.login('nao-é-um-email', 'qualquersenha');

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.success).toBe(false);
  });

  // ── Cenário 7: Content-Type errado ───────────────────────────────────────
  test('deve retornar erro com Content-Type incorreto', async ({ request }) => {
    const response = await request.post(
      'https://practice.expandtesting.com/notes/api/users/login',
      {
        headers: { 'Content-Type': 'text/plain' },
        data: `email=${process.env.NOTES_EMAIL}&password=${process.env.NOTES_PASSWORD}`,
      },
    );

    // API deve rejeitar ou retornar erro de validação
    expect([400, 415, 422]).toContain(response.status());
  });

});
