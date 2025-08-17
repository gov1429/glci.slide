---
title: "Workflows, Rules, and Includes"
---

# workflow
- Controls whether the pipeline runs at all.
- Evaluated once per pipeline start.
```yaml
workflow:
  rules:
    - if: '$CI_COMMIT_BRANCH == "main"'
      when: always
    - when: never
```

---
# rules (job-level)
- Replace `only/except`; more powerful.
- Example:
```yaml
job:
  script: echo hi
  rules:
    - if: '$CI_COMMIT_BRANCH == "dev"'
      when: always
    - if: '$CI_PIPELINE_SOURCE == "merge_request_event"'
      when: manual
    - when: never
```

---
# include
- `local`, `file`, `project`, `remote`, `component`.
- Best for sharing templates and components.
- `component` (CI/CD Catalog) provides `inputs:` and a cleaner interface.

---
# Best practices
- Put `workflow` in one place (root or shared include) — only one `workflow` allowed.
- Use `rules` for fine-grained control and for MR pipelines.
- Use `include` to keep root `.gitlab-ci.yml` small and readable.
