import { LoginPayload } from "../../../requests/AuthRequest";

// Payload para teste de login com senha ausente
export const missingPasswordPayload: LoginPayload = {
  email: process.env.NOTES_EMAIL!,
};
