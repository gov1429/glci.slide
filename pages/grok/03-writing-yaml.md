---
# layout: section
transition: slide-right
---

# How to Write .gitlab-ci.yml

The `.gitlab-ci.yml` file is placed at the root of your repository.

<v-clicks>

- Defines the entire CI/CD process.
- YAML syntax: Key-value pairs, indentation matters.
- Validated automatically in GitLab.

</v-clicks>

Basic Structure:

```yaml {|1-2|4-6|8-10}
default:
  image: alpine

stages:
  - build
  - test

build-job:
  stage: build
  script: echo "Hello, GitLab CI!"
```

---

# Using .gitlab-ci.yml

<v-clicks>

- **Commit and Push**: Pipeline triggers on push.
- **View in UI**: Go to CI/CD > Pipelines in GitLab.
- **Debug**: Use job logs, retry failed jobs.

</v-clicks>

Tips:

- Start simple: One job, one stage.
- Use templates for reuse.

<div class="bg-green-100 p-4 rounded-lg mt-4 text-green-800">
Pro Tip: Use the Pipeline Editor in GitLab for linting and visualization.
</div>
