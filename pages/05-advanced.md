---
layout: section
---

# Advanced Features

## Variables, Artifacts, Caching & More

---
layout: two-cols-header
---

# Variables - Pipeline Configuration

<div class="grid grid-cols-2 gap-8">

<div>

## Types of Variables

- **Predefined**: Provided by GitLab automatically
  - `$CI_PROJECT_NAME`, `$CI_PROJECT_NAMESPACE`, etc.
- **Custom**: Defined by you at different levels
  - Group, project, etc.
- **File-based**: Loaded from external files
  - `artifacts:reports:dotenv`
- **Protected**: Only available on protected branches
- **Masked**: Hidden in job logs

</div>

<div v-click>

## Variables Hierarchy

1. **Instance** (Admin-level): Applies to all projects
2. **Group** (Group-level): Applies to all projects in group
3. **Project** (Project-level): Applies to specific project
4. **Pipeline** (Runtime): Passed when running manually
5. **Job** (Job-level): Defined in .gitlab-ci.yml

</div>

</div>

<!--
[click] Higher priority overrides lower

TODO: 4. Manual overwrites runner?
-->

---

# Variable Usage Patterns

```yaml {*|3,17|5-6|4,10-14}
# Global variables for entire pipeline
variables:
  NODE_VERSION: "18"
  DOCKER_REGISTRY: "registry.gitlab.com"
  # Dynamic Variables
  APP_VERSION: $CI_COMMIT_SHORT_SHA

# Use in any job
build:
  # Job-specific Variables
  variables:
    APP_NAME: "my-awesome-app"
  script:
    - docker build -t $DOCKER_REGISTRY/$APP_NAME:$APP_VERSION .

test:
  image: node:$NODE_VERSION
  script:
    - npm test
```

<!--
- [click] Expand by runner
- [click] Expand by GitLab then runner
- [click] Use global and job level vars
-->

---

# Artifacts - Sharing Data Between Jobs

```yaml {*|2-6|8-9|10-11|10,12-18|12,19}
build:
  script:
    - npm run build
  artifacts:
    paths:
      - dist/ # Built application

test:
  needs: [build]
  script:
    - ls -la dist/ # Can access artifacts
    - ./run-tests.sh
  artifacts:
    reports:
      junit: test-results.xml
      coverage: coverage/cobertura.xml
    paths:
      - test-results/
  coverage: '/Coverage: \d+\.\d+%/'
```

---
hide: true
---

# Caching - Speed Up Your Pipelines

```yaml
# Global cache configuration
variables:
  CACHE_VERSION: v1

build:
  cache:
    key: $CACHE_VERSION # Cache identifier
    paths:
      - node_modules/ # What to cache
      - .npm/ # NPM cache
    policy: pull-push # Download and upload
  script:
    - npm ci --cache .npm # Use cache location
    - npm run build

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

<!--
TODO: something is wrong.
-->

---

# Job Control & Optimization

<!-- ## Job Dependencies -->

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
  needs:
    - build_backend
  script: ./test-unit.sh

test_integration:
  stage: test
  needs: [build_frontend, build_backend]
  script: ./test-integration.sh

deploy:
  stage: deploy
  needs: [test_unit, test_integration]
  script: ./deploy.sh
```
