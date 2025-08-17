---
title: "Writing .gitlab-ci.yml — Syntax & Patterns"
---

# Minimal Pipeline Example
```yaml
stages:
  - build
  - test

build-job:
  stage: build
  script:
    - echo "build"
  artifacts:
    paths: [dist/]

test-job:
  stage: test
  script:
    - echo "test"
    - npm test
  needs: ["build-job"]
```

---
## Strategies & Tips
- Prefer `stages` or use `needs` for DAG pipelines.
- Use `artifacts` to pass files (including `.git`) between jobs.
- Keep secrets in CI/CD variables (group/project level).
- Use `GIT_STRATEGY` / `GIT_CHECKOUT` carefully when modifying repo in CI.

---
## Common Keywords
- `workflow` — global gate for whole pipeline.
- `rules` — when and how a job runs.
- `include` — import reusable YAML (local or remote).
- `extends` — reuse job templates (hidden jobs starting with `.`).
