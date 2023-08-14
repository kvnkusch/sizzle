# Sizzle

## Get Cooking on your Next Project with Sizzle

<!-- TODO: Mention SPAs + API (e.g. many SaaS apps) as target -->

Sizzle is a monorepo template for building fullstack Javascript applications (React frontend and Node backend). If you want to build an app with the technologies listed below while staring with out-of-the-box answers for useful and annoying to setup project capabilities, Sizzle might be for you.

#### Technologies

- Typescript
- tRPC
- React
- Tailwind
- Fastify
- DrizzleORM

#### Capabilities

I've found the following are very useful in mature projects, can become more difficult to set up over time, and are easy to keep putting off. As a result Sizzle has answers for all of the following right out of the gate.

- Database
  - Uses Docker to enable both local development and ephemeral deployed environments
  - Commands and configuration for starting/stopping, migrations, etc.
  - Maintain and grow a set of seed data for testing, development
- Monorepo configuration with Nx
  - Apps / libs to enable seamless with (e.g. tRPC, Tailwind, Drizzle)
  - Using latest and greatest build tools (Vite / esbuild)
  - CI/CD (TODO)
  - Custom generators (TODO)

## Getting Started

#### Running Locally

1. Clone this repository
2. Create local environment variables: `cp ./apps/server/.env.sample ./apps/server/.env.local && cp ./apps/web/.env.sample ./apps/web/.env.local`
3. Setup database
   1. Build image / start container: `docker compose up -d`
   2. Run migrations: `yarn db:migrations:run`
   3. Seed data: `yarn db:seed`
4. Start server `yarn nx serve server`
5. Start web app `yarn nx serve web`

#### Make It Your Own

1. Copy the repository
2. Search and replace "sizzle" in file contents and names with your chosen project name.
3. Database cleanup
   1. If you followed the steps in "Running Locally", then: `yarn db:clear`
   2. Delete existing migrations: `rm -rf ./libs/db/schema/src/lib/migrations/`
   3. Generate new migrations after creating your own entities: `yarn db:migrations:generate`
4. Get cooking!

## Possible Future Enhancements

The following are enhancements that may be added alongside current apps in this monorepo, or might turn into totally separate templates.

- Different web frameworks / React alternatives (e.g. Solid, Svelte, Vue, Angular, etc.)
- Mobile app (specifically with React Native)
- Non-javascript backend
  - Server / Client API contract via OpenAPI or GraphQL
- Different databases
  - Specifically different categories of database - substituting MySQL for PostgreSQL after copying this template should not be too involved, but the setup for things like Redis, MongoDB, etc. is likely different enough to warrant inclusion at some point
- CLI for generating new projects

[See also TODOs](./TODO.md). Open to further suggestions here, please open an issue!

## Won't Do

- Server-side Rendering: Great tools already exist to get started with SSR frameworks. However, there are many use cases that reap real benefits from being a web app, but do not not from SSR. Sizzle targets these use cases.
- Authentication: Similarly, great tools and products already exist for managing authentication in greenfield projects, but in many cases developers will be plugging into an existing authentication system even when starting a new app. For this reason I've chosen to leave authentication out entirely
