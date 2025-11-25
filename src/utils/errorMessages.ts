export const translateSupabaseError = (error: any): string => {
  if (!error) return "Erro desconhecido";

  const message = error.message || error.toString();

  const errorMap: Record<string, string> = {
    "Invalid login credentials": "Credenciais de login inválidas",
    "Email not confirmed": "E-mail não confirmado",
    "User already registered": "Usuário já cadastrado",
    "Password should be at least 6 characters": "A senha deve ter pelo menos 6 caracteres",
    "Invalid email": "E-mail inválido",
    "Email rate limit exceeded": "Limite de tentativas de e-mail excedido",
    "Signup is disabled": "Cadastro está desabilitado",
    "User not found": "Usuário não encontrado",
    "Token has expired": "Token expirado",
    "Invalid token": "Token inválido",
    "Network request failed": "Falha na conexão com a rede",
    "Failed to fetch": "Falha ao buscar dados",
  };

  for (const [key, value] of Object.entries(errorMap)) {
    if (message.includes(key)) {
      return value;
    }
  }

  return message;
};

