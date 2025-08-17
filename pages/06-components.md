---
layout: section
---

# CI/CD Components

## Reusable Building Blocks

---

# What are CI/CD Components?

## Evolution of CI/CD Configuration

<v-clicks>

- **Templates**: Static, limited customization
- **Includes**: Better, but still not flexible enough
- **Components**: Dynamic, reusable, versioned! 🎯

</v-clicks>

## Key Benefits

<v-clicks>

- **Reusability**: Write once, use everywhere
- **Versioning**: Stable, predictable releases
- **Parameterization**: Flexible input handling
- **Testability**: Components can be thoroughly tested
- **Discoverability**: CI/CD Catalog for sharing
- **Security**: Centralized security updates

</v-clicks>

---
layout: two-cols
layoutClass: gap-8
---

## Traditional Approach

```yaml
# Duplicated configuration across projects
test_job_1:
  image: node:18
  before_script:
    - npm ci
    - npm run lint
  script:
    - npm test
  artifacts:
    reports:
      junit: test-results.xml

test_job_2:
  image: node:18
  before_script:
    - npm ci
    - npm run lint
  script:
    - npm run test:integration
  artifacts:
    reports:
      junit: integration-results.xml
```

::right::

## Component Approach

```yaml
# Using a component
include:
  - component: gitlab.com/components/node-testing@v2.1.0
    inputs:
      node-version: "18"
      test-command: "npm test"
      lint: true

  - component: gitlab.com/components/node-testing@v2.1.0
    inputs:
      node-version: "18"
      test-command: "npm run test:integration"
      lint: false
      output-file: "integration-results.xml"
```

---
layout: default
---

# Component Anatomy

## Component Definition

```yaml
# .gitlab-ci.yml in component project
# Component header with spec
---
spec:
  inputs:
    docker-image:
      description: Docker image to build
      type: string
    registry:
      description: Container registry
      type: string
      default: $CI_REGISTRY
    push:
      description: Push image to registry
      type: boolean
      default: true
---
# Docker build component
# Component jobs using inputs
docker-build:
  image: docker:latest
  services:
    - docker:dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - echo $CI_REGISTRY_PASSWORD | docker login -u $CI_REGISTRY_USER --password-stdin $[[ inputs.registry ]]
  script:
    - docker build -t $[[ inputs.registry ]]/$[[ inputs.docker-image ]] .
    - |
      if [[ "$[[ inputs.push ]]" == "true" ]]; then
        docker push $[[ inputs.registry ]]/$[[ inputs.docker-image ]]
      fi
```

---

## Using the Component

```yaml
# In your project .gitlab-ci.yml
include:
  - component: gitlab.com/my-group/docker-build-component@v1.0.0
    inputs:
      docker-image: my-app:$CI_COMMIT_SHA
      push: true

# Or with different configurations
include:
  - component: gitlab.com/my-group/docker-build-component@v1.0.0
    inputs:
      docker-image: my-app:latest
      registry: registry.hub.docker.com/myuser
      push: false
```

---
layout: default
---

# Advanced Component Patterns

<div class="grid grid-cols-2 gap-8">

<div>

## Conditional Logic

<v-click at="1">

```yaml
---
spec:
  inputs:
    environment:
      type: string
      options: [staging, production]
---
deploy:
  script:
    - echo "Deploying to $[[ inputs.environment ]]"
    - |
      if [[ "$[[ inputs.environment ]]" == "production" ]]; then
        ./deploy-production.sh
      else
        ./deploy-staging.sh
      fi
  rules:
    - if: $[[ inputs.environment ]] == "production"
      when: manual
    - when: on_success
```

</v-click>

</div>

<div>

<v-click at="2">

## Multi-template Components

```yaml
---
spec:
  inputs:
    include-build:
      type: boolean
      default: true
    include-test:
      type: boolean
      default: true
---
# Include multiple templates conditionally
$[[ inputs.include-build ]]:
  include:
    - local: templates/build.yml

$[[ inputs.include-test ]]:
  include:
    - local: templates/test.yml
```

</v-click>

</div>

</div>

<!--
TODO: is last example correct?
-->
