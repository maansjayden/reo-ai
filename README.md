# REO AI Productivity Assistant

A centralized SaaS application featuring a suite of AI powered tools designed to streamline professional workflows, automate repetitive tasks, and boost daily efficiency. REO runs as a modern full-stack React application on TanStack Start with server functions for secure AI generation through the Lovable AI Gateway.

## Live Links

* **Lovable Project:** https://lovable.dev/projects/32384168-c52e-448e-872c-94631c4d8ae1
* **GitHub Repository:** https://github.com/maansjayden/reo-ai
* **Live Application:** https://reo-ai.lovable.app

## Core Features

| Tool | Description |
| ---- | ----------- |
| **Smart Email Generator** | Instantly draft professional communications tailored by recipient, context, and tone. |
| **Meeting Notes Summarizer** | Extract action items, decisions, and deadlines from raw transcripts using local parsing. |
| **AI Task Planner** | Dynamic Kanban board for scheduling and task prioritization across To Do, In Progress, and Done. |
| **AI Research Assistant** | Synthesize complex topics into exactly four concise, professional bullet points via AI generation. |
| **AI Chatbot Interface** | Interactive workplace assistant that handles daily prompts and queries with local keyword logic. |

## Technical Stack

* **Framework:** [TanStack Start](https://tanstack.com/start) — full-stack React framework with file-based routing and server functions.
* **Build Tool:** [Vite 8](https://vitejs.dev/)
* **UI Library:** [React 19](https://react.dev/)
* **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) with CSS-first configuration in `src/styles.css`.
* **Components:** [Radix UI](https://www.radix-ui.com/) primitives + custom shadcn/ui-inspired components in `src/components/ui/`.
* **State Management:** React hooks and local component state.
* **Data Fetching:** `@tanstack/react-query` wired through the router context.
* **Icons:** [Lucide React](https://lucide.dev/)
* **Validation:** [Zod](https://zod.dev/)
* **AI Provider:** Lovable AI Gateway (`https://ai.gateway.lovable.dev/v1`) using the `ai` SDK with an OpenAI-compatible provider.
* **Language:** TypeScript 5 with strict mode enabled.
* **Package Manager:** Bun (`bun.lock` / `bunfig.toml`)

## Project Structure

```text
.
├── .lovable/                  # Lovable platform configuration
├── public/                    # Static assets (favicon, images, etc.)
├── src/
│   ├── components/
│   │   └── ui/                # Reusable shadcn/ui-style components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── textarea.tsx
│   │       └── ...            # (accordion, dialog, tabs, etc.)
│   ├── hooks/
│   │   └── use-mobile.tsx     # Responsive / mobile detection hook
│   ├── lib/
│   │   ├── ai-gateway.server.ts    # OpenAI-compatible provider factory for Lovable AI Gateway
│   │   ├── email.functions.ts      # Server function: generate professional emails
│   │   ├── research.functions.ts   # Server function: synthesize research topics
│   │   ├── error-capture.ts        # Client-side error capture utilities
│   │   ├── error-page.ts           # Error page helpers
│   │   ├── lovable-error-reporting.ts  # Lovable error reporting integration
│   │   └── utils.ts                # Tailwind class merging and shared helpers
│   ├── routes/                # TanStack Start file-based routes
│   │   ├── __root.tsx         # Root layout, head metadata, error & not-found boundaries
│   │   ├── index.tsx          # Home page / dashboard with all five productivity tools
│   │   └── README.md          # Routing conventions for this project
│   ├── routeTree.gen.ts       # Auto-generated route tree (do not edit manually)
│   ├── router.tsx             # Router configuration and provider setup
│   ├── server.ts              # SSR server entry wrapper
│   ├── start.ts               # Start handler / server function middleware
│   └── styles.css             # Tailwind v4 theme, design tokens, and global styles
├── AGENTS.md                  # Agent-specific project instructions
├── README.md                  # This file
├── bunfig.toml                # Bun configuration
├── components.json            # shadcn/ui component registry config
├── eslint.config.js           # ESLint configuration
├── package.json               # Dependencies and npm/bun scripts
├── tsconfig.json              # TypeScript configuration
└── vite.config.ts             # Vite + TanStack Start configuration
```

## Architecture Overview

REO is a single-page dashboard application served from the root route (`/`). All five productivity tools live in `src/routes/index.tsx` as separate React components rendered conditionally based on sidebar navigation state.

### Routing

TanStack Start uses file-based routing under `src/routes/`:

| File | Route | Purpose |
| ---- | ----- | ------- |
| `__root.tsx` | `/*` | Root layout, global `<head>` metadata, error boundaries, and providers. |
| `index.tsx` | `/` | Main dashboard containing Email, Meeting, Task, Research, and Chat tools. |

`src/routeTree.gen.ts` is auto-generated by the TanStack Router Vite plugin. Do not edit it by hand.

### Server Functions

AI-powered features call `createServerFn` from `@tanstack/react-start`:

* `src/lib/email.functions.ts` — `generateEmail` validates recipient/subject/tone/context and streams a prompt to `openai/gpt-5.5`.
* `src/lib/research.functions.ts` — `researchTopic` validates a topic and returns four synthesized bullet points.

Both functions use `src/lib/ai-gateway.server.ts` to create an OpenAI-compatible provider pointing at the Lovable AI Gateway. The `LOVABLE_API_KEY` environment variable is read inside the handler bodies so it is never exposed to the browser bundle.

### Local vs. AI Logic

* **Email Generator** and **Research Assistant** use server-side AI generation.
* **Meeting Summarizer** uses local regex-based parsing over the pasted transcript.
* **Task Planner** is fully client-side state.
* **Chatbot** uses local keyword matching (`help`, `email`, `schedule`, `meeting`, `summarize`) and falls back to a polite productivity pivot for general knowledge questions.

## Setup Instructions

### Prerequisites

* [Bun](https://bun.sh/) (recommended) or Node.js 20+ with `npm`.
* A Lovable project with the AI Gateway enabled and a `LOVABLE_API_KEY` secret configured.

### Install Dependencies

```bash
bun install
```

> If you prefer npm, run `npm install` instead. Note that the lockfile is `bun.lock`.

### Environment Variables

Create a `.env` file in the project root with the following variable:

```bash
LOVABLE_API_KEY=your_lovable_api_key_here
```

This key is required for the Email Generator and Research Assistant to call the Lovable AI Gateway. The chatbot and meeting summarizer work without any API key.

### Start the Development Server

```bash
bun run dev
```

The dev server will start on `http://localhost:8080` by default.

### Build for Production

```bash
bun run build
```

To preview the production build locally:

```bash
bun run preview
```

## Available Scripts

| Script | Command | Description |
| ------ | ------- | ----------- |
| `dev` | `vite dev` | Start the local development server with HMR. |
| `build` | `vite build` | Build the application for production. |
| `build:dev` | `vite build --mode development` | Build in development mode for debugging. |
| `preview` | `vite preview` | Preview the production build locally. |
| `lint` | `eslint .` | Run ESLint across the project. |
| `format` | `prettier --write .` | Format all supported files with Prettier. |

## Key Files Explained

### `src/routes/index.tsx`

The main dashboard. Defines the responsive sidebar navigation and renders the active tool:

* `EmailGenerator` — form + server-generated email draft with copy/edit support.
* `MeetingSummarizer` — transcript input + editable decisions/action items.
* `TaskPlanner` — Kanban board with add/move/delete/edit task cards.
* `ResearchAssistant` — topic search form + AI-generated editable insights.
* `Chatbot` — local conversational assistant with auto-scroll and editable bubbles.

Shared UI primitives (`Card`, `Label`, `Input`, `Textarea`, `Select`, `Button`, `CopyButton`, `EditableList`) are also defined here for the dashboard.

### `src/styles.css`

Tailwind CSS v4 configuration file. Contains:

* `@import "tailwindcss"` and `@source` directives.
* Custom `@theme inline` color mappings to CSS variables.
* A dark, slate + indigo color palette applied globally.
* `@utility scrollbar-thin` for a minimal dark-themed scrollbar.

The app always renders in dark mode via the `.dark` class on the root element.

### `src/lib/ai-gateway.server.ts`

Factory that returns an OpenAI-compatible provider configured for the Lovable AI Gateway. Used by server functions to call models such as `openai/gpt-5.5`.

### `src/routes/__root.tsx`

Root route that provides:

* Global `<head>` metadata (title, description, Open Graph, Twitter cards, favicon).
* `QueryClientProvider` from `@tanstack/react-query`.
* 404 and error boundary components.
* The `shellComponent` that renders the full HTML shell.

## Design System

* **Theme:** Dark mode only, slate backgrounds with indigo primary accents.
* **Tokens:** CSS custom properties in `src/styles.css` (`--background`, `--foreground`, `--primary`, etc.).
* **Radius:** `0.75rem` base border radius.
* **Typography:** System sans-serif stack.
* **Shadows:** Subtle card shadows using `oklch` color mixing.

## Responsible AI Practices

This application incorporates a prominent user disclaimer regarding AI limitations, features fully editable outputs to ensure human validation, and is designed to process tasks without storing sensitive user data permanently. Always review AI-generated content before sending or acting on it.

## License

This project is maintained as a private Lovable project. Refer to the repository or Lovable project settings for licensing details.
