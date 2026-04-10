# Unit Quizzer

Next.js 16.2.3 + React 19 quiz app with shadcn/ui, Tailwind CSS v4, and Electron packaging.

## Commands
```bash
pnpm dev           # Start Next.js dev server on localhost:3000
pnpm build         # Build Next.js static files to out/ (includes TypeScript check)
pnpm build:electron # Compile electron/*.ts → dist-electron/
pnpm dev:electron  # Run Electron + Next.js dev server concurrently
pnpm dist          # Build + package for all platforms → release/
pnpm dist:win      # Windows portable → release/win-unpacked/
pnpm dist:linux    # Linux portable → release/linux-unpacked/
pnpm lint          # Run ESLint
```

**Build order**: `dist` and `dist:*` commands always run `build` first (Next.js), then `build:electron` (TypeScript). This order matters.

## Key Conventions
- **Package manager**: pnpm only (not npm/yarn)
- **Path alias**: `@/*` → `./src/*`
- **Tailwind**: v4 with `@tailwindcss/postcss`, no `tailwind.config.js`
- **shadcn/ui variant**: `radix-nova`
- **TypeScript**: strict mode, no separate typecheck script (built into `next build`)
- **Fonts**: Offline via @fontsource packages (no network at runtime)
- **Next.js output**: Static export (`output: "export"` in next.config.ts) → `out/` directory

## Directory Structure
```
src/
├── app/           # App Router (page.tsx, layout.tsx, globals.css)
├── components/ui/ # shadcn/ui components
├── components/general/   # Shared components
├── components/quiz/      # Quiz-specific components
├── components/unit-quizzer/  # Main quiz orchestrator
├── lib/           # Utilities (cn, utils)
├── hooks/         # Custom React hooks
├── types/         # TypeScript types
└── data/          # JSON quiz data files (statically imported)
electron/
├── main.ts        # Main process (window, menu, lifecycle)
├── preload.ts     # IPC bridge
└── tsconfig.json
```

## Electron Packaging
- Electron loads `out/` (static export) in production, localhost:3000 in dev
- Build artifacts: `out/` (Next.js) + `dist-electron/` (Electron main process)
- electron-builder packs both into `release/`

## Deployment (Netlify)
- Static export to `out/` directory
- Quiz data is statically imported at build time
- No server-side API routes (fully static)
- Connect GitHub repo → Netlify → auto-deploy on `main` branch push
