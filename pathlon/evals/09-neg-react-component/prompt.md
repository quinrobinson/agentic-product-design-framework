---
max_turns: 8
timeout_seconds: 180
allowed_tools: [Skill, Read, Glob, Grep]
runs: 3
---

Add a `loading` boolean prop to this React button: when true, disable the button and show "Loading…" instead of the children.

```jsx
export function Button({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}
```
