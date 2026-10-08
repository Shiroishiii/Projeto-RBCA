import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Faz login e devolve um token com a role que veio do banco.
export async function login(req, res) {
  const { email, password } = req.body || {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password ||
    Buffer.byteLength(password) > 72
  ) {
    return res.status(400).json({ message: "Informe email e senha validos." });
  }

  // O ? envia o email como dado, sem mistura-lo ao comando SQL.
  const [rows] = await req.app.locals.db.execute(
    "SELECT id, name, email, password_hash, role FROM users WHERE email = ?",
    [email.trim().toLowerCase()]
  );
  const user = rows[0];

  // bcrypt compara a senha digitada com o hash salvo no banco.
  if (!user || !(await bcrypt.compare(password, user.password_hash))) {
    return res.status(401).json({ message: "Email ou senha incorretos." });
  }

  // A role vem do banco: o aluno nao pode escolher ser admin na requisicao.
  // O token assinado vale por uma hora.
  const token = jwt.sign(
    {
      id: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256"
    }
  );

  // Devolve o perfil para escolher a tela, mas nunca devolve a senha.
  return res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role }
  });
}