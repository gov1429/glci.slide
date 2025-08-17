---
# layout: section
transition: slide-up
---

# Fundamentals: Pipelines

A **Pipeline** is the top-level structure in GitLab CI.

<v-clicks>

- Collection of jobs executed in stages.
- Triggered by events: pushes, merges, schedules.
- Visualized in GitLab UI with status (success, failed).

</v-clicks>

<div class="flex justify-center mt-4">
  <img src="https://gitlab.com/gitlab-org/gitlab/-/raw/75ff01155e95c79c3e7420e167b36c6edaf5db26/doc/ci/quick_start/img/pipeline_graph_v17_9.png" class="w-80% rounded shadow" />
</div>

---

# Fundamentals: Jobs

A **Job** is the smallest unit of work in a pipeline.

<v-clicks>

- Defined in `.gitlab-ci.yml`.
- Runs on a runner (e.g., Docker, shell).
- Can have scripts, artifacts, dependencies.

</v-clicks>

Example:

```yaml {|1|2-3|4-5}
build-job:
  stage: build
  script:
    - echo "Building..."
    - make build
```

---

# Fundamentals: Stages

**Stages** group jobs that run in parallel or sequence.

<v-clicks>

- Default stages: build, test, deploy.
- Jobs in the same stage run concurrently.
- Next stage starts only if previous succeeds.

</v-clicks>

```yaml {|1-4|6-8}
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script: echo "Build"

test-job:
  stage: test
  script: echo "Test"
```
