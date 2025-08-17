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

<v-click>

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

```yaml
workflow:
  rules:
    # Don't run for draft commits
    - if: $CI_COMMIT_MESSAGE =~ /-draft$/
      when: never
    # Run for pushes to main
    - if: $CI_PIPELINE_SOURCE == "push" &&
        $CI_COMMIT_BRANCH == "main"
    # Run for merge requests
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
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
-->

---

# Rules - The Power of Conditions

## Evaluation Order{.mt-6}

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

---
layout: default
---

# File-based Rules: `changes`

<div class="grid grid-cols-2 gap-8">

<div>

## Changes Rules

<v-click>

```yaml
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

</v-click>

</div>

<div>

<v-click>

## Patterns & Wildcards

```yaml
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

</v-click>

</div>

</div>

---
layout: default
---

# Dynamic Variables with Rules

## Rule-specific Variables

```yaml
deploy_app:
  script:
    - echo "Deploying to $DEPLOY_ENV"
    - ./deploy.sh $DEPLOY_ENV
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
TODO: workflow vars?
-->
