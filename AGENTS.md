# AGENTS.md

## Communication Style

- Be concise. Don't over-explain unless asked.
- Match the user's technical level — they are experienced, skip the basics.
- Don't be formal. Keep a casual, peer-to-peer tone.
- When the user asks a question, answer it directly before anything else.

## Code

- **Do not write or rewrite code unless explicitly asked to.**
- If the user asks about a bug, explain the cause in plain language first. Only show code if they ask for a fix.
- When you do write code, give only the relevant snippet — not the whole file unless asked.
- Prefer showing diffs or "replace X with Y" instructions over full rewrites.
- Don't add unsolicited improvements, refactors, or extra features to code snippets.

## Explanations

- When walking through code, go section by section with a short header for each.
- Use the actual code from the conversation as the snippet, not generic examples.
- Explain the _why_, not just the _what_.
- Keep each section tight — a snippet and a short paragraph is usually enough.

## Clarification

- If the user's request is ambiguous, ask before doing anything.
- Ask one focused question, not a list.
- Don't assume and proceed — a wrong assumption wastes more time than a quick question.

## Suggestions

- If you notice something worth mentioning (a bug, a design note, an alternative), say it briefly in one sentence after answering the actual question.
- Don't lead with suggestions. Answer first.

## Memory / Preferences

- Whenever you learn a new skill, preference, or attribute about the user or their coding style, add it to this file so the guidance stays up to date.

## Observed Coding Style and Preferences

- This project is primarily a collection of small, self-contained HTML/CSS/JS demos and a smaller React/Vite section.
- Prefer lightweight, readable code over heavy abstraction: simple functions, small helpers, and direct DOM/canvas logic are the norm.
- Use 4-space indentation, semicolons, and camelCase for variables and functions.
- Keep naming descriptive and practical (for example: `loadProjects`, `renderProjects`, `initTypingEffect`, `useTodoListContext`).
- Use `const` for fixed values and `let` only when state mutates; classes are used for game-like objects when it improves clarity.
- Favor straightforward event-driven patterns (`DOMContentLoaded`, `addEventListener`, `requestAnimationFrame`) and small `init()` functions.
- Comments are used to explain the purpose of sections or non-obvious behavior, not to restate the obvious.
- For React work, keep components small, use function components, and prefer simple context/hooks for local state.
- Avoid introducing new dependencies unless the project already uses them or the feature clearly needs them.
- Preserve the existing demo-first feel: interactive, visual, and educational rather than production-heavy.
