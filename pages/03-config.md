---
layout: section
---

# Writing .gitlab-ci.yml

## Configuration as Code

---

# .gitlab-ci.yml Basics

## Minimal Example

<div class="grid grid-cols-2 gap-8">

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

<div v-click class="tip-block p-4 max-h-fit">

- **Indentation**: Use 2 spaces
- **Lists**: Use `-` for array items
- **Strings**: Quote when containing special chars
- **Comments**: Start with `#`

</div>

</div>

<!--
TODO: line feed

[click] Do not use tabs! Superset of JSON; when in doubt, quote it
-->

---
layout: default
---

# Essential Job Keywords

```yaml {*|2|4-5|9-10|11-14|15-16|17|18|19-20|21-27|28-}{maxHeight:'85%'}
my-job:
  image: node:18 # Docker image
  stage: build # Stage assignment
  before_script: # Setup commands
    - echo "Starting build"
  script: # Commands to run
    - npm install
    - npm run build
  after_script: # Cleanup commands
    - echo "Build finished"
  only: # When to run (deprecated)
    - main
  except: # When NOT to run (deprecated)
    - develop
  rules: # Modern conditional logic
    - if: $CI_COMMIT_BRANCH == "main"
  when: manual # Execution trigger
  allow_failure: true # Continue on failure
  variables: # Job-specific variables
    NODE_ENV: production
  cache: # Cache dependencies
    paths:
      - node_modules/
  artifacts: # Save build outputs
    paths:
      - dist/
    expire_in: 1 week
  tags: # Select specific runners
    - docker
    - linux
```

<!--
- [click] Valid in `docker` executor
- [click] Are concatenated with `script`
- [click] Execute in a new shell, different context

- [click] Do not use; usually from old tutorials
- [click] `if` statement is `true`, add the job to the pipeline
- [click] when to trigger the job

- [click:2] Instance, group, project, project, etc.
- [click]
  - Use cache for dependencies, like packages you download from the internet
  - Use artifacts to pass intermediate build results between stages
-->

---

# Advanced Configuration Patterns

- **Global Configuration**

```yaml {*|-5|7-10|12-}
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

<!--
- [click] Apply keywords to all jobs
- [click] Apply variables to all jobs
- [click] Define stages of a pipeline
-->

---

# Advanced Configuration Patterns (cont.)

- **Hidden Jobs (Templates) With `extends`**

```yaml {*|2|2-8|10-|12,17|4-5,13-14,18-19}
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

<!--
- [click] Not processed by GitLab CI/CD; can be used as templates for reusable configuration
- [click] Job template
- [click:2] Use `extends` keyword
- [click] Will be overrode
-->

---

# Advanced Configuration Patterns (cont.)

- **Templates with YAML Anchors**

````md magic-move
```yaml {*|1-4|6-|7,11,1}
.deploy_template: &deploy
  stage: deploy
  script:
    - ./deploy.sh

deploy_staging:
  <<: *deploy
  environment: staging

deploy_production:
  <<: *deploy
  environment: production
  when: manual
```

```yaml {7-9,13-15}
.deploy_template: &deploy
  stage: deploy
  script:
    - ./deploy.sh

deploy_staging:
  stage: deploy
  script:
    - ./deploy.sh
  environment: staging

deploy_production:
  stage: deploy
  script:
    - ./deploy.sh
  environment: production
  when: manual
```
````

<!--
TODO: !reference tag.

- [click] `&`, an anchor
- [click:2] `*`, an alias; `<<`: map merging
-->
