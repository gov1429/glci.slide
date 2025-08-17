---
layout: section
---

# CI/CD Components
## Reusable Building Blocks

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">The future of CI/CD configuration...</span>
</div>

---
layout: two-cols-header  
---

# What are CI/CD Components? 🧩

<div class="mt-6">

## Evolution of CI/CD Configuration

<v-clicks>

- **Templates**: Static, limited customization
- **Includes**: Better, but still not flexible enough  
- **Components**: Dynamic, reusable, versioned! 🎯

</v-clicks>

</div>

::left::

<v-click="4">

## Traditional Approach ❌

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

</v-click>

::right::

<v-click="5">

## Component Approach ✅

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

<div class="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

🎯 **DRY**: Don't Repeat Yourself!

</div>

</v-click>

---
layout: default
---

# Component Benefits & Architecture

<div class="grid grid-cols-2 gap-8">

<div>

## Key Benefits 🌟

<v-clicks>

- **🔄 Reusability**: Write once, use everywhere
- **📦 Versioning**: Stable, predictable releases  
- **🎛️ Parameterization**: Flexible input handling
- **🧪 Testability**: Components can be thoroughly tested
- **🌍 Discoverability**: CI/CD Catalog for sharing
- **🔒 Security**: Centralized security updates

</v-clicks>

<v-click="7">

## Component Structure 📁

```
my-component-project/
├── .gitlab-ci.yml           # Component definition
├── README.md               # Documentation
├── templates/
│   ├── build.yml          # Template files
│   └── test.yml
└── examples/              # Usage examples
    └── basic-usage.yml
```

</v-click>

</div>

<div>

<v-click="8">

## Component Anatomy

```yaml
# Component header with spec
---
spec:
  inputs:
    node-version:
      description: Node.js version to use
      type: string
      default: "18"
    test-command:
      description: Command to run tests
      type: string  
      default: "npm test"
    enable-coverage:
      description: Enable code coverage
      type: boolean
      default: true
---

# Component jobs using inputs
node-test:
  image: node:$[[ inputs.node-version ]]
  script:
    - npm ci
    - $[[ inputs.test-command ]]
  coverage: $[[ inputs.enable-coverage && '/Coverage: \\d+\\.\\d+%/' || '' ]]
  artifacts:
    when: $[[ inputs.enable-coverage ]]
    reports:
      coverage: coverage/cobertura.xml
```

</v-click>

</div>

</div>

---
layout: default
---

# Creating Your First Component

<div class="grid grid-cols-2 gap-8">

<div>

## Step 1: Component Definition

<v-click="1">

```yaml
# .gitlab-ci.yml in component project
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

</v-click>

</div>

<div>

<v-click="2">

## Step 2: Using the Component

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

</v-click>

<v-click="3">

## Step 3: Release & Tag

```bash
# Create version tags in component project
git tag v1.0.0
git push origin v1.0.0

# Semantic versioning
git tag v1.0.1  # Bug fixes
git tag v1.1.0  # New features  
git tag v2.0.0  # Breaking changes
```

</v-click>

<v-click="4">

## Step 4: Publish to Catalog

```yaml
# Enable catalog in component project settings
# Add to CI/CD Catalog visibility: Public/Internal/Private

# Component will appear in:
# GitLab → Explore → CI/CD Catalog
```

</v-click>

</div>

</div>

---
layout: default
---

# Advanced Component Patterns

<div class="grid grid-cols-2 gap-8">

<div>

## Conditional Logic in Components

<v-click="1">

```yaml
---
spec:
  inputs:
    environment:
      type: string
      options: [staging, production]
    run-tests:
      type: boolean
      default: true
    security-scan:
      type: boolean
      default: false
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

# Conditional job inclusion
test:
  script: npm test
  rules:
    - if: $[[ inputs.run-tests ]]

security:
  script: ./security-scan.sh
  rules:
    - if: $[[ inputs.security-scan ]]
```

</v-click>

</div>

<div>

<v-click="2">

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
    include-deploy:
      type: boolean
      default: false
---

# Include multiple templates conditionally
$[[ inputs.include-build ]]:
  include:
    - local: templates/build.yml

$[[ inputs.include-test ]]:  
  include:
    - local: templates/test.yml

$[[ inputs.include-deploy ]]:
  include:
    - local: templates/deploy.yml
```

</v-click>

<v-click="3">

## Component Composition

```yaml
# Compose multiple components
include:
  # Build component
  - component: gitlab.com/components/node-build@v1.2.0
    inputs:
      node-version: "18"
      build-command: "npm run build:prod"
      
  # Test component
  - component: gitlab.com/components/node-test@v2.0.0
    inputs:
      node-version: "18"  
      test-types: ["unit", "integration"]
      
  # Security component
  - component: gitlab.com/components/security-scan@v1.1.0
    inputs:
      scan-types: ["sast", "dependency"]
      
  # Deploy component  
  - component: gitlab.com/components/kubernetes-deploy@v3.0.0
    inputs:
      namespace: production
      replicas: 3
```

</v-click>

</div>

</div>

---
layout: default
---

# Real-world Component Examples

<div class="grid grid-cols-2 gap-8">

<div>

## Node.js Testing Component

<v-click="1">

```yaml
---
spec:
  inputs:
    node-version:
      type: string
      default: "18"
    package-manager:
      type: string
      options: [npm, yarn, pnpm]
      default: npm
    test-coverage:
      type: boolean
      default: true
    cache-key:
      type: string
      default: npm-$CI_COMMIT_REF_SLUG
---

install-deps:
  image: node:$[[ inputs.node-version ]]
  cache:
    key: $[[ inputs.cache-key ]]
    paths: [node_modules/]
  script:
    - |
      case "$[[ inputs.package-manager ]]" in
        npm) npm ci ;;
        yarn) yarn install --frozen-lockfile ;;
        pnpm) pnpm install --frozen-lockfile ;;
      esac

run-tests:
  image: node:$[[ inputs.node-version ]]  
  needs: [install-deps]
  cache:
    key: $[[ inputs.cache-key ]]
    paths: [node_modules/]
    policy: pull
  script:
    - |
      if [[ "$[[ inputs.test-coverage ]]" == "true" ]]; then
        npm run test:coverage
      else
        npm test
      fi
  artifacts:
    when: $[[ inputs.test-coverage ]]
    reports:
      coverage: coverage/cobertura.xml
```

</v-click>

</div>

<div>

<v-click="2">

## Kubernetes Deployment Component

```yaml
---
spec:
  inputs:
    app-name:
      type: string
    namespace:
      type: string
      default: default
    image-tag:
      type: string
      default: $CI_COMMIT_SHA
    replicas:
      type: number
      default: 2
    environment:
      type: string
      options: [staging, production]
    health-check:
      type: boolean
      default: true
---

deploy-k8s:
  image: bitnami/kubectl:latest
  script:
    # Substitute variables in manifests
    - envsubst < k8s/deployment.yaml > deployment-processed.yaml
    - envsubst < k8s/service.yaml > service-processed.yaml
    
    # Apply manifests
    - kubectl apply -f deployment-processed.yaml -n $[[ inputs.namespace ]]
    - kubectl apply -f service-processed.yaml -n $[[ inputs.namespace ]]
    
    # Wait for rollout (if enabled)
    - |
      if [[ "$[[ inputs.health-check ]]" == "true" ]]; then
        kubectl rollout status deployment/$[[ inputs.app-name ]] -n $[[ inputs.namespace ]] --timeout=300s
      fi
  environment:
    name: $[[ inputs.environment ]]
    url: https://$[[ inputs.app-name ]]-$[[ inputs.environment ]].example.com
  variables:
    APP_NAME: $[[ inputs.app-name ]]
    IMAGE_TAG: $[[ inputs.image-tag ]]
    REPLICAS: $[[ inputs.replicas ]]
```

</v-click>

</div>

</div>

---
layout: default
---

# Component Discovery & Management

<div class="grid grid-cols-2 gap-8">

<div>

## CI/CD Catalog 📚

<v-click="1">

<div class="space-y-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Discover Components**
- Browse by category
- Search functionality  
- Star popular components

</div>

<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Component Details**
- Documentation & examples
- Version history
- Usage statistics

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Quality Indicators**
- Test coverage
- Community ratings
- Maintenance status

</div>

</div>

</v-click>

<v-click="2">

## Popular Component Categories

<div class="mt-4 space-y-2">

- **🏗️ Build & Package**: Docker, Maven, Gradle
- **🧪 Testing**: Unit, Integration, E2E
- **🔒 Security**: SAST, DAST, Dependency scanning  
- **🚀 Deployment**: Kubernetes, Cloud platforms
- **📊 Quality**: Code coverage, Linting
- **🔔 Notifications**: Slack, Teams, Email

</div>

</v-click>

</div>

<div>

<v-click="3">

## Version Management

```yaml
# Specific version (recommended for production)
include:
  - component: gitlab.com/components/node-build@v2.1.0
    
# Major version (gets latest minor/patch)
include:
  - component: gitlab.com/components/node-build@v2
    
# Latest (not recommended for production)  
include:
  - component: gitlab.com/components/node-build@latest
    
# Branch (for development)
include:
  - component: gitlab.com/components/node-build@main
```

</v-click>

<v-click="4">

## Component Testing Strategy

```yaml
# In component project
test-component:
  trigger:
    include:
      - local: examples/basic-usage.yml
      - local: examples/advanced-usage.yml
    strategy: depend
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

# Integration tests with real projects
integration-test:
  trigger:
    project: my-group/test-project
    branch: main
    strategy: depend
  variables:
    COMPONENT_VERSION: $CI_COMMIT_SHA
```

</v-click>

<v-click="5">

## Migration Path

<div class="space-y-2 text-sm">

<div class="flex items-center space-x-2">
  <div class="w-4 h-4 bg-blue-500 rounded-full"></div>
  <span>**Phase 1**: Identify repetitive patterns</span>
</div>

<div class="flex items-center space-x-2">  
  <div class="w-4 h-4 bg-green-500 rounded-full"></div>
  <span>**Phase 2**: Create components for common tasks</span>
</div>

<div class="flex items-center space-x-2">
  <div class="w-4 h-4 bg-purple-500 rounded-full"></div>
  <span>**Phase 3**: Migrate projects gradually</span>
</div>

<div class="flex items-center space-x-2">
  <div class="w-4 h-4 bg-orange-500 rounded-full"></div>
  <span>**Phase 4**: Optimize and iterate</span>
</div>

</div>

</v-click>

</div>

</div>

---
layout: center
class: text-center
---

# Components = CI/CD Evolution! 🚀

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-3 gap-6">

<div class="p-6 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## 🔄 **Reusability**
- Write once, use everywhere
- Consistent patterns
- Reduced duplication

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">

## 📦 **Versioning** 
- Stable releases
- Controlled updates
- Rollback capability

</div>

<div class="p-6 border rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">

## 🎛️ **Flexibility**
- Dynamic inputs
- Conditional logic
- Composable architecture

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Time for hands-on demos! 🛠️
  </span>
</div>