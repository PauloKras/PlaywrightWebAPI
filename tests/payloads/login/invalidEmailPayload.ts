import { LoginPayload } from "../../../requests/AuthRequest";

// Payload para teste de login com email inexistente
export const invalidEmailPayload: LoginPayload = {
  email: "nao-existe@email.com",
  password: process.env.NOTES_PASSWORD!,
};
