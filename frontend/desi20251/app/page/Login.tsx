"use client";

import { useState, type FormEvent } from "react";

import { login, type Session } from "../services/login";
import { errorMessage } from "../services/api";

import Home from "./Home";
import Register from "./Register";

export default function Login() {
  // Eventos e estado precisam rodar no navegador.

  // O React atualiza a tela quando o estado muda.
  // A sessão fica na memória: recarregar a página exige outro login.
  const [session, setSession] = useState<Session | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const [showRegister, setShowRegister] = useState(false);
  const [notice, setNotice] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // Evita recarregar a página ao enviar o formulário.
    setBusy(true);
    setError("");
    setNotice("");

    try {
      // A API verifica a senha e devolve o token e o perfil do usuário.
      const result = await login(email, password);

      setSession(result);
      setPassword("");
    } catch (error) {
      // HTTP 429 = limite de tentativas de login atingido.
      if (
        error &&
        typeof error === "object" &&
        "response" in error
      ) {
        const response = (
          error as {
            response?: {
              status?: number;
              data?: {
                retryAfter?: number;
              };
            };
          }
        ).response;

        if (response?.status === 429) {
          const retryAfter =
            response.data?.retryAfter ?? 900;

          const minutes = Math.ceil(
            retryAfter / 60
          );

          setError(
            `Muitas tentativas de login. Tente novamente em ${minutes} ${minutes === 1
              ? "minuto"
              : "minutos"
            }.`
          );

          return;
        }
      }

      setError(errorMessage(error));
    } finally {
      // Libera o formulário mesmo quando ocorre um erro.
      setBusy(false);
    }
  }

  return (
    <main>
      <header>
        Controle de materiais · Aula de login e permissões
      </header>

      {/* Sem sessão mostramos o login; com sessão mostramos os materiais. */}
      {session ? (
        <Home
          session={session}
          onLogout={() => {
            setSession(null);
            setEmail("");
            setPassword("");
          }}
        />
      ) : showRegister ? (
        <Register
          onBack={() => setShowRegister(false)}
          onRegistered={(message) => {
            setShowRegister(false);
            setNotice(message);
          }}
        />
      ) : (
        <section
          className="panel"
          aria-labelledby="login-title"
        >
          <h1 id="login-title">Entrar</h1>

          <p>
            Digite o e-mail e a senha da sua conta.
          </p>

          {notice && (
            <p
              className="success"
              role="status"
            >
              {notice}
            </p>
          )}

          {/* As credenciais são digitadas pelo aluno; os dados e o perfil vêm da API. */}
          <form onSubmit={submit}>
            <label htmlFor="email">
              E-mail
            </label>

            <input
              id="email"
              type="email"
              autoComplete="username"
              required
              disabled={busy}
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
            />

            <label htmlFor="password">
              Senha
            </label>

            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={busy}
              value={password}
              onChange={(event) =>
                setPassword(
                  event.target.value
                )
              }
            />

            {error && (
              <p
                role="alert"
                className="error"
              >
                {error}
              </p>
            )}

            <button
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Entrando..."
                : "Entrar"}
            </button>

            {/* Troca a tela sem recarregar a página. */}
            <button
              type="button"
              className="secondary"
              disabled={busy}
              onClick={() => {
                setError("");
                setNotice("");
                setEmail("");
                setPassword("");
                setShowRegister(true);
              }}
            >
              Cadastrar usuário
            </button>
          </form>
        </section>
      )}
    </main>
  );
}