---
# layout: section
transition: zoom
---

# Keywords: Rules

**Rules** control when a job runs.

- Conditional execution based on variables, branches, etc.
- Replaces older `only/except`.

Example:

```yaml {|1-2|3-6}
deploy-job:
  stage: deploy
  script: echo "Deploying..."
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: always
```

---

# Keywords: Workflows

**Workflows** define pipeline-level rules.

- Control entire pipeline execution.
- e.g., Auto-cancel redundant pipelines.

Example:

```yaml
workflow:
  rules:
    - if: $CI_COMMIT_REF_NAME == "main"
```

---

# Keywords: Includes

**Includes** allow reusing YAML configs.

- Pull in templates from local, remote, or projects.
- Great for shared configurations.

Example:

```yaml
include:
  - local: "/templates/build.yml"
```
