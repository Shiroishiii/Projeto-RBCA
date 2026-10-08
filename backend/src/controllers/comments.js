import { db } from "../config/database.js";

export const createComment = async (req, res) => {
    const { text, material_id } = req.body;

    if (
        typeof text !== "string" ||
        text.trim().length < 1 ||
        text.trim().length > 500
    ) {
        return res.status(400).json({
            error: "O comentário deve ser um texto entre 1 e 500 caracteres"
        });
    }

    if (!material_id) {
        return res.status(400).json({
            error: "Material não informado"
        });
    }

    if (!req.user?.id) {
        return res.status(401).json({
            error: "Usuário não autenticado"
        });
    }

    try {
        const [result] = await db.query(
            `
            INSERT INTO comments (material_id, user_id, text)
            VALUES (?, ?, ?)
            `,
            [material_id, req.user.id, text.trim()]
        );

        return res.status(201).json({
            message: "Comentário criado com sucesso",
            id: result.insertId
        });
    } catch (error) {
        console.error("Erro criando comentário:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};

export const getComments = async (req, res) => {
    try {
        const [comments] = await db.query(
            `
            SELECT
                c.id,
                c.material_id,
                c.user_id,
                c.text,
                c.created_at,
                u.name AS user_name
            FROM comments c
            INNER JOIN users u ON u.id = c.user_id
            ORDER BY c.created_at DESC
            `
        );

        return res.status(200).json(comments);
    } catch (error) {
        console.error("Erro buscando comentários:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};

export const getCommentsByMaterial = async (req, res) => {
    const { materialId } = req.params;

    try {
        const [comments] = await db.query(
            `
            SELECT
                c.id,
                c.material_id,
                c.user_id,
                c.text,
                c.created_at,
                u.name AS user_name
            FROM comments c
            INNER JOIN users u ON u.id = c.user_id
            WHERE c.material_id = ?
            ORDER BY c.created_at DESC
            `,
            [materialId]
        );

        return res.status(200).json(comments);
    } catch (error) {
        console.error("Erro buscando comentários por material:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};

export const getCommentById = async (req, res) => {
    const { id } = req.params;

    try {
        const [comments] = await db.query(
            `
            SELECT
                c.id,
                c.material_id,
                c.user_id,
                c.text,
                c.created_at,
                u.name AS user_name
            FROM comments c
            INNER JOIN users u ON u.id = c.user_id
            WHERE c.id = ?
            `,
            [id]
        );

        if (comments.length === 0) {
            return res.status(404).json({
                error: "Comentário não encontrado"
            });
        }

        return res.status(200).json(comments[0]);
    } catch (error) {
        console.error("Erro buscando comentário:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};

export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (
        typeof text !== "string" ||
        text.trim().length < 1 ||
        text.trim().length > 500
    ) {
        return res.status(400).json({
            error: "O comentário deve ser um texto entre 1 e 500 caracteres"
        });
    }

    try {
        const [comments] = await db.query(
            `
            SELECT user_id
            FROM comments
            WHERE id = ?
            `,
            [id]
        );

        if (comments.length === 0) {
            return res.status(404).json({
                error: "Comentário não encontrado"
            });
        }

        const comment = comments[0];

        if (
            req.user.role !== "admin" &&
            comment.user_id !== req.user.id
        ) {
            return res.status(403).json({
                error: "Você não pode editar este comentário"
            });
        }

        await db.query(
            `
            UPDATE comments
            SET text = ?
            WHERE id = ?
            `,
            [text.trim(), id]
        );

        return res.status(200).json({
            message: "Comentário atualizado com sucesso"
        });
    } catch (error) {
        console.error("Erro atualizando comentário:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};

export const deleteComment = async (req, res) => {
    const { id } = req.params;

    try {
        const [comments] = await db.query(
            `
            SELECT user_id
            FROM comments
            WHERE id = ?
            `,
            [id]
        );

        if (comments.length === 0) {
            return res.status(404).json({
                error: "Comentário não encontrado"
            });
        }

        const comment = comments[0];

        if (
            req.user.role !== "admin" &&
            comment.user_id !== req.user.id
        ) {
            return res.status(403).json({
                error: "Você não pode excluir este comentário"
            });
        }

        await db.query(
            `
            DELETE FROM comments
            WHERE id = ?
            `,
            [id]
        );

        return res.status(200).json({
            message: "Comentário excluído com sucesso"
        });
    } catch (error) {
        console.error("Erro excluindo comentário:", error);

        return res.status(500).json({
            error: "Erro interno do servidor"
        });
    }
};