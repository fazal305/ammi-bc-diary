# Contributing

Thanks for wanting to help with Ammi Ki BC Diary.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

Before opening a pull request, run the same checks CI runs:

```bash
npm run lint
npm test
npm run build
```

## Things to keep in mind

- **Urdu first.** Every piece of on-screen text is Urdu, written simply. If you
  add a screen or message, keep the wording short and plain.
- **Large and clear.** Body text stays at 24px or larger and buttons stay big
  enough to press comfortably. Check at 375px wide with no sideways scrolling.
- **Offline.** Nothing may depend on a server. Data stays in `localStorage`
  (see `src/state/storage.js`).
- **Accessible.** Keep labelled fields, visible focus and the
  `prefers-reduced-motion` behaviour of the draw animation working.

## Pull requests

- Keep changes focused; one topic per pull request.
- Describe what changed and how you tested it (browser and screen size).
- Never include real people's names or phone numbers in issues, tests or
  screenshots.

By contributing you agree that your work is released under the MIT License and
that you will follow the [Code of Conduct](CODE_OF_CONDUCT.md).
