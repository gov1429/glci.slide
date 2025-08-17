# Live Demos

<div v-motion :initial="{ scale: 1.5, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" class="text-center">
  <div class="text-6xl mb-8">🎬</div>
  <h2 class="text-3xl font-bold text-red-600">Time to see it in action!</h2>
</div>

---
layout: two-cols
---

# Demo 1: Basic Pipeline

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Goal:** Create a simple Node.js pipeline from scratch

</div>

<div v-click="1">

**Step 1: Repository Setup**

```bash
# Create new project
mkdir demo-node-app && cd demo-node-app
git init

# Basic project files
echo "node_modules/" > .gitignore
npm init -y
npm install express jest

# Add test script to package.json
npm pkg set scripts.test="jest"
npm pkg set scripts.start="node app.js"
npm pkg set scripts.build="echo 'Build complete'"
```

</div>

::right::

<div v-click="2">

**Step 2: Simple App**

```javascript
// app.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({
    message: "Hello GitLab CI!",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

app.get("/health", (req, res) => {
  res.json({ status: "healthy" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
```

</div>

---

# Demo 1: Basic Pipeline (cont.)

<div v-click="1">

**Step 3: Add Tests**

```javascript
// app.test.js
const request = require("supertest");
const app = require("./app");

describe("App", () => {
  test("GET / returns welcome message", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Hello GitLab CI!");
  });

  test("GET /health returns healthy status", async () => {
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
  });
});
```

</div>

<div v-click="2">

**Step 4: Basic .gitlab-ci.yml**

```yaml
image: node:18-alpine

stages:
  - install
  - test
  - build

variables:
  NODE_ENV: test

cache:
  paths:
    - node_modules/

install:
  stage: install
  script:
    - npm ci
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour

test:
  stage: test
  script:
    - npm test
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml
    expire_in: 1 week
    when: always

build:
  stage: build
  script:
    - npm run build
    - echo "Build artifact created"
  artifacts:
    paths:
      - dist/
    expire_in: 1 day
  only:
    - main
    - merge_requests
```

</div>

---

# Demo 1: Results

<div v-motion :initial="{ scale: 0.9, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">

**Expected Pipeline Flow:**

</div>

<div v-click="1">

```mermaid {scale: 0.7}
graph LR
    A[📦 install] --> B[🧪 test]
    A --> C[🏗️ build]
    B --> D[✅ Pipeline Success]
    C --> D

    style A fill:#e1f5fe,stroke:#01579b
    style B fill:#f3e5f5,stroke:#4a148c
    style C fill:#e8f5e8,stroke:#2e7d32
    style D fill:#fff3e0,stroke:#e65100
```

</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 400 } }" class="mt-8 grid grid-cols-3 gap-4">
  <div class="bg-blue-50 p-4 rounded-lg text-center">
    <div class="text-2xl mb-2">⚡</div>
    <div class="font-semibold text-sm">Fast Feedback</div>
    <div class="text-xs text-gray-600">~2 minutes total</div>
  </div>
  <div class="bg-green-50 p-4 rounded-lg text-center">
    <div class="text-2xl mb-2">📊</div>
    <div class="font-semibold text-sm">Test Coverage</div>
    <div class="text-xs text-gray-600">Visual reports</div>
  </div>
  <div class="bg-purple-50 p-4 rounded-lg text-center">
    <div class="text-2xl mb-2">🔄</div>
    <div class="font-semibold text-sm">Parallel Jobs</div>
    <div class="text-xs text-gray-600">Efficient execution</div>
  </div>
</div>

---

# Demo 2: Advanced Features

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Goal:** Add rules, variables, environments, and security scanning

</div>

<div v-click="1">

```yaml
variables:
  NODE_ENV: "test"
  DOCKER_REGISTRY: $CI_REGISTRY_IMAGE
  STAGING_URL: "https://staging-$CI_PROJECT_NAME.example.com"
  PRODUCTION_URL: "https://$CI_PROJECT_NAME.example.com"

workflow:
  rules:
    - if: $CI_MERGE_REQUEST_IID
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/

stages:
  - install
  - lint
  - test
  - security
  - build
  - deploy

# Dependency installation with better caching
install:
  stage: install
  script:
    - npm ci --prefer-offline --no-audit
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
    policy: pull-push
  artifacts:
    paths:
      - node_modules/
    expire_in: 1 hour
```

</div>

---

# Demo 2: Advanced Features (cont.)

<div v-click="1">

```yaml
# Parallel linting and testing
lint:eslint:
  stage: lint
  script:
    - npm run lint
  artifacts:
    reports:
      codequality: eslint-report.json
  rules:
    - changes:
        - "**/*.js"
        - "**/*.json"
        - ".eslintrc*"

test:unit:
  stage: test
  script:
    - npm run test:unit
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'
  artifacts:
    reports:
      junit: junit.xml
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

test:integration:
  stage: test
  services:
    - postgres:13-alpine
    - redis:7-alpine
  variables:
    POSTGRES_DB: testdb
    POSTGRES_USER: test
    POSTGRES_PASSWORD: test
    REDIS_URL: redis://redis:6379
  script:
    - npm run test:integration
  rules:
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
    - if: $CI_COMMIT_BRANCH == "main"
```

</div>

---

# Demo 2: Security & Build

<div v-click="1">

```yaml
# Security scanning
security:sast:
  stage: security
  image: registry.gitlab.com/security-products/sast:latest
  script:
    - /analyzer run
  artifacts:
    reports:
      sast: gl-sast-report.json
  rules:
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
    - if: $CI_COMMIT_BRANCH == "main"

security:dependency:
  stage: security
  script:
    - npm audit --audit-level high
    - npm run security:check
  allow_failure: true

# Multi-stage Docker build
build:docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build --target production -t $DOCKER_REGISTRY:$CI_COMMIT_SHA .
    - docker build --target production -t $DOCKER_REGISTRY:latest .
    - docker push $DOCKER_REGISTRY:$CI_COMMIT_SHA
    - docker push $DOCKER_REGISTRY:latest
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
```

</div>

---

# Demo 2: Environment Deployments

<div v-click="1">

```yaml
# Staging deployment (automatic)
deploy:staging:
  stage: deploy
  image: alpine/k8s:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT_STAGING
    - |
      cat <<EOF | kubectl apply -f -
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: $CI_PROJECT_NAME-staging
        namespace: staging
      spec:
        replicas: 2
        selector:
          matchLabels:
            app: $CI_PROJECT_NAME
        template:
          metadata:
            labels:
              app: $CI_PROJECT_NAME
          spec:
            containers:
            - name: app
              image: $DOCKER_REGISTRY:$CI_COMMIT_SHA
              ports:
              - containerPort: 3000
      EOF
  environment:
    name: staging
    url: $STAGING_URL
    deployment_tier: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# Production deployment (manual)
deploy:production:
  stage: deploy
  image: alpine/k8s:latest
  script:
    - kubectl config use-context $KUBE_CONTEXT_PRODUCTION
    - kubectl set image deployment/$CI_PROJECT_NAME app=$DOCKER_REGISTRY:$CI_COMMIT_SHA -n production
    - kubectl rollout status deployment/$CI_PROJECT_NAME -n production
  environment:
    name: production
    url: $PRODUCTION_URL
    deployment_tier: production
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
```

</div>

---

# Demo 3: Using Components

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Goal:** Replace custom logic with reusable components

</div>

<div class="grid grid-cols-2 gap-8">
<div v-click="1" class="bg-red-50 p-4 rounded-lg">
    
**❌ Before: Custom Docker Build**
```yaml
build:docker:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

_Problems: Repetitive, error-prone, hard to maintain_

</div>

<div v-click="2" class="bg-green-50 p-4 rounded-lg">
    
**✅ After: Using Components**
```yaml
include:
  - component: gitlab.com/components/docker-build@2.0.0
    inputs:
      image_name: $CI_REGISTRY_IMAGE
      tags: [$CI_COMMIT_SHA, "latest"]
      push: true
      cache: true
      platforms: ["linux/amd64", "linux/arm64"]
#
build:docker:
extends: [.docker-build]
rules: - if: $CI_COMMIT_BRANCH == "main"
```

_Benefits: Less code, more features, battle-tested_

</div>
</div>

---

# Demo 3: Full Component Pipeline

```yaml
# Modern pipeline with components
include:
  # Code quality
  - component: gitlab.com/components/eslint@1.1.0
    inputs:
      config_file: .eslintrc.js

  # Security scanning
  - component: gitlab.com/components/security-scanner@2.0.0
    inputs:
      sast: true
      dependency_scan: true
      secret_detection: true

  # Docker build with multi-arch
  - component: gitlab.com/components/docker-build@2.1.0
    inputs:
      platforms: ["linux/amd64", "linux/arm64"]
      build_args:
        NODE_VERSION: "18"
      tags: [$CI_COMMIT_SHA, $CI_COMMIT_REF_SLUG]

  # Kubernetes deployment
  - component: gitlab.com/components/k8s-deploy@3.0.0
    inputs:
      namespace: myapp
      helm_chart: ./chart
      values:
        image:
          tag: $CI_COMMIT_SHA
        replicas: 3

stages: [lint, security, build, deploy]

lint-code:
  extends: [.eslint]

security-scan:
  extends: [.security-scanner]

build-image:
  extends: [.docker-build]
  needs: []

deploy-staging:
  extends: [.k8s-deploy]
  variables:
    KUBE_NAMESPACE: myapp-staging
  environment:
    name: staging
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

---

# Demo 4: Creating a Component

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Goal:** Create a reusable Node.js testing component

</div>

<div v-click="1">

**Step 1: Component Structure**

```bash
# Create component project
mkdir node-test-component
cd node-test-component

# Set up files
touch .gitlab-ci.yml template.yml README.md
mkdir examples tests
```

</div>

<div v-click="2">

**Step 2: Component Metadata**

```yaml
# .gitlab-ci.yml
spec:
  inputs:
    node_version:
      description: Node.js version to use
      type: string
      default: "18"
      options: ["16", "18", "20", "21"]
    test_command:
      description: Test command to run
      type: string
      default: "npm test"
    coverage:
      description: Enable coverage reporting
      type: boolean
      default: true
    parallel_tests:
      description: Run tests in parallel
      type: boolean
      default: false

include:
  - local: template.yml
```

</div>

---

# Demo 4: Component Implementation

<div v-click="1">

```yaml
# template.yml
spec:
  inputs:
    node_version:
      type: string
      default: "18"
    test_command:
      type: string
      default: "npm test"
    coverage:
      type: boolean
      default: true
    parallel_tests:
      type: boolean
      default: false

---
.node-test-base:
  image: node:$[[ inputs.node_version ]]-alpine
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
  before_script:
    - npm ci --prefer-offline --no-audit

.node-test:
  extends: [.node-test-base]
  script:
    - |
      if [ "$[[ inputs.coverage ]]" = "true" ]; then
        export COVERAGE_OPTIONS="--coverage --coverageReporters=text-lcov --coverageReporters=cobertura"
      fi
    - $[[ inputs.test_command ]] $COVERAGE_OPTIONS
  artifacts:
    when: always
    reports:
      junit: junit.xml
    paths:
      - coverage/
    expire_in: 1 week
  coverage: '/All files[^|]*\|[^|]*\s+([\d\.]+)/'

.node-test-parallel:
  extends: [.node-test]
  parallel: 3
  script:
    - |
      if [ "$[[ inputs.parallel_tests ]]" = "true" ]; then
        export TEST_SPLIT="--testPathPattern=.*\\.test\\.js --maxWorkers=1"
      fi
    - $[[ inputs.test_command ]] $TEST_SPLIT $COVERAGE_OPTIONS
```

</div>

---

# Demo 4: Component Usage Examples

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">
    
**Basic Usage:**

```yaml
# Consumer project
include:
  - component: gitlab.com/myorg/node-test@1.0.0

test:
  extends: [.node-test]
```

</div>

<div v-click="2">
    
**Advanced Configuration:**

```yaml
include:
  - component: gitlab.com/myorg/node-test@1.0.0
    inputs:
      node_version: "20"
      test_command: "npm run test:ci"
      coverage: true
      parallel_tests: true

test:unit:
  extends: [.node-test]

test:integration:
  extends: [.node-test-parallel]
  services:
    - postgres:13
  variables:
    DATABASE_URL: postgres://test:test@postgres/testdb
```

</div>
</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 400 } }" class="mt-8 p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">

**Component Benefits in Action:**

- 🔄 **Reusable** across all Node.js projects
- ⚙️ **Configurable** for different needs
- 🧪 **Tested** and battle-proven
- 📚 **Documented** with clear examples
- 🔒 **Versioned** for stability

</div>

---

# Demo Results Summary

<div class="grid grid-cols-2 gap-8 mt-8">
<div v-motion :initial="{ x: -40, opacity: 0 }" :enter="{ x: 0, opacity: 1 }">
    
### What We Achieved 🎯

- ✅ **Basic Pipeline** - Simple 3-stage workflow
- ✅ **Advanced Features** - Rules, workflows, environments
- ✅ **Component Usage** - Replaced custom code
- ✅ **Component Creation** - Built reusable solution
- ✅ **Best Practices** - Production-ready patterns

</div>

<div v-motion :initial="{ x: 40, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 300 } }">
    
### Migration Benefits 📈

- 🚀 **50% faster** setup time
- 🔧 **90% less** maintenance overhead
- 📊 **Built-in** reporting and metrics
- 🔒 **Enhanced** security scanning
- 🌐 **Cloud-native** scaling

</div>
</div>

<div v-motion :initial="{ y: 40, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 600 } }" class="mt-12 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg text-center">

### Next Steps for Your Team

1. **🧪 Start with pilot projects** - Choose 2-3 simple repositories
2. **📚 Create migration playbook** - Document patterns and decisions
3. **🏗️ Build component library** - Reusable patterns for your stack
4. **👥 Train the team** - Hands-on workshops and pair programming
5. **📊 Measure success** - Track build times, deployment frequency, MTTR

</div>

---

# Interactive Q&A Session

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="text-center">
  <div class="text-6xl mb-8">🤔</div>
  <h2 class="text-3xl font-bold text-blue-600 mb-4">Let's discuss your migration!</h2>
  <p class="text-xl text-gray-600">Questions, concerns, and next steps</p>
</div>

<div v-motion :initial="{ scale: 0.9, opacity: 0 }" :enter="{ scale: 1, opacity: 1, transition: { delay: 400 } }" class="mt-12 grid grid-cols-3 gap-8">
  <div class="bg-blue-50 p-6 rounded-lg text-center">
    <div class="text-3xl mb-4">⚡</div>
    <h3 class="font-bold text-blue-800">Quick Wins</h3>
    <p class="text-sm text-gray-600 mt-2">What can we migrate first for immediate impact?</p>
  </div>
  
  <div class="bg-green-50 p-6 rounded-lg text-center">
    <div class="text-3xl mb-4">🛠️</div>
    <h3 class="font-bold text-green-800">Technical Challenges</h3>
    <p class="text-sm text-gray-600 mt-2">Complex builds, integrations, custom tools?</p>
  </div>
  
  <div class="bg-purple-50 p-6 rounded-lg text-center">
    <div class="text-3xl mb-4">📅</div>
    <h3 class="font-bold text-purple-800">Timeline & Planning</h3>
    <p class="text-sm text-gray-600 mt-2">How to plan the migration phases?</p>
  </div>
</div>
