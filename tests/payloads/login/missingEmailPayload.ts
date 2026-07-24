import { LoginPayload } from "../../../requests/AuthRequest";

// Payload para teste de login com email ausente
export const missingEmailPayload: LoginPayload = {
  password: process.env.NOTES_PASSWORD!,
};
