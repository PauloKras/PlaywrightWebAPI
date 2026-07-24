import { LoginPayload } from '../../../requests/AuthRequest';

// Payload para teste de login com email e senha válidos
export const validLoginPayload: LoginPayload = {
  email: process.env.NOTES_EMAIL!,
  password: process.env.NOTES_PASSWORD!,
};
