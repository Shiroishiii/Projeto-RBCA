"use client";

import {
    useEffect,
    useState,
    type FormEvent,
} from "react";

import { api, errorMessage } from "../services/api";
import { Comment } from "../services/comments";

type Props = {
    materialId: number;
    token: string;
};

export default function Comments({
    materialId,
    token,
}: Props) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [content, setContent] = useState("");

    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [deleting, setDeleting] = useState<number | null>(null);

    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    async function loadComments() {
        try {
            setError("");

            const response = await api.get<Comment[]>(
                `/comments/material/${materialId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments(response.data);
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadComments();
    }, [materialId, token]);

    async function submit(
        event: FormEvent<HTMLFormElement>
    ) {
        event.preventDefault();

        setError("");
        setNotice("");

        const comment = content.trim();

        if (comment.length < 1) {
            setError("Digite um comentário.");
            return;
        }

        if (comment.length > 500) {
            setError(
                "O comentário deve possuir no máximo 500 caracteres."
            );
            return;
        }

        setSending(true);

        try {
            await api.post(
                "/comments",
                {
                    text: comment,
                    material_id: materialId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setContent("");
            setNotice(
                "Comentário adicionado com sucesso."
            );

            await loadComments();
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setSending(false);
        }
    }

    async function handleDelete(commentId: number) {
        const confirmed = window.confirm(
            "Tem certeza que deseja excluir este comentário?"
        );

        if (!confirmed) {
            return;
        }

        setError("");
        setNotice("");
        setDeleting(commentId);

        try {
            await api.delete(
                `/comments/${commentId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setComments((currentComments) =>
                currentComments.filter(
                    (comment) =>
                        comment.id !== commentId
                )
            );

            setNotice(
                "Comentário excluído com sucesso."
            );
        } catch (error) {
            setError(errorMessage(error));
        } finally {
            setDeleting(null);
        }
    }

    function formatDate(date: string) {
        return new Date(date).toLocaleString(
            "pt-BR",
            {
                dateStyle: "short",
                timeStyle: "short",
            }
        );
    }

    function getInitial(name: string) {
        return (
            name.trim().charAt(0).toUpperCase() ||
            "?"
        );
    }

    return (
        <section className="comments">
            <header className="comments-header">
                <div>
                    <h3>Comentários</h3>

                    <span>
                        {comments.length}{" "}
                        {comments.length === 1
                            ? "comentário"
                            : "comentários"}
                    </span>
                </div>
            </header>

            <form
                className="comment-form"
                onSubmit={submit}
            >
                <label
                    htmlFor={`comment-${materialId}`}
                >
                    Deixe seu comentário
                </label>

                <textarea
                    id={`comment-${materialId}`}
                    value={content}
                    onChange={(event) =>
                        setContent(event.target.value)
                    }
                    placeholder="Escreva um comentário..."
                    maxLength={500}
                    disabled={sending}
                    rows={4}
                />

                <div className="comment-form-footer">
                    <small>
                        {content.length}/500
                    </small>

                    <button
                        type="submit"
                        disabled={
                            sending ||
                            !content.trim()
                        }
                    >
                        {sending
                            ? "Enviando..."
                            : "Comentar"}
                    </button>
                </div>
            </form>

            {error && (
                <p
                    className="comment-error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {notice && (
                <p
                    className="comment-success"
                    role="status"
                >
                    {notice}
                </p>
            )}

            <div className="comments-list">
                <div className="comments-list-header">
                    <h4>
                        Comentários publicados
                    </h4>
                </div>

                {loading ? (
                    <p className="comments-status">
                        Carregando comentários...
                    </p>
                ) : comments.length === 0 ? (
                    <p className="comments-status">
                        Nenhum comentário ainda.
                    </p>
                ) : (
                    <ul>
                        {comments.map((comment) => (
                            <li
                                key={comment.id}
                                className="comment-item"
                            >

                                <div className="comment-content">
                                    <div className="comment-header">
                                        <div>
                                            <strong>
                                                {
                                                    comment.user_name
                                                }
                                            </strong>

                                            <time>
                                                {formatDate(
                                                    comment.created_at
                                                )}
                                            </time>
                                        </div>

                                        <button
                                            type="button"
                                            className="comment-delete"
                                            onClick={() =>
                                                handleDelete(
                                                    comment.id
                                                )
                                            }
                                            disabled={
                                                deleting ===
                                                comment.id
                                            }
                                        >
                                            {deleting ===
                                                comment.id
                                                ? "Excluindo..."
                                                : "Excluir"}
                                        </button>
                                    </div>

                                    <p className="comment-text">
                                        {comment.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}