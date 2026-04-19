# Unit Quizzer

Next.js 16.2.3 + React 19 quiz app with shadcn/ui and Tailwind CSS v4.

## Commands
```bash
pnpm dev     # Start Next.js dev server on localhost:3000
pnpm build   # Build to out/ (includes TypeScript check)
pnpm lint    # Run ESLint
pnpm start   # Start production server
```

- No separate typecheck script (TypeScript check is built into `pnpm build`)

## Key Conventions
- **Package manager**: pnpm only
- **Path alias**: `@/*` → `./src/*`
- **Tailwind**: v4 with `@tailwindcss/postcss`, no `tailwind.config.js`
- **shadcn/ui variant**: `radix-nova` (configured in `components.json`)
- **TypeScript**: strict mode, no separate typecheck script
- **Output directory**: `out/` (when static export enabled)

## Directory Structure
```
src/
├── app/           # App Router (page.tsx, layout.tsx, globals.css)
├── components/ui/ # shadcn/ui components
├── lib/           # Utilities (cn, utils)
├── hooks/         # Custom React hooks
├── data/          # JSON quiz data files (statically imported)
└── unit-quizzer/  # Main quiz feature
    ├── components/   # Quiz UI components
    ├── services/   # Business logic
    ├── repos/      # Data repositories
    ├── types/     # TypeScript types
    ├── json-provider/  # JSON data loading/caching
    └── data/       # Quiz JSON files
```

## Current State
- **Static export**: Disabled (`output: "export"` commented out in next.config.ts)
- **Quiz data**: Statically imported via JSON provider
- **Deployment**: Ready for Netlify (netlify.toml verified)
