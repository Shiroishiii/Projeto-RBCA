import { api } from "./api";

export type Comment = {
    id: number;
    text: string;
    material_id: number;
    created_at: string;
    user_id: number;
    user_name: string;
};

export async function createComment(
    text: string,
    material_id: number,
    token: string
) {
    const response = await api.post(
        "/comments",
        {
            text,
            material_id,
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function getComments(token: string) {
    const response = await api.get("/comments", {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data as Comment[];
}

export async function getCommentById(id: number, token: string) {
    const response = await api.get(`/comments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data as Comment;
}

export async function getCommentsByMaterial(
    materialId: number,
    token: string
) {
    const response = await api.get(
        `/comments/material/${materialId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data as Comment[];
}

export async function updateComment(
    id: number,
    text: string,
    token: string
) {
    const response = await api.put(
        `/comments/${id}`,
        { text },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data;
}

export async function deleteComment(
    id: number,
    token: string
) {
    const response = await api.delete(`/comments/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}