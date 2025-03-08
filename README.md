# PartyRoomBloom

![PartyRoomBloom Outline Builder](https://cmt76lyntq.ufs.sh/f/uvtHsYCzVSYq7sFXn66Qhdeki6VKaqoOupjLYXb4INxMycAl)

## Description

PartyRoomBloom is an app for game masters of tabletop roleplaying games to develop their sessions through scene creation and iteration using generative AI.

## Current Status

PartyRoomBloom's core featureset is complete: The Outline Builder, Overview Page, Simulate Assistant, and PDF & JSON backups are all functional.

Currently troubleshooting saved elements not being properly deleted when outline is updated. Possible solutions are frontend delete handler calling DELETE controller on new /element route, or restructuring of Outline state to include deleted flags for elements and modifying PUT controller on outline/[outlineId]. Latter solution likely to be developed with general refactoring of Outline state logic to isolate outline properties atomically to allow for memoization of handler functions and derived values (optimization logic already implemented).

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
- Lucia Auth
- Next.js

## Required Services

- Vercel (for ideal deployment)
- OpenAI API (for Simulate Assistant)
- Google Cloud Platform (for authentication using Lucia Auth)

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

## Configuration

1. Create a `.env` file in the root directory
2. Add required environment variables, also found in `.env.example`:

   ```env
   DATABASE_URL="Link to your PostgreSQL instance"
   OPENAI_URI="https://api.openai.com/v1/chat/completions"
   OPENAI_API_KEY="Your OpenAPI key"
   AUTH_GOOGLE_ID="Your Google Client ID"
   AUTH_GOOGLE_SECRET="Your Google Client secret"
   AUTH_GOOGLE_REDIRECT_URI="http://localhost:3000/login/google/callback"
   NEXT_PUBLIC_NPC_SERVICE_URL="Currently under construction, will possibly be moved into this repo"
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

## Build Instructions

To build the project for production:

```bash
npm run build
```

## Deployment Checklist

- Vercel Build and Deployment Settings:
  - Framework Settings is set to Next.js defaults:
    - Build Command: `npm run build` or `next build`
    - Output Directory: Next.js default
    - Install Command: `yarn install`, `pnpm install`, `npm install`, or `bun install`
    - Development Command: `next`
  - Root directory field is empty
  - Node.js version is 20.x
- Environment Variables all filled in Vercel Project Settings, especially note:
  - Your PostgreSQL database URL
  - Your OpenAI API key
  - The Client ID and secret in your created application on GCP, found on the same page as the authorized origins and URIs (below)
- Application created in GCP, with OAuth 2.0 Client ID:
  - Authorized JavaScript origins:
    - <http://localhost:3000>
    - The subdomain at <https://project-name.vercel.app>
    - Any domains on which you are hosting the site
  - Authorized redirect URIs should have the following paths for each of the Authorized JavaScript Origins:
    - /api/auth/callback/google
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
