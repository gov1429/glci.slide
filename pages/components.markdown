---
layout: section
transition: slide-left
---

# GitLab CI/CD Components

**Components** are reusable, modular pieces of CI/CD configuration.

- Introduced in GitLab 16+. {v-click="1"}
- Like functions for your pipelines. {v-click="2"}
- Stored in a catalog or projects. {v-click="3"}

Benefits:
- Reusability across projects. {v-click="4"}
- Versioning and updates. {v-click="5"}
- Reduces duplication. {v-click="6"}

---

# Using Components

Include in your `.gitlab-ci.yml`:

```yaml [1-2|3-5]
include:
  - component: gitlab.com/components/build@1.0.0

my-job:
  extends: .build-template
```

- **Usage**: Extend jobs, reference variables. {v-click="1"}
- **Benefits**: Standardized pipelines, easier maintenance. {v-click="2"}

<div class="bg-purple-100 p-4 rounded-lg mt-4 text-purple-800">
Example: Use a "docker-build" component for consistent builds.
</div>

---