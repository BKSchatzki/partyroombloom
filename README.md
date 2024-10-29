# PartyRoomBloom

PartyRoomBloom is an app for game masters of tabletop roleplaying games to develop their sessions through scene creation and iteration using generative AI.

## TODO

### Simulate UI

[ ] Scene schema redefinition
[x] Return structure
[ ] Prompt tweaks
[x] Structured UI
[ ] Persistent conversation in local storage
[x] (maybe) Stateful pages vs. carousel

### Outline UI

[ ] Depth vs. breadth UI

### Database Considerations

- Each scene should refer to many outlines and simulations
- Each outline should refer to many simulations
- Each outline and simulation should have a version column for ordering
- Outline layers should be titled "landmarks", "interactables", and "secrets"
- Consider extra detail columns in the outline
- Simulations should have a summary column
- Outlines and simulations should have columns for items, creatures (D&D meaning), etc.

[ ] Set up Drizzle
[ ] Set up auth with Google and connect to Drizzle
[ ] Test queries with docker postgres
[ ] Hook up Drizzle to Next.js
[ ] Create Outline experience
[ ] Connect Outline to Drizzle
[ ] Connect Outline experience to Simulate experience
[ ] Allow local storage and json downloads/restores for unlogged users
[ ] Implement rate limits for unlogged users
[ ] Donate button
[ ] Landing page

### Overview UI

## Default Readme Notes for create-next-app

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

### Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
