# Services & Docker Integration

<div class="grid grid-cols-2 gap-8">

<div>

## Using Services 🐳

<v-click at="1">

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

<div v-click="2">

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

<v-click at="3">

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

# Job Control & Optimization

## Parallel Jobs

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

## Resource Management

```yaml
# Resource limits
heavy_build:
  script: ./heavy-build.sh
  timeout: 2h # Job timeout
  retry:
    max: 3 # Retry failed jobs
    when:
      - runner_system_failure
      - stuck_or_timeout_failure

# Resource requirements
gpu_training:
  tags:
    - gpu # Requires GPU runner
    - high-memory # Requires high memory
  script: ./train-model.sh

# Interruptible jobs
build_cache:
  interruptible: true # Can be canceled by newer pipelines
  script:
    - npm install
    - npm run build
```
