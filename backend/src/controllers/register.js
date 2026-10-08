import bcrypt from "bcryptjs";

// Cadastro público: recebe os dados do formulário e cria um usuário comum.
export async function register(req, res) {
  const { name, email, password } = req.body || {};

  // A API também valida os dados: não podemos confiar só no formulário.
  if (
    typeof name !== "string" || !name.trim() || name.trim().length > 100 ||
    typeof email !== "string" || email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" || password.length < 8 ||
    Buffer.byteLength(password) > 72
  ) {
    return res.status(400).json({
      message: "Informe nome (até 100 caracteres), e-mail válido e senha com pelo menos 8 caracteres e no máximo 72 bytes.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const [users] = await req.app.locals.db.execute(
    "SELECT id FROM users WHERE email = ?",
    [normalizedEmail]
  );
  if (users.length > 0) {
    return res.status(409).json({ message: "Este e-mail já está cadastrado." });
  }

  // Nunca salvamos a senha original. O login compara a senha com este hash.
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    // Os ? separam os dados do SQL. A role é definida pela API, não pelo aluno.
    await req.app.locals.db.execute(
      "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
      [name.trim(), normalizedEmail, passwordHash, "user"]
    );
  } catch (error) {
    // UNIQUE no banco também impede dois cadastros simultâneos do mesmo e-mail.
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Este e-mail já está cadastrado." });
    }
    throw error; // Outros erros são tratados pelo middleware de app.js.
  }

  return res.status(201).json({ message: "Cadastro realizado! Entre com seu e-mail e senha." });
}
