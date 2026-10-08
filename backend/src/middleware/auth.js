import jwt from "jsonwebtoken";

// Confere se existe um token Bearer valido.
export function authenticate(req, res, next) {
  const [scheme, token] = (req.headers.authorization || "").split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Login necessario." });
  }
  try {
    // Verifica assinatura e validade; guarda o perfil para a pr?xima fun??o.
    req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ["HS256"] });
  } catch {
    return res.status(401).json({ message: "Sessao invalida ou expirada." });
  }
  // next continua o processamento da rota.
  next();
}

// Confere a permissao depois que o usuario foi autenticado.
export function requireRole(role) {
  return (req, res, next) => {
    // 403: est? logado, mas seu perfil n?o permite esta a??o.
    if (req.user?.role !== role) {
      return res.status(403).json({ message: "Acesso negado." });
    }
    next();
  };
}
