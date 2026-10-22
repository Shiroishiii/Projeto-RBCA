import { db } from "../config/database";

export async function setLog(req, res) {
    try {

        const sql = 'INSERT INTO logs (usuario, acao, recurso_afetado, id_recurso_afetado, valor_antigo, valor_novo, campos_alterados, ip, status_acao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        const [rows] = await db.query(sql, [req.body.usuario, 
            req.body.acao, 
            req.body.recurso_afetado, 
            req.body.id_recurso_afetado, 
            req.body.valor_antigo,
            req.body.valor_novo, 
            req.body.campos_alterados, 
            req.body.ip, 
            req.body.status_acao
        ])

        if (rows.affectedRows > 0) {
            res.status(201).json({ message: 'Log criado com sucesso' });
        } else {
            res.status(400).json({ message: 'Falha ao criar log' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Ocorreu um erro interno no servidor' });
    }
}