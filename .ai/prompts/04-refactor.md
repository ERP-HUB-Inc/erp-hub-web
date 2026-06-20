# Prompt: Refactor

Use this when asking an AI agent to refactor code.

```txt
Refactor this frontend code without changing behavior.

Goal:
<describe why refactor is needed>

Constraints:
- Follow AGENTS.md.
- Do not change UI behavior.
- Do not change API contracts.
- Do not make unrelated changes.
- Keep code easier to read and maintain.

After finishing, summarize:
- What was simplified
- What behavior should stay the same
- How to test that nothing broke
```
```
