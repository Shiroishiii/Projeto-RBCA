# Aula: cadastro, login e controle de acesso

Projeto com Next.js, React e TypeScript no front-end e Express com MySQL no back-end.

## Preparação

1. Configure e inicie o back-end seguindo [backend/README.md](backend/README.md).
2. Prepare a tabela de usuários com `backend/sql/users.sql` no banco configurado. Mantenha a tabela de materiais usada na aula.
3. Na pasta `frontend/desi20251`, execute `npm install` e `npm run dev`.
4. Abra http://localhost:3000, clique em **Cadastrar usuário** e crie uma conta com seus próprios dados.
5. Faça login para consultar os materiais. Para testar administrador, siga a alteração de perfil no banco descrita no README do back-end.

No Windows, use `npm.cmd` se o PowerShell bloquear `npm.ps1`.

## Conceitos da aula

- Cadastro: a API valida os dados e salva a senha com hash bcrypt.
- Autenticação: o login verifica a senha e retorna um token JWT.
- Autorização: o middleware verifica o token e o perfil antes de permitir a operação.
- `user` consulta materiais; `admin` também pode excluir.
- O cadastro público sempre cria `user`. O perfil não é escolhido pelo formulário.
- A sessão fica na memória do front-end; recarregar a página exige outro login.

Os arquivos de cadastro são `backend/src/controllers/register.js`, `frontend/desi20251/app/services/register.ts` e `frontend/desi20251/app/page/Register.tsx`. Eles possuem comentários para acompanhar o fluxo.

Consulte o [roteiro do front-end](frontend/desi20251/README.md) para a atividade completa.

## Verificação

No back-end, execute `npm test`. No front-end, execute `npm run lint` e `npm run build`. Os testes HTTP usam banco simulado; a integração com MySQL precisa do banco configurado.
