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

  if (!Number.isSafeInteger(id) || id <= 0) {
    return res.status(400).json({ message: "ID invalido." });
  }

  const [result] = await req.app.locals.db.execute(
    "DELETE FROM materials WHERE id = ?",
    [id]
  );

  if (!result.affectedRows) {
    return res.status(404).json({ message: "Material nao encontrado." });
  }

  // 204 significa sucesso sem conte?do na resposta.
  res.status(204).end();
}