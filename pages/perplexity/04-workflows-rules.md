---
layout: section
---

# Workflows & Rules
## Smart Pipeline Control

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">Control when and how pipelines run...</span>
</div>

---
layout: two-cols-header
---

# Understanding Workflows

<div class="mt-6">

## What is workflow? 🔄

<v-clicks>

- **Pipeline-level control** - determines if pipeline runs
- **Evaluated first** - before any jobs
- **Global rules** that apply to entire pipeline
- **Prevents unnecessary runs** and saves resources

</v-clicks>

</div>

::left::

<v-click="5">

## Basic Workflow Example

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

::right::

<v-click="6">

## Common Workflow Patterns

<div class="space-y-3">

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Branch-only**: Only run on specific branches

</div>

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**MR-focused**: Primary focus on merge requests

</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Hybrid**: Different pipelines for different events

</div>

<div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-400">

**Scheduled**: Only run on schedule or manual

</div>

</div>

</v-click>

---


# Rules - The Power of Conditions

<div class="grid grid-cols-2 gap-8">

<div>

## Rule Components 🧩

<v-click="1">

```yaml
job:
  rules:
    - if: CONDITION           # When condition
      when: on_success       # Execution timing  
      allow_failure: true    # Failure handling
      variables:             # Dynamic variables
        DEPLOY_ENV: staging
    - changes:               # File-based conditions
        - "src/**/*.js"
        - "package.json"
    - exists:                # File existence
        - Dockerfile
```

</v-click>

<v-click="2">

## Rule Evaluation Order 📋

<div class="space-y-2 mt-4">

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
  <span>**First match wins** - stops at first matching rule</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
  <span>**Top to bottom** - order matters!</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
  <span>**No match = don't run** (unless default behavior)</span>
</div>

</div>

</v-click>

</div>

<div>

<v-click="3">

## Common Rule Conditions

```yaml
# Branch conditions
- if: $CI_COMMIT_BRANCH == "main"
- if: $CI_COMMIT_BRANCH =~ /^feature\/.*$/

# Pipeline source conditions  
- if: $CI_PIPELINE_SOURCE == "merge_request_event"
- if: $CI_PIPELINE_SOURCE == "push"
- if: $CI_PIPELINE_SOURCE == "schedule"

# Tag conditions
- if: $CI_COMMIT_TAG
- if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/

# Combined conditions
- if: $CI_COMMIT_BRANCH == "main" && 
      $CI_PIPELINE_SOURCE == "push"

# Variable conditions
- if: $DEPLOY_TO_PROD == "true"
- if: '$CUSTOM_VARIABLE =~ /pattern/'
```

</v-click>

<v-click="4">

## When Options ⏰

```yaml
# Execution timing
when: on_success    # Default: run if previous stages passed
when: on_failure    # Run only if previous stages failed
when: always        # Always run regardless
when: manual        # Require manual trigger
when: delayed       # Run after delay
  start_in: '5 minutes'
when: never         # Never run (skip)
```

</v-click>

</div>

</div>

---


# File-based Rules: changes & exists

<div class="grid grid-cols-2 gap-8">

<div>

## Changes Rules 📁

<v-click="1">

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

<v-click="2">

## Advanced Changes

```yaml
# Compare to specific branch
security_scan:
  script: ./security-scan.sh
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        compare_to: refs/heads/main
        paths:
          - "**/*.py"
          - "requirements.txt"

# Combine with other conditions          
deploy_docs:
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      changes:
        - "docs/**/*.md"
        - "mkdocs.yml"
```

</v-click>

</div>

<div>

<v-click="3">

## Exists Rules 🔍

```yaml
# Run only if files exist
docker_build:
  script: docker build -t app .
  rules:
    - exists:
        - Dockerfile

# Multiple file checks
python_tests:
  script: python -m pytest
  rules:
    - exists:
        - pytest.ini
        - tests/
        
# Combine exists with other conditions
k8s_deploy:
  script: kubectl apply -f k8s/
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      exists:
        - k8s/deployment.yaml
        - k8s/service.yaml
```

</v-click>

<v-click="4">

## Patterns & Wildcards 🌟

```yaml
# Glob patterns
test_changes:
  rules:
    - changes:
        - "**/*.test.js"      # Any test file
        - "src/**/*.{js,ts}"  # JS or TS in src
        - "*.{yml,yaml}"      # YAML files in root

# Directory patterns        
docs_deploy:
  rules:
    - changes:
        - "docs/**/*"         # Anything in docs
        - "*.md"              # Markdown in root
      if: $CI_COMMIT_BRANCH == "main"
```

</v-click>

</div>

</div>

---


# Dynamic Variables with Rules

<div class="grid grid-cols-2 gap-8">

<div>

## Rule-specific Variables 📊

<v-click="1">

```yaml
deploy_app:
  script:
    - echo "Deploying to $DEPLOY_ENV"
    - ./deploy.sh $DEPLOY_ENV
  variables:
    DEPLOY_ENV: "development"  # Default
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

</v-click>

<v-click="2">

## Complex Variable Logic

```yaml
build_app:
  script:
    - echo "Building $BUILD_TYPE version $VERSION"
    - ./build.sh
  variables:
    BUILD_TYPE: "debug"
    VERSION: "dev"
  rules:
    # Release builds  
    - if: $CI_COMMIT_TAG
      variables:
        BUILD_TYPE: "release"
        VERSION: $CI_COMMIT_TAG
    # Main branch builds
    - if: $CI_COMMIT_BRANCH == "main"  
      variables:
        BUILD_TYPE: "release"
        VERSION: "$CI_COMMIT_SHORT_SHA"
    # Feature branches
    - if: $CI_COMMIT_BRANCH =~ /^feature\//
      variables:
        BUILD_TYPE: "debug"
        VERSION: "$CI_COMMIT_REF_NAME-$CI_COMMIT_SHORT_SHA"
```

</v-click>

</div>

<div>

<v-click="3">

## Conditional Needs & Dependencies

```yaml
stages:
  - build
  - test  
  - deploy

build_app:
  stage: build
  script: ./build.sh

unit_tests:
  stage: test
  script: npm run test:unit
  needs: [build_app]

integration_tests:
  stage: test  
  script: npm run test:integration
  needs: [build_app]

deploy:
  stage: deploy
  script: ./deploy.sh
  needs: [build_app]  # Default dependency
  rules:
    # Production needs all tests
    - if: $CI_COMMIT_BRANCH == "main"
      needs: 
        - build_app
        - unit_tests
        - integration_tests
    # Staging skips integration tests
    - if: $CI_COMMIT_BRANCH == "staging"  
      needs:
        - build_app
        - unit_tests
    # Feature branches skip tests
    - if: $CI_COMMIT_BRANCH =~ /^feature\//
      needs: [build_app]
```

</v-click>

</div>

</div>

---


# Real-world Workflow Examples

<div class="grid grid-cols-2 gap-8">

<div>

## GitFlow Workflow 🌊

<v-click="1">

```yaml
workflow:
  rules:
    # Main branch - full pipeline
    - if: $CI_COMMIT_BRANCH == "main"
    # Develop branch - full pipeline  
    - if: $CI_COMMIT_BRANCH == "develop"
    # Release branches
    - if: $CI_COMMIT_BRANCH =~ /^release\/.*$/
    # Hotfix branches
    - if: $CI_COMMIT_BRANCH =~ /^hotfix\/.*$/
    # Feature branches - limited pipeline
    - if: $CI_COMMIT_BRANCH =~ /^feature\/.*$/
    # Merge requests
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    # Tags for releases
    - if: $CI_COMMIT_TAG
    # Never run otherwise
    - when: never

# Feature branch jobs
feature_tests:
  script: npm test
  rules:
    - if: $CI_COMMIT_BRANCH =~ /^feature\/.*$/
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

# Production deployment
deploy_production:
  script: ./deploy-prod.sh
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
```

</v-click>

</div>

<div>

<v-click="2">

## Microservices Workflow 🔧

```yaml
# Service-specific pipelines
workflow:
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    - if: $CI_COMMIT_BRANCH == "main"  
    - when: never

# Frontend service
build_frontend:
  script: ./build-frontend.sh
  rules:
    - changes:
        - "services/frontend/**/*"
        - "shared/**/*"

test_frontend:
  script: ./test-frontend.sh  
  needs: [build_frontend]
  rules:
    - changes:
        - "services/frontend/**/*"
        - "shared/**/*"
        
deploy_frontend:
  script: ./deploy-frontend.sh
  needs: [test_frontend]
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      changes:
        - "services/frontend/**/*"
        - "shared/**/*"

# Backend service  
build_backend:
  script: ./build-backend.sh
  rules:
    - changes:
        - "services/backend/**/*"
        - "shared/**/*"

# Shared components affect all services
test_all_services:
  script: ./integration-tests.sh
  rules:
    - changes:
        - "shared/**/*"
```

</v-click>

</div>

</div>

---
layout: center
class: text-center  
---

# Rule Combinations 💡

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-2 gap-8">

<div class="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## ✅ **Good Practices**

<div class="text-left mt-4 space-y-2">

- **Always include `when: never`** as final rule
- **Use specific conditions** first  
- **Test rule logic** thoroughly
- **Document complex conditions**

</div>

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">

## ❌ **Common Mistakes**

<div class="text-left mt-4 space-y-2">

- **Wrong rule order** - specific last
- **Missing final catch-all**
- **Complex single conditions** - split them
- **Not testing all branches**

</div>

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Master workflows and rules = Efficient pipelines! ⚡
  </span>
</div>