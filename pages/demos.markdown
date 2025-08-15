---
layout: section
transition: fade-out
---

# Live Demo: Basic Pipeline

Let's create a simple `.gitlab-ci.yml` and run it.

1. Add file to repo. {v-click="1"}
2. Commit and push. {v-click="2"}
3. Watch pipeline in GitLab UI. {v-click="3"}

```yaml
job:
  script: echo "Hello from GitLab CI!"
```

*(Demo in browser: Show pipeline running live)*

---

# Live Demo: Using Rules and Includes

Advanced example with conditional deploy.

- Include a template. {v-click="1"}
- Add rules for main branch. {v-click="2"}

*(Live: Edit YAML, trigger pipeline, show conditional execution)*

---

# Live Demo: Components

Include a public component and extend it.

- Add include for a build component. {v-click="1"}
- Run and verify. {v-click="2"}

*(Demo: Show catalog, include, pipeline output)*

---