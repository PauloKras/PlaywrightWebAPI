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

  // O bloco afterEach foi descomentado para garantir a limpeza do ambiente após cada teste.
  // Ele tenta excluir o usuário criado, tratando casos onde o token pode ter expirado ou o usuário já foi deslogado.
  test.afterEach(async () => {
    try {
      if (authToken) {
        const deleteResponse = await profile.deleteUserProfile(authToken);
        if (deleteResponse.status() !== 200 && deleteResponse.status() !== 401) {
          console.error(`Falha ao excluir o usuário ${userEmail}. Status: ${deleteResponse.status()}`);
        }
      }
    } catch (error) {
      console.error(`Erro ao tentar excluir o usuário ${userEmail}:`, error);
    }
  });

  test('POST /users/forgot-password: deve iniciar o processo de redefinição de senha', async () => {
    const forgotPasswordPayload: ForgotPasswordPayload = { email: userEmail };
    const response = await auth.forgotPassword(forgotPasswordPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toContain('Password reset link successfully sent to');
    expect(body.message).toContain(userEmail);
    expect(body.message).toContain('Please verify by clicking on the given link');
  });

  // test('POST /users/verify-reset-password-token: deve verificar um token de redefinição de senha válido', async ({ request }) => {
  //   const forgotPasswordPayload: ForgotPasswordPayload = { email: userEmail };
  //   await auth.forgotPassword(forgotPasswordPayload);
  //   const simulatedValidToken = 'some_valid_reset_token'; 

  //   const response = await auth.verifyResetPasswordToken(simulatedValidToken);

  //   expect(response.status()).toBe(200); 
  //   const body = await response.json();
  //   expect(body.success).toBe(true);
  //   expect(body.status).toBe(200);
  //   expect(body.message).toBe('Token is valid'); 
  // });

  // test('POST /users/reset-password: deve redefinir a senha do usuário com um token válido', async ({ request }) => {
  //   const newPassword = 'newPassword123!';
  //   const simulatedValidToken = 'another_valid_reset_token'; 
  //   const resetPasswordPayload: ResetPasswordPayload = { token: simulatedValidToken, password: newPassword };
    
  //   const response = await auth.resetPassword(resetPasswordPayload);

  //   expect(response.status()).toBe(200); 
  //   const body = await response.json();
  //   expect(body.success).toBe(true);
  //   expect(body.status).toBe(200);
  //   expect(body.message).toBe('Password updated successfully');

  //   const loginPayload: LoginPayload = {
  //     email: userEmail,
  //     password: newPassword,
  //   };
  //   const loginResponse = await auth.login(loginPayload);
  //   expect(loginResponse.status()).toBe(200);
  // });

  test('POST /users/change-password: deve alterar a senha de um usuário logado', async () => {
    const newPassword = 'changedPassword123!';
    const changePasswordPayload: ChangePasswordPayload = {
      currentPassword: userPassword, 
      newPassword: newPassword,
    };
    const response = await auth.changePassword(authToken, changePasswordPayload);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('The password was successfully updated'); // Corrected message

    const loginPayloadNew: LoginPayload = { email: userEmail, password: newPassword };
    const loginResponseNew = await auth.login(loginPayloadNew);
    expect(loginResponseNew.status()).toBe(200);

    const loginPayloadOld: LoginPayload = { email: userEmail, password: userPassword };
    const loginResponseOld = await auth.login(loginPayloadOld);
    expect(loginResponseOld.status()).toBe(401); 

    userPassword = newPassword;
  });

  test('DELETE /users/logout: deve deslogar um usuário com sucesso', async () => {
    const response = await auth.logout(authToken);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.status).toBe(200);
    expect(body.message).toBe('User has been successfully logged out');

    const profileResponse = await profile.getUserProfile(authToken);
    expect(profileResponse.status()).toBe(401);
  });
});
