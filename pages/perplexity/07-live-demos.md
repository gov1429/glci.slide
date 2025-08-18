---
layout: section
---

# Live Demos
## Hands-on GitLab CI/CD

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">Let's build pipelines together!</span>
</div>

---
layout: two-cols-header
---

# Demo 1: Basic Pipeline Creation

<div class="mt-6">

## What We'll Build 🛠️

<v-clicks>

- Simple Node.js application pipeline
- **Build → Test → Deploy** stages
- Basic error handling
- Artifact management

</v-clicks>

</div>

::left::

<v-click="5">

## Project Structure

```
my-node-app/
├── .gitlab-ci.yml          # Our pipeline
├── package.json            # Dependencies
├── src/
│   ├── app.js             # Main application
│   └── utils.js           # Utilities
├── tests/
│   └── app.test.js        # Test files
└── dist/                  # Build output
```

</v-click>

::right::

<v-click="6">

## Live Demo Steps

<div class="space-y-3">

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm">1</div>
  <span>Create new GitLab project</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm">2</div>
  <span>Add sample Node.js application</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm">3</div>
  <span>Create .gitlab-ci.yml file</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm">4</div>
  <span>Watch pipeline execute</span>
</div>

<div class="flex items-center space-x-3">
  <div class="w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-sm">5</div>
  <span>Analyze results & logs</span>
</div>

</div>

</v-click>

---


# Demo 1: Basic Pipeline Code

<div class="grid grid-cols-2 gap-8">

<div>

## Initial .gitlab-ci.yml

<v-click="1">

```yaml
# Basic 3-stage pipeline
stages:
  - build
  - test  
  - deploy

variables:
  NODE_VERSION: "18"

# Install dependencies and build
build_job:
  stage: build
  image: node:$NODE_VERSION
  script:
    - echo "Installing dependencies..."
    - npm ci
    - echo "Building application..."
    - npm run build
  artifacts:
    paths:
      - node_modules/
      - dist/
    expire_in: 1 hour
  only:
    - main
    - develop
```

</v-click>

</div>

<div>

<v-click="2">

```yaml
# Run tests
test_job:
  stage: test
  image: node:$NODE_VERSION
  needs: [build_job]
  script:
    - echo "Running tests..."
    - npm test
    - npm run test:coverage
  artifacts:
    reports:
      junit: test-results.xml
      coverage: coverage/cobertura.xml
  coverage: '/Coverage: \d+\.\d+%/'

# Deploy application  
deploy_job:
  stage: deploy
  image: alpine:latest
  needs: [test_job]
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Deploying application..."
    - ls -la dist/
    - echo "Application deployed successfully!"
  environment:
    name: staging
    url: https://my-app-staging.example.com
  when: manual
  only:
    - main
```

</v-click>

</div>

</div>

<v-click="3">

<div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-400">

## 🎯 **Demo Highlights**
- **Artifacts**: Sharing build outputs between jobs
- **Coverage**: Displaying test coverage in GitLab UI  
- **Manual Deploy**: Requiring human approval for deployment
- **Environment**: Tracking deployment status

</div>

</v-click>

---
layout: two-cols-header
---

# Demo 2: Advanced Pipeline with Rules

<div class="mt-6">

## What We'll Add 🚀

<v-clicks>

- Smart workflow rules
- Branch-specific behavior
- Docker image building
- Security scanning

</v-clicks>

</div>

::left::

<v-click="5">

## Enhanced Workflow

```yaml
# Smart pipeline control
workflow:
  rules:
    # Run for main branch pushes
    - if: $CI_PIPELINE_SOURCE == "push" && 
          $CI_COMMIT_BRANCH == "main"
    # Run for merge requests
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
    # Run for tags
    - if: $CI_COMMIT_TAG
    # Don't run for draft commits
    - if: $CI_COMMIT_MESSAGE =~ /-draft$/
      when: never
    # Don't run otherwise  
    - when: never

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE
  DOCKER_TAG: $CI_COMMIT_SHORT_SHA
```

</v-click>

::right::

<v-click="6">

## Branch-specific Jobs

```yaml
# Fast feedback for MRs
mr_tests:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm run test:unit
    - npm run lint
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

# Full testing for main branch
full_tests:
  stage: test
  image: node:18
  script:
    - npm ci
    - npm test
    - npm run test:e2e
    - npm run security:audit
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    
# Release builds  
release_build:
  stage: deploy
  script:
    - echo "Creating release $CI_COMMIT_TAG"
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
      when: manual
```

</v-click>

---
layout: default  
---

# Demo 2: Docker Integration

<div class="grid grid-cols-2 gap-8">

<div>

## Docker Build & Push

<v-click="1">

```yaml
# Build Docker image
build_image:
  stage: build
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | 
      docker login -u $CI_REGISTRY_USER 
      --password-stdin $CI_REGISTRY
  script:
    - docker build -t $DOCKER_IMAGE:$DOCKER_TAG .
    - docker push $DOCKER_IMAGE:$DOCKER_TAG
    # Tag as latest if main branch
    - |
      if [[ "$CI_COMMIT_BRANCH" == "main" ]]; then
        docker tag $DOCKER_IMAGE:$DOCKER_TAG $DOCKER_IMAGE:latest
        docker push $DOCKER_IMAGE:latest
      fi
  artifacts:
    reports:
      dotenv: build.env
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_TAG
```

</v-click>

</div>

<div>

<v-click="2">

## Security Scanning

```yaml
# Container security scan
container_scan:
  stage: test
  image: docker:stable
  services:
    - docker:dind
  needs: [build_image]
  script:
    - docker run --rm -v /var/run/docker.sock:/var/run/docker.sock
      -v $PWD:/tmp/.cache/ aquasec/trivy:latest 
      image --format json --output /tmp/.cache/gl-container-scanning-report.json
      $DOCKER_IMAGE:$DOCKER_TAG
  artifacts:
    reports:
      container_scanning: gl-container-scanning-report.json
  allow_failure: true
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# SAST scanning
sast_scan:
  stage: test
  image: registry.gitlab.com/security-products/sast:latest
  script:
    - /analyzer run
  artifacts:
    reports:
      sast: gl-sast-report.json
  allow_failure: true
```

</v-click>

</div>

</div>

<v-click="3">

<div class="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">

## 🔒 **Security Integration**
- **Container Scanning**: Check for vulnerabilities in Docker images
- **SAST**: Static Application Security Testing
- **Results**: Integrated into GitLab Security Dashboard

</div>

</v-click>

---
layout: two-cols-header
---

# Demo 3: CI/CD Components in Action

<div class="mt-6">

## Creating a Reusable Component 🧩

<v-clicks>

- Build a Node.js testing component
- Publish to GitLab registry
- Use across multiple projects
- Version management

</v-clicks>

</div>

::left::

<v-click="5">

## Component Definition

```yaml
# Component project .gitlab-ci.yml
---
spec:
  inputs:
    node-version:
      description: Node.js version
      type: string
      default: "18"
    test-command:
      description: Test command to run
      type: string
      default: "npm test"
    enable-lint:
      description: Run linting
      type: boolean  
      default: true
    coverage-threshold:
      description: Minimum coverage %
      type: number
      default: 80
---

# Component implementation
node-ci:
  image: node:$[[ inputs.node-version ]]
  before_script:
    - npm ci
  script:
    - |
      if [[ "$[[ inputs.enable-lint ]]" == "true" ]]; then
        echo "Running linter..."
        npm run lint
      fi
    - echo "Running tests..."
    - $[[ inputs.test-command ]]
    - |
      if [[ "$[[ inputs.coverage-threshold ]]" -gt 0 ]]; then
        echo "Checking coverage threshold: $[[ inputs.coverage-threshold ]]%"
        npm run test:coverage:check -- --threshold=$[[ inputs.coverage-threshold ]]
      fi
```

</v-click>

::right::

<v-click="6">

## Using the Component

```yaml  
# Project A - Basic usage
include:
  - component: gitlab.com/my-group/node-ci-component@v1.0.0
    inputs:
      node-version: "18"
      test-command: "npm test"

# Project B - Advanced usage  
include:
  - component: gitlab.com/my-group/node-ci-component@v1.0.0
    inputs:
      node-version: "20"
      test-command: "npm run test:all" 
      enable-lint: true
      coverage-threshold: 90

# Project C - Multiple configurations
include:
  - component: gitlab.com/my-group/node-ci-component@v1.0.0
    inputs:
      node-version: "18"
      test-command: "npm run test:unit"
      enable-lint: false
      
  - component: gitlab.com/my-group/node-ci-component@v1.0.0
    inputs:
      node-version: "18"  
      test-command: "npm run test:e2e"
      enable-lint: false
      coverage-threshold: 0
```

</v-click>

---


# Demo 3: Component Management

<div class="grid grid-cols-2 gap-8">

<div>

## Component Release Process

<v-click="1">

```yaml
# Component project pipeline
stages:
  - test
  - validate  
  - release

# Test component with examples
test_component:
  stage: test
  trigger:
    include: 
      - local: examples/basic.yml
      - local: examples/advanced.yml
    strategy: depend

# Validate component specification  
validate_component:
  stage: validate
  image: registry.gitlab.com/gitlab-org/ci-cd/pipeline-authoring/gitlab-ci-lsp:latest
  script:
    - gitlab-ci-validate .gitlab-ci.yml

# Create release
create_release:  
  stage: release
  image: registry.gitlab.com/gitlab-org/release-cli:latest
  script:
    - echo "Creating release $CI_COMMIT_TAG"
  release:
    name: 'Release $CI_COMMIT_TAG'
    description: 'Release created using the release-cli'
    tag_name: $CI_COMMIT_TAG
    ref: $CI_COMMIT_SHA
  rules:
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
```

</v-click>

</div>

<div>

<v-click="2">

## Component Evolution

```yaml
# v1.0.0 - Basic functionality
spec:
  inputs:
    node-version:
      type: string
      default: "18"

# v1.1.0 - Added linting  
spec:
  inputs:
    node-version:
      type: string
      default: "18"
    enable-lint:
      type: boolean
      default: true

# v2.0.0 - Breaking changes (new input structure)
spec:
  inputs:
    runtime:
      type: object
      properties:
        node-version:
          type: string
          default: "18"
        package-manager:
          type: string
          options: [npm, yarn, pnpm]
          default: npm
```

</v-click>

<v-click="3">

## Version Pinning Strategies

```yaml
# Production: Pin exact version
include:
  - component: my-group/node-ci@v1.2.1

# Staging: Use major version  
include:
  - component: my-group/node-ci@v1
    
# Development: Use latest
include:
  - component: my-group/node-ci@latest
```

</v-click>

</div>

</div>

<v-click="4">

<div class="mt-8 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border-l-4 border-purple-400">

## 🎯 **Component Best Practices**
- **Semantic Versioning**: Clear version management
- **Example Projects**: Demonstrate component usage
- **Documentation**: Comprehensive README and examples
- **Testing**: Validate component behavior thoroughly

</div>

</v-click>

---


# Demo 4: Monitoring & Observability

<div class="grid grid-cols-2 gap-8">

<div>

## Pipeline Analytics

<v-click="1">

```yaml
# Enhanced pipeline with metrics
variables:
  PIPELINE_START_TIME: $CI_PIPELINE_CREATED_AT

before_script:
  - echo "Pipeline started at $PIPELINE_START_TIME"
  - echo "Job $CI_JOB_NAME starting..."

after_script:
  - echo "Job $CI_JOB_NAME completed"
  - echo "Duration: $CI_JOB_STARTED_AT to $(date -Iseconds)"

# Collect build metrics
build_with_metrics:
  stage: build
  script:
    - echo "BUILD_START=$(date +%s)" >> metrics.env
    - npm ci
    - npm run build  
    - echo "BUILD_END=$(date +%s)" >> metrics.env
    - echo "BUILD_SIZE=$(du -sh dist/ | cut -f1)" >> metrics.env
  artifacts:
    reports:
      dotenv: metrics.env
```

</v-click>

</div>

<div>

<v-click="2">

## Notification Integration

```yaml
# Slack notifications
notify_slack:
  stage: .post
  image: curlimages/curl:latest
  script:
    - |
      curl -X POST -H 'Content-type: application/json' \
      --data "{
        'text': 'Pipeline $CI_PIPELINE_STATUS for $CI_PROJECT_NAME',
        'blocks': [
          {
            'type': 'section',
            'text': {
              'type': 'mrkdwn', 
              'text': '*Pipeline $CI_PIPELINE_STATUS*\nProject: $CI_PROJECT_NAME\nBranch: $CI_COMMIT_BRANCH\nCommit: $CI_COMMIT_SHORT_SHA'
            }
          }
        ]
      }" \
      $SLACK_WEBHOOK_URL
  rules:
    - if: $CI_PIPELINE_SOURCE != "schedule"
      when: always

# Email notifications (configured in project settings)
# Teams integration (via webhook)  
# Custom dashboard updates
```

</v-click>

<v-click="3">

## Performance Tracking

```yaml
# Performance benchmarks
performance_test:
  stage: test
  script:
    - npm run build:prod
    - npm run test:performance
    - |
      echo "BUNDLE_SIZE=$(stat -f%z dist/main.js)" >> performance.env
      echo "LOAD_TIME=$(npm run test:lighthouse -- --output=json | jq '.audits.interactive.numericValue')" >> performance.env  
  artifacts:
    reports:
      dotenv: performance.env
      performance: performance-report.json
```

</v-click>

</div>

</div>

<v-click="4">

<div class="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border-l-4 border-orange-400">

## 📊 **Observability Benefits** 
- **Pipeline Metrics**: Track build times and success rates
- **Real-time Notifications**: Immediate feedback on pipeline status  
- **Performance Monitoring**: Track application performance over time
- **Historical Analysis**: Identify trends and optimization opportunities

</div>

</v-click>

---
layout: center
class: text-center
---

# Demo Summary 🎉

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-2 gap-8">

<div class="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## ✅ **What We Built**

<div class="text-left mt-4 space-y-2">

- **Basic Pipeline**: Build → Test → Deploy
- **Advanced Rules**: Smart workflow control  
- **Docker Integration**: Container builds & security
- **CI/CD Components**: Reusable building blocks

</div>

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">

## 🎯 **Key Takeaways**

<div class="text-left mt-4 space-y-2">

- **Start Simple**: Basic pipeline first
- **Iterate & Improve**: Add complexity gradually
- **Use Components**: Don't reinvent the wheel
- **Monitor & Optimize**: Track pipeline performance

</div>

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Ready to plan your migration? 🚀
  </span>
</div>