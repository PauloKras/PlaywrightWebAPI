import { LoginPayload } from "../../../requests/AuthRequest";

// Payload para teste de login com email inválido (formato incorreto)
export const invalidFormatEmailPayload: LoginPayload = {
  email: "nao-e-um-email",
  password: "qualquersenha",
};
