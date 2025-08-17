# Advanced Features

<div v-motion :initial="{ scale: 1.2, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" class="text-center">
  <div class="text-6xl mb-8">⚡</div>
  <h2 class="text-3xl font-bold text-purple-600">Power up your pipelines!</h2>
</div>

---

# Rules: Modern Job Control

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Rules** replace `only/except` with powerful conditional logic

</div>

<div class="grid grid-cols-2 gap-8">
<div v-click="1">

**❌ Old Way (`only/except`):**

```yaml
deploy:
  script: echo "deploying"
  only:
    - main
    - merge_requests
  except:
    - schedules
```

_Problems:_

- Limited logic
- Hard to read complex conditions
- No variable support

</div>

<div v-click="2">

**✅ New Way (`rules`):**

```yaml
deploy:
  script: echo "deploying"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
      when: manual
    - if: $CI_PIPELINE_SOURCE == "schedule"
      when: never
```

_Benefits:_

- Complex conditions with variables
- Multiple rules with different behaviors
- Clear precedence and logic

</div>
</div>

---

# Rules Examples

<div v-click="1">

**Branch-based Deployment:**

```yaml
deploy:staging:
  script: deploy-to-staging.sh
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "develop"

deploy:production:
  script: deploy-to-production.sh
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
```

</div>

<div v-click="2">

**File Change Detection:**

```yaml
test:frontend:
  script: npm run test
  rules:
    - changes:
        - "frontend/**/*"
        - "package*.json"

test:backend:
  script: go test ./...
  rules:
    - changes:
        - "backend/**/*.go"
        - "go.mod"
        - "go.sum"
```

</div>

---

# Rule Operators & Functions

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }">

```yaml
# Comparison operators
rules:
  - if: $CI_COMMIT_BRANCH == "main"           # Equality
  - if: $CI_COMMIT_BRANCH != "main"           # Inequality
  - if: $CI_COMMIT_TAG =~ /^v\d+/             # Regex match
  - if: $CI_COMMIT_TAG !~ /^v\d+/             # Regex no match

# Logical operators
rules:
  - if: $CI_COMMIT_BRANCH == "main" && $CI_PIPELINE_SOURCE != "schedule"
  - if: $CI_COMMIT_BRANCH == "develop" || $CI_COMMIT_BRANCH == "staging"

# Existence checks
rules:
  - if: $CUSTOM_VARIABLE                      # Variable exists
  - if: $CUSTOM_VARIABLE == null              # Variable doesn't exist

# Complex example
rules:
  - if: $CI_MERGE_REQUEST_IID && $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
    when: manual
    allow_failure: true
```

</div>

<div v-motion :initial="{ x: -30, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 400 } }" class="mt-6 p-4 bg-blue-50 rounded-lg">

**💡 Pro Tip:** Rules are evaluated top-to-bottom. First match wins!

</div>

---

# Workflows: Pipeline Control

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Workflow** controls when entire pipelines run

</div>

<div v-click="1">

```yaml
workflow:
  rules:
    # Run for merge requests targeting main
    - if: $CI_MERGE_REQUEST_TARGET_BRANCH_NAME == "main"
    # Run for main branch commits
    - if: $CI_COMMIT_BRANCH == "main"
    # Run for version tags
    - if: $CI_COMMIT_TAG =~ /^v\d+\.\d+\.\d+$/
    # Don't run for other cases
    - when: never

stages:
  - build
  - test
  - deploy

# Jobs only run if pipeline runs
build-job:
  stage: build
  script: echo "Building..."
```

</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 400 } }" class="mt-6 grid grid-cols-2 gap-6">
  <div class="bg-green-50 p-4 rounded-lg">
    <h4 class="font-bold text-green-800 mb-2">✅ Benefits</h4>
    <ul class="text-sm space-y-1">
      <li>• Prevent duplicate MR pipelines</li>
      <li>• Control resource usage</li>
      <li>• Implement security policies</li>
      <li>• Branch-specific workflows</li>
    </ul>
  </div>
  
  <div class="bg-yellow-50 p-4 rounded-lg">
    <h4 class="font-bold text-yellow-800 mb-2">⚠️ Common Pattern</h4>
    <p class="text-sm">Use workflow to prevent both branch and MR pipelines for the same commit</p>
  </div>
</div>

---

# Includes: Modular CI/CD

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

**Include** enables code reuse and organization

</div>

<div v-click="1">

```yaml
# Main .gitlab-ci.yml
include:
  # Local files
  - local: "ci/build-jobs.yml"
  - local: "ci/test-jobs.yml"
  - local: "ci/deploy-jobs.yml"

  # Remote files
  - remote: "https://example.com/ci-templates/docker.yml"

  # GitLab templates
  - template: "Security/SAST.gitlab-ci.yml"
  - template: "Security/Dependency-Scanning.gitlab-ci.yml"

  # Other projects
  - project: "group/ci-templates"
    file: "/templates/node-build.yml"
    ref: "v2.1.0"

stages:
  - build
  - test
  - security
  - deploy
```

</div>

---

# Include Types & Organization

<div class="grid grid-cols-2 gap-8">
<div v-click="1">

**Local Organization:**

```
project/
├── .gitlab-ci.yml
└── ci/
    ├── build.yml
    ├── test.yml
    ├── deploy.yml
    └── variables.yml
```

```yaml
# ci/build.yml
.build-template:
  image: node:18
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]

build-frontend:
  extends: .build-template
  variables:
    NODE_ENV: production
```

</div>

<div v-click="2">

**Remote Templates:**

```yaml
# Shared across organization
include:
  - project: "devops/ci-templates"
    file:
      - "/docker/build.yml"
      - "/security/scanning.yml"
      - "/deploy/kubernetes.yml"
    ref: "v1.5.0"

# Use the templates
build-app:
  extends: [.docker-build]
  variables:
    IMAGE_NAME: my-app

scan-app:
  extends: [.security-scan]

deploy-app:
  extends: [.k8s-deploy]
  variables:
    NAMESPACE: production
```

</div>
</div>

---

# Template Inheritance with `extends`

<div v-motion :initial="{ scale: 0.95, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">

```yaml
# Define reusable templates
.deploy-template:
  image: alpine/k8s:latest
  before_script:
    - kubectl config use-context $KUBE_CONTEXT
  script:
    - kubectl apply -f k8s/
    - kubectl rollout status deployment/$APP_NAME

.notification-template:
  after_script:
    - send-notification.sh "Deployment completed"

# Use templates in jobs
deploy:staging:
  extends:
    - .deploy-template
    - .notification-template
  variables:
    KUBE_CONTEXT: staging
    APP_NAME: myapp-staging
  environment:
    name: staging

deploy:production:
  extends: [.deploy-template, .notification-template]
  variables:
    KUBE_CONTEXT: production
    APP_NAME: myapp-prod
  environment:
    name: production
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

</div>

---

# YAML Anchors for Complex Reuse

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }">

```yaml
# Define anchors
.docker-setup: &docker-setup
  image: docker:24
  services:
    - docker:24-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker info

.node-cache: &node-cache
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
    policy: pull-push

# Use anchors
build:docker:
  <<: *docker-setup
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

test:unit:
  image: node:18
  <<: *node-cache
  script:
    - npm ci
    - npm test

test:integration:
  <<: [*docker-setup, *node-cache] # Multiple anchors
  script:
    - docker-compose up -d
    - npm run test:integration
```

</div>

---

# Advanced Pipeline Patterns

<div v-click="1">

**Parent-Child Pipelines:**

```yaml
# Parent pipeline triggers child pipelines
trigger:frontend:
  trigger:
    include: frontend/.gitlab-ci.yml
    strategy: depend
  rules:
    - changes: ["frontend/**/*"]

trigger:backend:
  trigger:
    include: backend/.gitlab-ci.yml
    strategy: depend
  rules:
    - changes: ["backend/**/*"]
```

</div>

<div v-click="2">

**Multi-Project Pipelines:**

```yaml
# Trigger pipeline in another project
deploy:infrastructure:
  trigger:
    project: infrastructure/terraform
    branch: main
  variables:
    ENVIRONMENT: production
    APP_VERSION: $CI_COMMIT_TAG
```

</div>

<div v-click="3">

**Dynamic Pipeline Generation:**

```yaml
generate-pipeline:
  script:
    - python generate-pipeline.py > generated-pipeline.yml
  artifacts:
    reports:
      dotenv: variables.env

child-pipeline:
  trigger:
    include:
      - artifact: generated-pipeline.yml
        job: generate-pipeline
```

</div>
