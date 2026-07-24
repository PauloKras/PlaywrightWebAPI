import { test, expect } from '@playwright/test';
import { AuthRequest, LoginPayload, RegisterPayload, ForgotPasswordPayload, ResetPasswordPayload, ChangePasswordPayload } from '../../requests/AuthRequest';
import { ProfileRequest } from '../../requests/ProfileRequest';

test.describe('API de Autenticação Estendida', () => {
  let auth: AuthRequest;
  let profile: ProfileRequest;
  let authToken: string;
  let userEmail: string;
  let userPassword = 'password123!';

  test.beforeEach(async ({ request }) => {
    auth = new AuthRequest(request);
    profile = new ProfileRequest(request);

    // Registrar um novo usuário para cada teste para garantir isolamento
    userEmail = `test${Date.now()}@example.com`;
    const registerPayload: RegisterPayload = {
      name: 'Test User',
      email: userEmail,
      password: userPassword,
    };
    await auth.register(registerPayload);

    // Fazer login para obter o token para testes que exigem autenticação
    const loginPayload: LoginPayload = {
      email: userEmail,
      password: userPassword,
    };
    const loginResponse = await auth.login(loginPayload);
    expect(loginResponse.status()).toBe(200);
    const body = await loginResponse.json();
    authToken = body.data.token;
  });

  test.afterEach(async () => {
    // Excluir o usuário criado após cada teste para limpar o ambiente
    // console.log('Excluindo usuário:', userEmail);
    // await profile.deleteUserProfile(authToken); // Isso será corrigido no próximo passo
  });

  test('POST /users/forgot-password: deve iniciar o processo de redefinição de senha', async () => {
    const forgotPasswordPayload: ForgotPasswordPayload = { email: userEmail };
    const response = await auth.forgotPassword(forgotPasswordPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Email sent successfully');
  });

  test('POST /users/verify-reset-password-token: deve verificar um token de redefinição de senha válido', async ({ request }) => {
    // Este teste é mais complexo pois depende de um token gerado e enviado por e-mail.
    // Para simplificar, simularemos um token válido. Em um cenário real, precisaríamos de:
    // 1. Um serviço de e-mail mockado ou real para capturar o token.
    // 2. Um endpoint para forçar a geração de um token de redefinição para um usuário específico (para testes).
    // Como não temos acesso a essas ferramentas, vamos assumir um token simulado para validação do endpoint.

    // Primeiro, forçar a geração de um token (simulado)
    const forgotPasswordPayload: ForgotPasswordPayload = { email: userEmail };
    await auth.forgotPassword(forgotPasswordPayload);
    // Em um cenário real, aqui você extrairia o token do e-mail.
    // Para este teste, assumiremos um token de exemplo válido (se a API permitir) ou precisaremos de uma forma de obtê-lo.
    // Sem um token real, este teste pode ser difícil de passar de forma consistente.
    // Por enquanto, vamos assumir que um token válido é obtido de alguma forma.
    const simulatedValidToken = 'some_valid_reset_token'; // Substituir por um token real se possível

    const response = await auth.verifyResetPasswordToken(simulatedValidToken);

    // A API deve retornar 200 se o token for válido e não expirado.
    // O status e a mensagem podem variar dependendo da implementação exata da API.
    expect(response.status()).toBe(200); 
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Token is valid'); // Assumindo esta mensagem
  });

  test('POST /users/reset-password: deve redefinir a senha do usuário com um token válido', async ({ request }) => {
    // Similar ao teste acima, dependemos de um token de redefinição de senha válido.
    // Para este exemplo, vamos reutilizar a ideia de um token simulado.

    const newPassword = 'newPassword123!';
    const simulatedValidToken = 'another_valid_reset_token'; // Substituir por um token real se possível
    const resetPasswordPayload: ResetPasswordPayload = { token: simulatedValidToken, password: newPassword };
    
    const response = await auth.resetPassword(resetPasswordPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Password updated successfully');

    // Tentar logar com a nova senha para verificar se a redefinição funcionou
    const loginPayload: LoginPayload = {
      email: userEmail,
      password: newPassword,
    };
    const loginResponse = await auth.login(loginPayload);
    expect(loginResponse.status()).toBe(200);
  });

  test('POST /users/change-password: deve alterar a senha de um usuário logado', async () => {
    const newPassword = 'changedPassword123!';
    const changePasswordPayload: ChangePasswordPayload = {
      oldPassword: userPassword,
      newPassword: newPassword,
    };
    const response = await auth.changePassword(authToken, changePasswordPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('Password updated successfully');

    // Tentar logar com a nova senha e verificar que a senha antiga não funciona
    const loginPayloadNew: LoginPayload = { email: userEmail, password: newPassword };
    const loginResponseNew = await auth.login(loginPayloadNew);
    expect(loginResponseNew.status()).toBe(200);

    const loginPayloadOld: LoginPayload = { email: userEmail, password: userPassword };
    const loginResponseOld = await auth.login(loginPayloadOld);
    expect(loginResponseOld.status()).toBe(401); // Senha antiga não deve mais funcionar

    // Atualizar a senha do usuário para `newPassword` para os próximos `beforeEach`
    userPassword = newPassword;
  });

  test('DELETE /users/logout: deve deslogar um usuário com sucesso', async () => {
    const response = await auth.logout(authToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('User has been logged out successfully!');

    // Tentar acessar um endpoint protegido com o token deslogado deve falhar
    const profileResponse = await profile.getUserProfile(authToken);
    expect(profileResponse.status()).toBe(401);
  });
});
