import axios from "axios";

export const api = axios.create({
    // Endereço compartilhado pelas chamadas de login e materiais.
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api",
    timeout: 10000,
});

export function errorMessage(error: unknown): string {
    // Aproveita a mensagem da API, como senha incorreta ou acesso negado.
    if (axios.isAxiosError(error) && error.response?.data?.message) 
        return error.response.data.message;
    return "Não foi possível conectar à API. Verifique se o back-end está ativo e tente novamente.";
}
