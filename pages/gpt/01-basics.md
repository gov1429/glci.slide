---
title: "Fundamentals — Concepts"
---

# Key Concepts

- **Job** — a script executed by a runner.
- **Stage** — group of jobs that run in sequence (build, test, deploy).
- **Pipeline** — a graph of stages and jobs executed for a commit/merge request.
- **Runner** — machine/agent that executes jobs (executors: shell, docker, kubernetes).
- **Artifact** — files produced by jobs that can be passed to later jobs.
- **Cache** — persisted files across pipelines or jobs to speed builds.

---

## Job (deeper)

- `script` is mandatory: commands to run.
- `image`, `services`, `before_script`, `after_script` control environment.
- Job `tags` select runners.
- Job `rules` decide whether a job runs. <!-- .element: class="incremental" -->

---

## Pipeline lifecycle

1. Pipeline created (push/MR/schedule/webhook)
2. `workflow:` evaluated — should we run the pipeline?
3. Jobs selected by `rules`
4. Jobs run by stages and `needs`
5. Artifacts & reports uploaded
6. Environments recorded (deployments)

---

## Useful Variables

- `$CI_COMMIT_SHA`, `$CI_COMMIT_REF_NAME`, `$CI_PIPELINE_SOURCE`
- `$CI_PROJECT_ID`, `$CI_PROJECT_PATH`
- `$CI_JOB_TOKEN` (for registry/git access)
