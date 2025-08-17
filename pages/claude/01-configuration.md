# Writing .gitlab-ci.yml

<div v-motion :initial="{ rotate: -5, opacity: 0 }" :enter="{ rotate: 0, opacity: 1 }" class="text-center">
  <div class="text-6xl mb-8">📝</div>
  <h2 class="text-3xl font-bold text-blue-600">Your Pipeline as Code</h2>
</div>

---

# File Structure & Location

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**The `.gitlab-ci.yml` file must be in your repository root**

</div>

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">

```
my-project/
├── .gitlab-ci.yml          ← Must be here!
├── src/
├── tests/
├── Dockerfile
└── README.md
```

  </div>

  <div v-motion :initial="{ x: 30, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 500 } }">
    <div class="bg-yellow-50 p-6 rounded-lg">
      <h4 class="font-bold text-yellow-800 mb-3">⚠️ Common Mistakes</h4>
      <ul class="space-y-2 text-sm">
        <li>❌ <code>.gitlab-ci.yaml</code> (wrong extension)</li>
        <li>❌ <code>gitlab-ci.yml</code> (missing dot)</li>
        <li>❌ <code>ci/gitlab-ci.yml</code> (wrong location)</li>
        <li>✅ <code>.gitlab-ci.yml</code> (correct!)</li>
      </ul>
    </div>
  </div>
</div>

---

# Basic YAML Structure

<div v-motion :initial="{ scale: 0.95, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">

```yaml
# Global configuration
stages: # Define pipeline stages
  - build
  - test
  - deploy

variables: # Global variables
  NODE_VERSION: "18"
  ENVIRONMENT: "development"

before_script: # Runs before every job
  - echo "Pipeline starting..."

after_script: # Runs after every job (even on failure)
  - echo "Cleaning up..."

# Job definitions start here
job-name:
  stage: build
  script:
    - echo "Hello GitLab CI!"
```

</div>

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 400 } }" class="mt-6 p-4 bg-blue-50 rounded-lg">

**💡 YAML Tip:** Indentation matters! Use 2 spaces, not tabs.

</div>

---

# Your First Pipeline: Node.js App

<div v-click="1">

```yaml
# Simple Node.js pipeline
image: node:18-alpine

stages:
  - install
  - test
  - build

install_dependencies:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

run_tests:
  stage: test
  script:
    - npm run test
  needs: [install_dependencies]

build_application:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
```

</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 600 } }" class="mt-6 grid grid-cols-3 gap-4">
  <div class="bg-green-50 p-4 rounded text-center">
    <div class="text-2xl mb-2">⚡</div>
    <div class="text-sm font-semibold">Fast Feedback</div>
  </div>
  <div class="bg-blue-50 p-4 rounded text-center">  
    <div class="text-2xl mb-2">📦</div>
    <div class="text-sm font-semibold">Artifact Sharing</div>
  </div>
  <div class="bg-purple-50 p-4 rounded text-center">
    <div class="text-2xl mb-2">🎯</div>
    <div class="text-sm font-semibold">Dependency Control</div>
  </div>
</div>

---

# Docker Integration

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

GitLab CI runs jobs in Docker containers by default

</div>

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">

**Global Image:**

```yaml
image: node:18-alpine

build-job:
  script: npm run build

test-job:
  script: npm test
```

  </div>

  <div v-click="2">

**Per-Job Images:**

```yaml
build-frontend:
  image: node:18-alpine
  script: npm run build

build-backend:
  image: golang:1.21
  script: go build ./...

test-integration:
  image: cypress/included:latest
  script: npm run test:e2e
```

  </div>
</div>

<div v-motion :initial="{ scale: 0.95, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { delay: 600 } }" class="mt-8">

**With Services (databases, etc.):**

```yaml
integration-test:
  image: node:18
  services:
    - postgres:13
    - redis:7-alpine
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
  script:
    - npm run test:integration
```

</div>

---

# Working with Artifacts

<div v-motion :initial="{ x: -20, opacity: 0 }" :enter="{ x: 0, opacity: 1 }" class="mb-6">

**Artifacts** preserve files between jobs and stages

</div>

<div v-click="1">

```yaml
build:
  script:
    - npm run build
    - npm run test:coverage
  artifacts:
    name: "build-$CI_COMMIT_SHORT_SHA"
    paths:
      - dist/
      - coverage/
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week
    when: always # Even if job fails

deploy:
  script:
    - ls -la dist/ # Files from build job available!
    - rsync -av dist/ server:/var/www/
  needs: [build]
```

</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 400 } }" class="mt-6 bg-orange-50 p-4 rounded-lg">

**🎯 Best Practices:**

- Set expiration times to save storage
- Use `when: always` for test reports and logs
- Name artifacts clearly for debugging

</div>

---

# Caching for Speed

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Cache** speeds up builds by reusing dependencies

</div>

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">

**Basic Caching:**

```yaml
build:
  image: node:18
  cache:
    paths:
      - node_modules/
  script:
    - npm ci
    - npm run build
```

  </div>

  <div v-click="2">

**Advanced Caching:**

```yaml
.npm-cache: &npm-cache
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
    policy: pull-push

install:
  <<: *npm-cache
  script:
    - npm ci

build:
  <<: *npm-cache
  cache:
    policy: pull # Only pull, don't push
  script:
    - npm run build
```

  </div>
</div>

<div v-motion :initial="{ scale: 0.95, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { delay: 600 } }" class="mt-6 p-4 bg-green-50 rounded-lg">

**Cache vs Artifacts:**

- 📦 **Artifacts:** Build outputs, test reports (shared between jobs)
- ⚡ **Cache:** Dependencies, build tools (optimization, not guaranteed)

</div>

---

# Environment Variables

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

Manage configuration through variables at different levels

</div>

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">

**Predefined Variables:**

```yaml
deploy:
  script:
    - echo "Branch: $CI_COMMIT_BRANCH"
    - echo "Commit: $CI_COMMIT_SHORT_SHA"
    - echo "Job ID: $CI_JOB_ID"
    - echo "Pipeline: $CI_PIPELINE_URL"
    - echo "Runner: $CI_RUNNER_DESCRIPTION"
```

  </div>

  <div v-click="2">

**Custom Variables:**

```yaml
variables:
  DATABASE_URL: "postgres://localhost/myapp"
  NODE_ENV: "test"

test:
  variables:
    NODE_ENV: "testing" # Overrides global
  script:
    - echo "Environment: $NODE_ENV"
    - npm test
```

  </div>
</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 600 } }" class="mt-6">

**Variable Precedence (highest to lowest):**

1. 🎯 Job-level variables
2. 📋 Pipeline-level variables
3. 🔧 Project/Group variables (GitLab UI)
4. 🌐 Global variables

</div>

---

# Multi-Environment Example

<div v-click="1">

```yaml
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_REGISTRY: "registry.gitlab.com/mygroup/myapp"

build:
  stage: build
  script:
    - docker build -t $DOCKER_REGISTRY:$CI_COMMIT_SHA .
    - docker push $DOCKER_REGISTRY:$CI_COMMIT_SHA

test:
  stage: test
  parallel:
    matrix:
      - NODE_VERSION: ["16", "18", "20"]
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm test

deploy:staging:
  stage: deploy
  script:
    - kubectl apply -f k8s/staging/
    - kubectl set image deployment/app app=$DOCKER_REGISTRY:$CI_COMMIT_SHA
  environment:
    name: staging
    url: https://staging.myapp.com

deploy:production:
  stage: deploy
  script:
    - kubectl apply -f k8s/production/
    - kubectl set image deployment/app app=$DOCKER_REGISTRY:$CI_COMMIT_SHA
  environment:
    name: production
    url: https://myapp.com
  only:
    - main
  when: manual
```

</div>
