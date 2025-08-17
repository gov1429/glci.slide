---
title: "Live Demos & Hands-on"
---

# Suggested Live Demos (short & punchy)
1. **Minimal pipeline**: push a commit and watch pipeline run.
2. **MR preview**: create MR, show review app deploy based on `$CI_COMMIT_SHA`.
3. **Bump → Push**: job `version` commits a bump, `push` job pushes commit (artifacts).
4. **Components**: include a simple component and customize inputs.

---
## Demo 1 — Minimal pipeline
Files:
- `.gitlab-ci.yml` (minimal)
Procedure:
- Push commit → open pipeline page → inspect jobs and logs.

---
## Demo 2 — MR preview (preview per commit, previous cleaned)
- Show `.gitlab-ci.yml` that uses cache file to store previous preview name.
- Push/Update MR → show preview URL changes and previous stopped.

---
## Demo 3 — Components
- Create a small component repo with `spec` and a build job.
- In consumer project use `include: component:` and `input:` to run it.

---
# Tips for demonstrations
- Prepare a throwaway project with GitLab Runner available.
- Use small images to speed up builds (alpine, busybox).
- Predefine CI variables (tokens) so demos don’t pause on auth.
