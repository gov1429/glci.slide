---
# layout: section
transition: fade-out
---

# Live Demo: Basic Pipeline

Let's create a simple `.gitlab-ci.yml` and run it.

1. Add file to repo.
2. Commit and push.
3. Watch pipeline in GitLab UI.

```yaml
job:
  script: echo "Hello from GitLab CI!"
```

_(Demo in browser: Show pipeline running live)_

---

# Live Demo: Using Rules and Includes

Advanced example with conditional deploy.

- Include a template.
- Add rules for main branch.

_(Live: Edit YAML, trigger pipeline, show conditional execution)_

---

# Live Demo: Components

Include a public component and extend it.

- Add include for a build component.
- Run and verify.

_(Demo: Show catalog, include, pipeline output)_
