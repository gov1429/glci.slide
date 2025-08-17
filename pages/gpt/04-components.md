---
title: "GitLab CI/CD Components"
---

# What are Components?
- Reusable, versioned CI pieces published as **components** (CI/CD Catalog).
- They present an **input-driven interface** (`inputs:`), encapsulating complexity.
- Use via `include: component: 'name'` with `input:` to customize.

---
## Benefits
- Encapsulation & consistency across projects
- Versioning and discoverability
- Encourages best practices and reduces duplication

---
## Anatomy (example)
```yaml
spec:
  inputs:
    image_name:
      type: string
      default: "my-app"
---
build-image:
  script:
    - docker build -t $[[ inputs.image_name ]]:$CI_COMMIT_SHA .
```

---
## Tips
- Keep components small and focused (one concern per component).
- Use hidden jobs (`.template`) inside components for reuse.
- Inputs are static defaults — cannot be computed from other inputs.
