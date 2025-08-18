---
layout: section
---

# Writing .gitlab-ci.yml
## Configuration as Code

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">The heart of GitLab CI/CD...</span>
</div>

---
layout: two-cols-header
---

# .gitlab-ci.yml Basics

<div class="mt-6">

## File Location 📍

<v-clicks>

- Must be in the **root** of your repository
- Named exactly **`.gitlab-ci.yml`** (with leading dot)
- **YAML format** - indentation matters!
- **Automatically detected** by GitLab

</v-clicks>

</div>

::left::

<v-click="5">

## Minimal Example

```yaml
# This is a comment
hello-world:
  script:
    - echo "Hello, GitLab CI/CD!"
    - echo "My first pipeline"
```

</v-click>

<v-click="6">

## With Stages

```yaml
stages:
  - build
  - test
  - deploy

build-job:
  stage: build
  script:
    - echo "Building the app..."

test-job:
  stage: test
  script:
    - echo "Running tests..."

deploy-job:
  stage: deploy
  script:
    - echo "Deploying..."
```

</v-click>

::right::

<v-click="7">

## YAML Syntax Tips 💡

<div class="space-y-3">

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Indentation**: Use 2 spaces (not tabs!)

</div>

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Lists**: Use `-` for array items

</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Strings**: Quote when containing special chars

</div>

<div class="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Comments**: Start with `#`

</div>

</div>

</v-click>

---


# Essential Job Keywords

<div class="grid grid-cols-2 gap-8">

<div>

## Core Keywords 🔑

<v-click="1">

```yaml
my-job:
  image: node:18              # Docker image
  stage: build               # Stage assignment
  script:                    # Commands to run
    - npm install
    - npm run build
  before_script:             # Setup commands
    - echo "Starting build"
  after_script:              # Cleanup commands
    - echo "Build finished"
```

</v-click>

<v-click="2">

## Control Keywords 🎛️

```yaml
my-job:
  only:                      # When to run (deprecated)
    - main
  except:                    # When NOT to run (deprecated)
    - develop
  rules:                     # Modern conditional logic
    - if: $CI_COMMIT_BRANCH == "main"
  when: manual               # Execution trigger
  allow_failure: true        # Continue on failure
```

</v-click>

</div>

<div>

<v-click="3">

## Environment Keywords 🌍

```yaml
my-job:
  variables:                 # Job-specific variables
    NODE_ENV: production
  cache:                     # Cache dependencies
    paths:
      - node_modules/
  artifacts:                 # Save build outputs
    paths:
      - dist/
    expire_in: 1 week
  environment:               # Deployment environment
    name: production
    url: https://myapp.com
```

</v-click>

<v-click="4">

## Runner Keywords 🏃‍♂️

```yaml
my-job:
  tags:                      # Select specific runners
    - docker
    - linux
  parallel: 5                # Run job in parallel
  timeout: 30m               # Max execution time
  retry: 2                   # Retry on failure
```

</v-click>

</div>

</div>

---


# Advanced Configuration Patterns

<div class="grid grid-cols-2 gap-8">

<div>

## Global Configuration

<v-click="1">

```yaml
# Global defaults
default:
  image: alpine:latest
  before_script:
    - apk add --no-cache git

# Global variables  
variables:
  DEPLOY_ENV: production
  APP_VERSION: "1.0.0"

# Define stages
stages:
  - prepare
  - build  
  - test
  - deploy
```

</v-click>

<v-click="2">

## Templates with Extends

```yaml
.deploy_template: &deploy
  stage: deploy
  script:
    - ./deploy.sh
  only:
    - main

deploy_staging:
  <<: *deploy
  environment: staging
  
deploy_production:
  <<: *deploy  
  environment: production
  when: manual
```

</v-click>

</div>

<div>

<v-click="3">

## Hidden Jobs (Templates)

```yaml
# Hidden job - starts with dot
.test_template:
  stage: test
  script:
    - npm test
  artifacts:
    reports:
      junit: test-results.xml

# Use the template
unit_tests:
  extends: .test_template
  script:
    - npm run test:unit
    
integration_tests:
  extends: .test_template
  script:
    - npm run test:integration
```

</v-click>

<v-click="4">

## Multi-line Commands

```yaml
complex_job:
  script:
    - |
      echo "This is a multi-line script"
      for i in {1..3}; do
        echo "Processing step $i"
        sleep 1
      done
      echo "Complex processing complete"
    - >
      echo "This is a folded scalar"
      echo "that becomes a single line"
```

</v-click>

</div>

</div>

---


# Real-World Example: Node.js Application

<div class="grid grid-cols-2 gap-8">

<div>

<v-click="1">

```yaml {1-10|11-20|21-30|31-40|all}
# Complete Node.js pipeline
image: node:18

stages:
  - install
  - test
  - build
  - deploy

variables:
  NODE_ENV: production
  NPM_CONFIG_CACHE: .npm
  
cache:
  paths:
    - node_modules/
    - .npm/

# Install dependencies
install_dependencies:
  stage: install
  script:
    - npm ci --cache .npm
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

# Run tests
unit_tests:
  stage: test
  needs: ["install_dependencies"]
  script:
    - npm run test:unit
  artifacts:
    reports:
      junit: test-results.xml
      coverage: coverage/
  coverage: '/Coverage: \d+\.\d+%/'

# Lint code
code_quality:
  stage: test  
  needs: ["install_dependencies"]
  script:
    - npm run lint
    - npm run format:check
  allow_failure: true
```

</v-click>

</div>

<div>

<v-click="2">

```yaml {1-15|16-30|31-45|all}
# Build application
build_app:
  stage: build
  needs: ["unit_tests", "code_quality"]
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
  only:
    refs:
      - main
      - develop

# Security scanning
security_scan:
  stage: test
  needs: ["install_dependencies"]
  script:
    - npm audit
    - npm run security:check
  allow_failure: true
  only:
    - main

# Deploy to staging
deploy_staging:
  stage: deploy
  needs: ["build_app"]
  script:
    - ./scripts/deploy.sh staging
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - develop

# Deploy to production  
deploy_production:
  stage: deploy
  needs: ["build_app"]
  script:
    - ./scripts/deploy.sh production
  environment:
    name: production
    url: https://myapp.com
  when: manual
  only:
    - main
```

</v-click>

</div>

</div>

---


# Common Patterns & Best Practices

<div class="grid grid-cols-2 gap-8">

<div>

## Use `needs` for Speed ⚡

<v-click="1">

```yaml
# Without needs - sequential
stages:
  - build
  - test
  - deploy
  
# With needs - parallel execution
test_unit:
  stage: test
  needs: ["build"]
  script: npm run test:unit

test_integration:
  stage: test  
  needs: ["build"]
  script: npm run test:integration

deploy:
  stage: deploy
  needs: ["test_unit", "test_integration"]
  script: ./deploy.sh
```

</v-click>

</div>

<div>

## Smart Caching 💾

<v-click="2">

```yaml
# Cache strategy
variables:
  CACHE_VERSION: v1

cache:
  key: 
    files:
      - package-lock.json  # Cache changes when deps change
    prefix: $CACHE_VERSION
  paths:
    - node_modules/
  policy: pull-push

# Pull-only cache for faster jobs
test_job:
  cache:
    key: 
      files:
        - package-lock.json
      prefix: $CACHE_VERSION
    paths:
      - node_modules/
    policy: pull  # Only pull, don't push
  script:
    - npm test
```

</v-click>

</div>

</div>

<div class="mt-8">

<v-click="3">

## Common Mistakes to Avoid ❌

<div class="grid grid-cols-3 gap-4">

<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Wrong Indentation**
```yaml
# Wrong
job:
script:
  - echo "hello"

# Correct  
job:
  script:
    - echo "hello"
```

</div>

<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Mixing Tabs & Spaces**
```yaml
# Use consistent spaces
job:
  script:     # 2 spaces
    - echo    # 4 spaces
```

</div>

<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Missing Quotes**
```yaml
# When in doubt, quote it
variables:
  VERSION: "1.0"
  MESSAGE: "Hello World!"
```

</div>

</div>

</v-click>

</div>

---
layout: center
class: text-center
---

# 🎉 You're Writing CI/CD Pipelines!

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-3 gap-6">

<div class="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">

## ✅ **Learned**
- YAML syntax & structure
- Essential keywords
- Best practices

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## 🚀 **Next Up** 
- Workflows & Rules
- Conditional execution
- Advanced patterns

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">

## 💡 **Remember**
- Start simple
- Use validation tools
- Iterate and improve

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Ready for more advanced features? 🛠️
  </span>
</div>