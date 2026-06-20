# Prompt: Test Generation

Use this when asking an AI agent to add tests.

```txt
Add tests for this frontend behavior:
<describe behavior>

Important cases:
- Success case
- Error case
- Empty/loading state if relevant
- Permission case if relevant
- Date/time edge cases if relevant

Constraints:
- Follow existing test framework and style.
- Do not rewrite unrelated tests.
- Test user behavior, not internal implementation.

After finishing, summarize test cases added.
```
```
