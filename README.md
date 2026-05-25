# PartyRoomBloom

![PartyRoomBloom Outline Builder](https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq7sFXn66Qhdeki6VKaqoOupjLYXb4INxMycAl)

## Description

PartyRoomBloom is an app for game masters of tabletop roleplaying games to develop their sessions through scene creation and iteration using generative AI.

## Todo

[x] - buildTree and flattenTree at the API boundary to make frontend intuitive
[x] - atomize state to eliminate unnecessary renders
[x] - React 19 + Next.js 16 upgrade (memoization hooks can now be removed gradually with the compiler)
[x] - Authentication rewrite: replaced deprecated Lucia Auth with custom session management
[x] - Remove unnecessary UUID dependency
[ ] - Migrate from ESLint + Prettier to Biome (formatting is ready; blocked on Next.js-specific lint rules and nursery-status Tailwind class sorting with no tailwind.config.js support)

## Current Status

PartyRoomBloom's core featureset is complete: The Outline Builder, Overview Page, Simulate Assistant, and PDF & JSON backups are all functional.

Outline persistence has been refactored so outline elements are validated at the API boundary, written transactionally, and deleted when omitted from updates.

Featureset expanding to include the use of a (currently public) Express service API that can be found at <https://github.com/BKSchatzki/prb-npc-service> and hosted at <https://prb-npc-service.onrender.com/>. Possibly rolling said separate Express API into the main PartyRoomBloom repo to take advantage of Next.js and Vercel's serverless architecture, whether it will remain public or be internal to PartyRoomBloom is TBD.

## Features

- Outline Builder: Users can create outlines of scenes for social storytelling settings using a proven three-layered information framework.
- Overview Page: Users can quickly reference and manage all information in created scenes.
- Simulate Assistant: Users can walk through a created scene using an AI assistant to spark more creative writing ideas for social storytelling sessions.
- PDF Export: Users can export created scenes to a PDF file for easy print reference.
- JSON Backup & Restore: Users can back up scene data locally to a JSON file, and restore the data to new scenes if they are accidentally deleted in the application.

## Technologies Used

- Node
- React
- Jotai
- Next.js
- Tailwind CSS
- TypeScript
- Neon PostgreSQL
- OpenAI API
- Google OAuth
- Prisma

## Required Services

- Vercel (for ideal deployment)
- OpenAI API (for Simulate Assistant)
- Google Cloud Platform (for OAuth authentication)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/BKSchatzki/partyroombloom.git
   ```

2. Navigate to the project directory:

   ```bash
   cd partyroombloom
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

   Use Node.js 24.x for local development and production parity.

## Configuration

1. Create a `.env.local` file in the root directory
2. Add required environment variables, also found in `.env.example`:

   ```env
   DATABASE_URL="Link to your PostgreSQL instance"
   OPENAI_API_KEY="Your OpenAI API key"
   OPENAI_MODEL="Optional model override, defaults to gpt-4o-mini"
   SITE_URL="Optional canonical site URL, defaults to https://partyroombloom.vercel.app"
   AUTH_GOOGLE_ID="Your Google Client ID"
   AUTH_GOOGLE_SECRET="Your Google Client secret"
   AUTH_GOOGLE_REDIRECT_URI="Your app URL ending in /login/google/callback"
   NEXT_PUBLIC_NPC_SERVICE_URL="Optional NPC service URL"
   ```

## Usage

Run dev server:

```bash
npm run dev
```

Start production server:

```bash
npm start
```

The application will be available at `http://localhost:3000`

Check runtime readiness:

```bash
curl http://localhost:3000/api/health
```

The readiness endpoint checks database connectivity and verifies that required server-side
environment variables are configured. It intentionally reports only counts/statuses, not secret
values.

Smoke-test the built standalone production server:

```bash
npm run smoke:production
```

The smoke test starts `npm start`, waits for `/api/health`, verifies the configured security
headers, and stops the server. It expects the required runtime environment variables and database
connection to be available.

## Build Instructions

To build the project for production:

```bash
npm run build
```

Apply pending database migrations in a staging or production release step:

```bash
npm run db:migrate:deploy
```

Use `npm run db:migrate:status` to inspect pending migrations before a release. Do not use `prisma migrate dev` or `prisma db push` against production data.

Build a production Docker image:

```bash
docker build -t partyroombloom .
```

The Docker image uses Next.js standalone output, runs `node server.js` in production, and uses `/api/health` as its readiness health check. `docker-compose.yaml` targets the development stage for local container development.

## Deployment Checklist

- Vercel Build and Deployment Settings:
  - Framework Settings is set to Next.js defaults:
    - Build Command: `npm run build` or `next build`
    - Output Directory: Next.js default
    - Install Command: `yarn install`, `pnpm install`, `npm install`, or `bun install`
    - Development Command: `next`
  - Root directory field is empty
  - Node.js version is 24.x
- Environment Variables all filled in Vercel Project Settings, especially note:
  - Your PostgreSQL database URL
  - Your OpenAI API key
  - The Client ID and secret in your created application on GCP, found on the same page as the authorized origins and URIs (below)
- Database migrations:
  - Run `npm run db:migrate:deploy` from a release pipeline, deployment job, or controlled shell with the production `DATABASE_URL` set.
  - Run migrations before routing traffic to a build that depends on the new schema.
  - Do not run development-only migration commands against production data.
- Application created in GCP, with OAuth 2.0 Client ID:
  - Authorized JavaScript origins:
    - <http://localhost:3000>
    - The subdomain at <https://project-name.vercel.app>
    - Any domains on which you are hosting the site
  - Authorized redirect URIs should have the following paths for each of the Authorized JavaScript Origins:
    - /login/google/callback

## Contributing

You know the drill:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Contact

- Brendan K. Schatzki
- Email: <bkschatzki@gmail.com>
- Project Link: <https://github.com/BKSchatzki/partyroombloom>
