---
# layout: section
transition: slide-left
---

# GitLab CI/CD Components

**Components** are reusable, modular pieces of CI/CD configuration.

- Introduced in GitLab 16+.
- Like functions for your pipelines.
- Stored in a catalog or projects.

Benefits:

- Reusability across projects.
- Versioning and updates.
- Reduces duplication.

---

# Using Components

Include in your `.gitlab-ci.yml`:

```yaml {1-2|4-5}
include:
  - component: gitlab.com/components/build@1.0.0

my-job:
  extends: .build-template
```

- **Usage**: Extend jobs, reference variables.
- **Benefits**: Standardized pipelines, easier maintenance.

<div class="bg-purple-100 p-4 rounded-lg mt-4 text-purple-800">
Example: Use a "docker-build" component for consistent builds.
</div>
