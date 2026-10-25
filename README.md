# LookOver

LookOver is a personal AI-powered GitHub pull request reviewer. Connect a repository, send a pull request for review, and get feedback about bugs, security risks, performance, and maintainability.

## What it uses

- Next.js 16, React, TypeScript, and Tailwind CSS
- shadcn/ui for the interface
- Better Auth for authentication
- Prisma with PostgreSQL/Neon
- tRPC and TanStack Query
- Inngest for background jobs
- OpenAI for code reviews
- GitHub API and webhooks
- Vercel for the current deployment

Docker, Docker Compose, and Caddy are also kept in the repository for self-hosting later. I have not set that up yet but I will probably run it on an Oracle Cloud VPS: point a domain to the server, run the app with Docker Compose and let Caddy handle HTTPS. I will add the full steps after trying it myself.

## Run locally

You will need Node.js 20+, pnpm, a PostgreSQL database, GitHub OAuth credentials, an OpenAI API key, and Inngest keys.

```bash
pnpm install
cp .env.example .env
pnpm auth:secret
pnpm db:push
pnpm dev
```

On Windows PowerShell, copy the environment file with:

```powershell
Copy-Item .env.example .env
```

Add your credentials to `.env`. For local GitHub OAuth, use:

```text
Homepage URL: http://localhost:3000
Callback URL: http://localhost:3000/api/auth/callback/github
```

Then open <http://localhost:3000>.

Useful checks:

```bash
pnpm lint
pnpm build
```

## Deploy with Vercel

1. Push the repository to GitHub and import it into Vercel.
2. Add the variables from `.env.example` in Vercel project settings.
3. Deploy the project.
4. Update `APP_DOMAIN`, `BETTER_AUTH_URL`, and `NEXT_PUBLIC_APP_URL` with the Vercel URL.
5. Add the production GitHub OAuth callback:

   ```text
   https://your-project.vercel.app/api/auth/callback/github
   ```

6. Configure the GitHub webhook and Inngest endpoint using the same Vercel URL:

   ```text
   https://your-project.vercel.app/api/webhooks/github
   https://your-project.vercel.app/api/inngest
   ```

Never commit `.env` or real credentials.

## Project structure

```text
src/app/          Pages and API routes
src/components/   Shared UI components
src/lib/          Client helpers and tRPC setup
src/server/       Auth, database, services, and background jobs
prisma/           Database schema
deploy/           Files reserved for future self-hosting
```
