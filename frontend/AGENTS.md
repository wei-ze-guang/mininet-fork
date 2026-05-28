<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Frontend Development Workflow

- Use `pnpm` for this frontend project. On this Mac, prefer:
  `PATH=/Users/macbook/.nvm/versions/node/v22.20.0/bin:$PATH pnpm <command>`
- During normal component/page development, prefer hot development feedback instead of running a full production build after every change.
- Use Storybook hot dev for isolated UI components:
  `pnpm exec storybook dev --host 127.0.0.1 --port 6006`
- Use Next.js hot dev for app-level integration:
  `pnpm exec next dev --hostname 127.0.0.1 --port 3001`
- For routine edits, run targeted checks such as `pnpm lint` when useful. Do not run `pnpm build` or `pnpm build-storybook` after every small component change.
- Run full builds only when preparing a handoff, before deployment, after dependency/config changes, or when the user explicitly asks for a build-level verification.
