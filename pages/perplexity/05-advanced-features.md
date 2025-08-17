---
layout: section
---

# Advanced Features  
## Variables, Artifacts, Caching & More

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">Powerful features to optimize your pipelines...</span>
</div>

---
layout: two-cols-header
---

# Variables - Pipeline Configuration

<div class="mt-6">

## Types of Variables 📊

<v-clicks>

- **Predefined**: Provided by GitLab automatically
- **Custom**: Defined by you at different levels  
- **File-based**: Loaded from external files
- **Protected**: Only available on protected branches
- **Masked**: Hidden in job logs

</v-clicks>

</div>

::left::

<v-click="6">

## Predefined Variables

```yaml
test_job:
  script:
    # Project information
    - echo "Project: $CI_PROJECT_NAME"
    - echo "Namespace: $CI_PROJECT_NAMESPACE"
    - echo "URL: $CI_PROJECT_URL"
    
    # Commit information
    - echo "Branch: $CI_COMMIT_BRANCH" 
    - echo "SHA: $CI_COMMIT_SHA"
    - echo "Message: $CI_COMMIT_MESSAGE"
    
    # Pipeline information  
    - echo "Pipeline ID: $CI_PIPELINE_ID"
    - echo "Job ID: $CI_JOB_ID"
    - echo "Runner: $CI_RUNNER_DESCRIPTION"
    
    # User information
    - echo "User: $GITLAB_USER_LOGIN"
    - echo "Email: $GITLAB_USER_EMAIL"
```

</v-click>

::right::

<v-click="7">

## Custom Variables Hierarchy

<div class="space-y-3">

<div class="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Instance** (Admin-level)
Applies to all projects

</div>

<div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-400">

**Group** (Group-level)  
Applies to all projects in group

</div>

<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">

**Project** (Project-level)
Applies to specific project

</div>

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Pipeline** (Runtime)
Passed when running manually

</div>

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Job** (Job-level)
Defined in .gitlab-ci.yml

</div>

</div>

<div class="mt-4 text-sm opacity-75">
  ⬆️ Higher priority overrides lower
</div>

</v-click>

---
layout: default
---

# Variable Usage Patterns

<div class="grid grid-cols-2 gap-8">

<div>

## Global Variables

<v-click="1">

```yaml
# Global variables for entire pipeline
variables:
  NODE_VERSION: "18"
  DOCKER_REGISTRY: "registry.gitlab.com"
  APP_NAME: "my-awesome-app"
  ENVIRONMENT: "development"

# Use in any job  
build:
  script:
    - echo "Building $APP_NAME"
    - docker build -t $DOCKER_REGISTRY/$APP_NAME .

test:
  image: node:$NODE_VERSION
  script:
    - npm test
```

</v-click>

<v-click="2">

## Job-specific Variables

```yaml  
deploy_staging:
  variables:
    DEPLOY_ENV: "staging"
    REPLICAS: "2"
    DB_HOST: "staging-db.internal"
  script:
    - ./deploy.sh --env=$DEPLOY_ENV --replicas=$REPLICAS
    - ./configure-db.sh --host=$DB_HOST

deploy_production:
  variables:
    DEPLOY_ENV: "production"  
    REPLICAS: "5"
    DB_HOST: "prod-db.internal"
  script:
    - ./deploy.sh --env=$DEPLOY_ENV --replicas=$REPLICAS
    - ./configure-db.sh --host=$DB_HOST
```

</v-click>

</div>

<div>

<v-click="3">

## Dynamic Variables

```yaml
# Environment-based variables
variables:
  APP_VERSION: $CI_COMMIT_SHORT_SHA
  BUILD_DATE: $CI_PIPELINE_CREATED_AT

build:
  script:
    - echo "Version: $APP_VERSION"  
    - echo "Built on: $BUILD_DATE"
    - ./build.sh --version=$APP_VERSION

# Multi-line variables    
deploy:
  variables:
    DEPLOY_SCRIPT: |
      set -e
      echo "Starting deployment..."
      kubectl apply -f k8s/
      kubectl wait --for=condition=available deployment/app
      echo "Deployment complete!"
  script:
    - eval "$DEPLOY_SCRIPT"
```

</v-click>

<v-click="4">

## Protected & Masked Variables

```yaml
# In GitLab UI: Settings > CI/CD > Variables
# API_KEY: Set as protected + masked
# DB_PASSWORD: Set as masked

deploy_production:
  rules:
    - if: $CI_COMMIT_BRANCH == "main"  # Protected branch
  script:
    - ./deploy.sh --api-key=$API_KEY
    - ./setup-db.sh --password=$DB_PASSWORD
  environment: production
```

</v-click>

</div>

</div>

---
layout: default
---

# Artifacts - Sharing Data Between Jobs

<div class="grid grid-cols-2 gap-8">

<div>

## Basic Artifacts 📦

<v-click="1">

```yaml
build:
  script:
    - npm run build
    - npm run test:coverage
  artifacts:
    paths:
      - dist/          # Built application
      - coverage/      # Coverage reports
    expire_in: 1 week  # Auto-cleanup
    when: always       # Save even on failure

test:
  needs: [build]
  script:
    - ls -la dist/     # Can access artifacts
    - ./run-tests.sh
```

</v-click>

<v-click="2">

## Artifact Reports

```yaml
test:
  script:
    - npm run test:unit
    - npm run test:coverage
  artifacts:
    reports:
      junit: test-results.xml
      coverage: coverage/cobertura.xml
      codequality: quality-report.json
    paths:
      - test-results/
    expire_in: 30 days
  coverage: '/Coverage: \d+\.\d+%/'
```

</v-click>

</div>

<div>

<v-click="3">

## Advanced Artifact Patterns

```yaml
# Conditional artifacts
build:
  script: ./build.sh
  artifacts:
    paths:
      - build/
    rules:
      # Only save artifacts for main branch
      - if: $CI_COMMIT_BRANCH == "main"

# Dynamic artifact names      
package:
  script:
    - ./package.sh
    - mv package.zip "app-$CI_COMMIT_SHORT_SHA.zip"
  artifacts:
    name: "app-$CI_COMMIT_REF_SLUG-$CI_COMMIT_SHORT_SHA"
    paths:
      - "*.zip"

# Exclude patterns
build:
  script: ./build.sh  
  artifacts:
    paths:
      - dist/
    exclude:
      - dist/**/*.map      # Exclude source maps
      - dist/test-utils/   # Exclude test utilities
```

</v-click>

<v-click="4">

## Artifact Dependencies

```yaml
compile:
  stage: build
  script: ./compile.sh
  artifacts:
    paths: [dist/]

test_unit:
  stage: test
  needs:
    - job: compile
      artifacts: true    # Download artifacts (default)
  script: ./test-unit.sh

test_e2e:
  stage: test  
  needs:
    - job: compile
      artifacts: false   # Don't download artifacts
  script: ./test-e2e.sh  # Doesn't need build artifacts
```

</v-click>

</div>

</div>

---
layout: default
---

# Caching - Speed Up Your Pipelines

<div class="grid grid-cols-2 gap-8">

<div>

## Cache Basics ⚡

<v-click="1">

```yaml
# Global cache configuration
variables:
  CACHE_VERSION: v1

cache:
  key: $CACHE_VERSION          # Cache identifier
  paths:
    - node_modules/            # What to cache
    - .npm/                    # NPM cache
  policy: pull-push            # Download and upload

build:
  script:
    - npm ci --cache .npm      # Use cache location
    - npm run build
```

</v-click>

<v-click="2">

## Smart Cache Keys

```yaml
# Cache based on lock file changes
cache:
  key: 
    files:
      - package-lock.json      # Cache key changes when deps change
    prefix: npm-$CACHE_VERSION
  paths:
    - node_modules/
    
# Different cache per branch
cache:
  key: "$CI_COMMIT_REF_SLUG-$CACHE_VERSION"
  paths:
    - node_modules/
    - .gradle/
```

</v-click>

</div>

<div>

<v-click="3">

## Cache Policies 📋

```yaml
# Job that creates cache
install:
  script: npm ci
  cache:
    key: npm-$CI_COMMIT_REF_SLUG
    paths: [node_modules/]
    policy: push               # Only upload cache

# Jobs that use cache    
test:
  needs: [install]
  script: npm test
  cache:
    key: npm-$CI_COMMIT_REF_SLUG  
    paths: [node_modules/]
    policy: pull               # Only download cache

build:
  needs: [install]  
  script: npm run build
  cache:
    key: npm-$CI_COMMIT_REF_SLUG
    paths: [node_modules/]
    policy: pull               # Only download cache
```

</v-click>

<v-click="4">

## Multiple Cache Entries

```yaml
# Different caches for different needs
test:
  cache:
    - key: npm-$CI_COMMIT_REF_SLUG
      paths: [node_modules/]
    - key: cypress-$CI_COMMIT_REF_SLUG  
      paths: [~/.cache/Cypress]
  script:
    - npm test
    - npm run cypress:run
```

</v-click>

</div>

</div>

---
layout: default
---

# Services & Docker Integration

<div class="grid grid-cols-2 gap-8">

<div>

## Using Services 🐳

<v-click="1">

```yaml
# Test with database
test:
  image: node:18
  services:
    - postgres:13
    - redis:6-alpine
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    DATABASE_URL: postgres://test:test@postgres:5432/testdb
    REDIS_URL: redis://redis:6379
  script:
    - npm run test:integration

# Test with custom service configuration
e2e_tests:
  services:
    - name: selenium/standalone-chrome:latest
      alias: selenium
    - name: postgres:13
      command: ["postgres", "-c", "log_statement=all"]
  variables:
    SELENIUM_URL: http://selenium:4444/wd/hub
  script:
    - npm run test:e2e
```

</v-click>

</div>

<div>

<v-click="2">

## Docker-in-Docker (DinD)

```yaml
# Build Docker images
build_image:
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# Multi-stage Docker build    
build_multi_stage:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build --target production -t app:prod .
    - docker build --target development -t app:dev .
    - docker run --rm app:dev npm test
```

</v-click>

<v-click="3">

## Container Registry Integration

```yaml
variables:
  REGISTRY_IMAGE: $CI_REGISTRY_IMAGE/$CI_COMMIT_REF_SLUG

build_and_push:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker tag $REGISTRY_IMAGE:$CI_COMMIT_SHA $REGISTRY_IMAGE:latest
    - docker push $REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $REGISTRY_IMAGE:latest
```

</v-click>

</div>

</div>

---
layout: default
---

# Job Control & Optimization

<div class="grid grid-cols-2 gap-8">

<div>

## Parallel Jobs 🚀

<v-click="1">

```yaml
# Matrix jobs
test:
  parallel:
    matrix:
      - NODE_VERSION: ["16", "18", "20"]
        OS: ["ubuntu", "alpine"]
  image: node:$NODE_VERSION-$OS
  script:
    - npm test

# Simple parallel execution    
test_parallel:
  parallel: 5
  script:
    - ./run-test-chunk.sh $CI_NODE_INDEX $CI_NODE_TOTAL
```

</v-click>

<v-click="2">

## Job Dependencies

```yaml
# Complex dependency graph
build_frontend:
  stage: build
  script: npm run build:frontend

build_backend:
  stage: build  
  script: ./build-backend.sh

test_unit:
  stage: test
  needs: [build_backend]
  script: ./test-unit.sh

test_integration:
  stage: test
  needs: [build_frontend, build_backend]  
  script: ./test-integration.sh

deploy:
  stage: deploy
  needs: 
    - test_unit
    - test_integration
  script: ./deploy.sh
```

</v-click>

</div>

<div>

<v-click="3">

## Resource Management

```yaml
# Resource limits
heavy_build:
  script: ./heavy-build.sh
  timeout: 2h                    # Job timeout
  retry:
    max: 3                       # Retry failed jobs
    when: 
      - runner_system_failure
      - stuck_or_timeout_failure

# Resource requirements      
gpu_training:
  tags:
    - gpu                        # Requires GPU runner
    - high-memory               # Requires high memory
  script: ./train-model.sh

# Interruptible jobs
build_cache:
  interruptible: true           # Can be canceled by newer pipelines
  script:
    - npm install
    - npm run build
```

</v-click>

<v-click="4">

## Environment Management

```yaml
deploy_staging:
  script: ./deploy.sh
  environment:
    name: staging
    url: https://staging.app.com
    deployment_tier: staging
    auto_stop_in: 1 day         # Auto-cleanup

deploy_review:
  script: ./deploy-review.sh  
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    url: https://$CI_COMMIT_REF_SLUG.review.app.com
    on_stop: stop_review        # Cleanup job
    auto_stop_in: 1 week
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

stop_review:
  script: ./cleanup-review.sh
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  when: manual
```

</v-click>

</div>

</div>

---
layout: center
class: text-center
---

# Advanced Features Mastered! 🎯

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-4 gap-4">

<div class="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## 📊 **Variables**
- Predefined & Custom
- Hierarchy & Scope
- Dynamic Configuration

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">

## 📦 **Artifacts**
- Job Data Sharing
- Reports Integration
- Smart Dependencies

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">

## ⚡ **Caching**
- Intelligent Keys
- Policy Control
- Speed Optimization

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">

## 🐳 **Services**
- Docker Integration
- Service Dependencies  
- Resource Management

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Ready for the game-changer: CI/CD Components! 🧩
  </span>
</div>