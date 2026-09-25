---
max_turns: 8
timeout_seconds: 180
allowed_tools: [Skill, Read, Glob, Grep]
runs: 3
---

This function should return the average, but average([]) crashes and average([2, 4]) returns 2. Fix it and explain the bug in one sentence.

```python
def average(xs):
    total = 0
    for x in xs:
        total = x
    return total / len(xs)
```
