import { LoginPayload } from "../../../requests/AuthRequest";

// Payload para teste de login com senha incorreta
export const incorrectPasswordPayload: LoginPayload = {
  email: process.env.NOTES_EMAIL!,
  password: "SenhaErrada!999",
};
