---
layout: section
---

# Workflows & Rules

## Smart Pipeline Control

---

# Understanding Workflows

<div class="grid grid-cols-2 gap-8 mt-8">

<div>

- **Pipeline-level control** - determines if pipeline runs
- **Evaluated first** - before any jobs
- **Global rules** that apply to entire pipeline
- **Prevents unnecessary runs** and saves resources

<v-click at ="1">

### Common Workflow Patterns{.mt-2}

<v-clicks at="2" fade>

1. Branch-only
2. MR-focused
3. Hybrid
4. Scheduled

</v-clicks>

</v-click>

</div>

<v-click at="6">

```yaml {*|3-4|5-6|7-8|9-10|11-}{at:7}
workflow:
  rules:
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME =~ /^(uat|staging)$/
      when: never
    - if: $CI_COMMIT_TAG || $CI_COMMIT_MESSAGE =~ /release/
      when: never
    # Run for merge requests (CI)
    - if: $CI_PIPELINE_SOURCE == 'merge_request_event'
    # CD
    - if: $CI_COMMIT_BRANCH =~ /^(dev|develop|uat|staging|master|main)$/
    # Don't run in other cases
    - when: never
```

</v-click>

</div>

<!--
- [click:2] Only run on specific branches
- [click] Primary focus on merge requests
- [click] Different pipelines for different events
- [click] Only run on schedule or manual

- [click] Order is matter
- [click] Ignore uat ci
- [click] Ignore release flow (pushing tag or release message)
- [click] CI for every MRs
- [click] CD for specific branches
- [click] Not necessary
-->

---

# Rules - The Power of Conditions

1. **First match wins** - stops at first matching rule
2. **Top to bottom** - order matters
3. **No match = don't run** (unless default behavior)

```yaml
job:
  rules:
    - if: CONDITION # When condition
      when: on_success # Execution timing
      allow_failure: true # Failure handling
      variables: # Dynamic variables
        DEPLOY_ENV: staging
    - changes: # File-based conditions
        - "src/**/*.js"
        - "package.json"
    - exists: # File existence
        - Dockerfile
```

<!--
**Evaluation Order**

`rules` can be used in some keywords but have some different options, in this example, we focus on `job`.
-->

---

# File-based Rules: `changes`

<div class="grid grid-cols-2 gap-8">

<div>

- **Changes Rules**

```yaml {*|2-8|10-|5-8,13-}
# Run when specific files change
build_frontend:
  script: npm run build
  rules:
    - changes:
        - "frontend/**/*.js"
        - "frontend/**/*.vue"
        - "frontend/package.json"

build_backend:
  script: ./build-backend.sh
  rules:
    - changes:
        - "backend/**/*.py"
        - "backend/requirements.txt"
        - "backend/Dockerfile"
```

</div>

<div v-click="4">

- **Patterns & Wildcards**

```yaml {*|4-7,12-14|12-}{at:5}
# Glob patterns
test_changes:
  rules:
    - changes:
        - "**/*.test.js" # Any test file
        - "src/**/*.{js,ts}" # JS or TS in src
        - "*.{yml,yaml}" # YAML files in root

# Directory patterns
docs_deploy:
  rules:
    - changes:
        - "docs/**/*" # Anything in docs
        - "*.md" # Markdown in root
      if: $CI_COMMIT_BRANCH == "main"
```

</div>

</div>

<!--
- [click] A frontend project
- [click] A backend project
- [click] Create job only if these files changed

- [click:2] Use glob
- [click] Combine with `if`
-->

---

# Dynamic Variables with Rules

- **Rule-specific Variables**

```yaml {*|2-5|7-10,2-3|11-14,2-3|15-,2-3}
deploy_app:
  script:
    - echo "Deploying to $DEPLOY_ENV"
  variables:
    DEPLOY_ENV: "development" # Default
  rules:
    # Override for main branch
    - if: $CI_COMMIT_BRANCH == "main"
      variables:
        DEPLOY_ENV: "production"
    # Override for staging branch
    - if: $CI_COMMIT_BRANCH == "staging"
      variables:
        DEPLOY_ENV: "staging"
    # Default case
    - when: always
```

<!--
Dynamic variables are available in `workflow` keyword.

- [click] Use `DEPLOY_ENV` variable
- [click] `DEPLOY_ENV` is 'production'
- [click] `DEPLOY_ENV` is 'staging'
- [click] `DEPLOY_ENV` is 'development'; without 'always', only branches, 'main' and 'staging' create the job
-->
