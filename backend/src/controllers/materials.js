// Lista materiais para qualquer usuario autenticado.
// Lista materiais; aceita ?search= para filtrar por nome ou categoria.
export async function listMaterials(req, res) {
  const search = String(req.query.search || "").trim().slice(0, 100);

  let sql = "SELECT id, name, category FROM materials";
  const params = [];

  if (search) {
    // O texto vai como parâmetro (?), nunca concatenado: evita SQL injection.
    sql += " WHERE name LIKE ? OR category LIKE ?";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY id";

  const [rows] = await req.app.locals.db.execute(sql, params);
  res.json(rows);
}

// Exclui material: a rota ja garante que apenas admin chega aqui.
export async function deleteMaterial(req, res) {
  const id = Number(req.params.id);

  const usuario_id = 0
  const acao = "DELETE"
  const recurso_afetado = "materials"
  const id_recurso_afetado = id
  const valor_antigo = null
  const valor_novo = null
  const campos_alterados = null
  const ip = req.ip || req.connection.remoteAddress

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const [result] = await req.app.locals.db.execute(
    "DELETE FROM materials WHERE id = ?",
    [id]
  );

  const obj = {
    usuario_id: usuario_id,
    acao: acao,
    recurso_afetado: recurso_afetado,
    id_recurso_afetado: id_recurso_afetado,
    valor_antigo: valor_antigo,
    valor_novo: valor_novo,
    campos_alterados: campos_alterados,
    ip: ip,
    status_acao: "FRACASSO"
  };

  if (!result.affectedRows) {
    registerLog(obj);
    return res.status(404).json({ message: "Material nao encontrado." });
  }

  // 204 significa sucesso sem conte?do na resposta.
  res.status(204).end();
}