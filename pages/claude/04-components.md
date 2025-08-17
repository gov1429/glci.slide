# GitLab CI/CD Components

<div v-motion :initial="{ y: -20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="text-center">
  <div class="text-6xl mb-8">🧩</div>
  <h2 class="text-3xl font-bold text-indigo-600">The future of reusable CI/CD!</h2>
</div>

---

# What are Components?

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-8">

**Components** are reusable, versioned, and validated CI/CD building blocks

</div>

<div class="grid grid-cols-2 gap-8">
<div v-click="1" class="bg-red-50 p-6 rounded-lg">
<h3 class="font-bold text-red-800 mb-4">❌ Traditional Includes</h3>

<!-- TODO: formatter bug here, need # between include and deploy-job -->

```yaml
include:
  - remote: "https://raw.../deploy.yml"
#
deploy-job:
  extends: .deploy-template
  variables:
    ENVIRONMENT: prod
```

**Problems:**

- No versioning control
- No input validation
- URL-based (fragile links)
- Poor discoverability
- No type safety

</div>

<div v-click="2" class="bg-green-50 p-6 rounded-lg">
<h3 class="font-bold text-green-800 mb-4">✅ Modern Components</h3>

```yaml
include:
  - component: gitlab.com/components/deploy@1.2.0
    inputs:
      environment: prod
      replicas: 3

deploy-app:
  extends: [.deploy]
```

**Benefits:**

- ✅ Semantic versioning
- ✅ Type-safe inputs
- ✅ Component registry
- ✅ Integrated documentation
- ✅ Input validation

</div>
</div>

---

# Component Architecture

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

Components follow a standardized structure with metadata and templates

</div>

<div class="grid grid-cols-2 gap-8">
  <div v-click="1">

**Directory Structure:**

```
my-component/
├── README.md
├── template.yml          # Component logic
├── .gitlab-ci.yml       # Metadata & spec
└── examples/
    ├── basic.yml
    └── advanced.yml
```

  </div>

  <div v-click="2">

**Component Metadata (.gitlab-ci.yml):**

```yaml
spec:
  inputs:
    environment:
      description: Target environment
      type: string
      default: staging
      options: [staging, production]
    replicas:
      description: Number of replicas
      type: number
      default: 1
    image_tag:
      description: Docker image tag
      type: string

include:
  - local: template.yml
```

  </div>
</div>

---

# Component Template

<div v-motion :initial="{ scale: 0.95, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">

```yaml
# template.yml - The actual component logic
spec:
  inputs:
    environment:
      type: string
      default: staging
    replicas:
      type: number
      default: 1
    image_tag:
      type: string
    kubernetes_namespace:
      type: string
      default: $[[ inputs.environment ]]

---
.deploy:
  image: bitnami/kubectl:latest
  before_script:
    - kubectl config use-context $KUBE_CONTEXT
  script:
    - |
      cat <<EOF | kubectl apply -f -
      apiVersion: apps/v1
      kind: Deployment
      metadata:
        name: $CI_PROJECT_NAME
        namespace: $[[ inputs.kubernetes_namespace ]]
      spec:
        replicas: $[[ inputs.replicas ]]
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
              image: $CI_REGISTRY_IMAGE:$[[ inputs.image_tag ]]
      EOF
  environment:
    name: $[[ inputs.environment ]]
```

</div>

---

# Using Components

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1 }" class="mb-6">

Simple, declarative usage with semantic versioning

</div>

<div v-click="1">

```yaml
# Consumer .gitlab-ci.yml
include:
  # Exact version (recommended for production)
  - component: gitlab.com/awesome-org/docker-build@2.1.0
    inputs:
      dockerfile: ./Dockerfile
      image_name: my-app
      platforms: ["linux/amd64", "linux/arm64"]

  # Compatible version (patch updates)
  - component: gitlab.com/awesome-org/kubernetes-deploy@~1.0
    inputs:
      environment: production
      namespace: my-app-prod
      replicas: 3
      health_check_path: /health

stages:
  - build
  - deploy

build-multiarch:
  extends: [.docker-build]

deploy-k8s:
  extends: [.deploy]
  needs: [build-multiarch]
  environment:
    name: production
    url: https://my-app.com
```

</div>

<div v-motion :initial="{ y: 20, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 300 } }" class="mt-6 p-4 bg-blue-50 rounded-lg">

**🎯 Version Formats:** `@1.0.0` (exact), `@~1.0` (compatible), `@^1.0` (minor updates), `@latest` (not recommended)

</div>

---

# Component Benefits

<div class="grid grid-cols-2 gap-8">
  <div v-motion :initial="{ x: -40, opacity: 0 }" :enter="{ x: 0, opacity: 1 }">
    
### For Users 🚀
<div class="space-y-3 text-sm">
  <div class="flex items-start gap-2">
    <span class="text-green-600 mt-1">✅</span>
    <span><strong>Faster setup</strong> - Pre-built, tested solutions</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-green-600 mt-1">✅</span>
    <span><strong>Battle-tested</strong> - Community validation</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-green-600 mt-1">✅</span>
    <span><strong>Type safety</strong> - Input validation prevents errors</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-green-600 mt-1">✅</span>
    <span><strong>Documentation</strong> - Integrated examples and docs</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-green-600 mt-1">✅</span>
    <span><strong>Security</strong> - Version pinning prevents supply chain attacks</span>
  </div>
</div>

  </div>

  <div v-motion :initial="{ x: 40, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 300 } }">
    
### For Authors 🎯
<div class="space-y-3 text-sm">
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1">🔄</span>
    <span><strong>Reusability</strong> - Write once, use everywhere</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1">📊</span>
    <span><strong>Analytics</strong> - Usage tracking and metrics</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1">🏷️</span>
    <span><strong>Discovery</strong> - Component registry visibility</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1">🔄</span>
    <span><strong>Versioning</strong> - Semantic versioning support</span>
  </div>
  <div class="flex items-start gap-2">
    <span class="text-blue-600 mt-1">👥</span>
    <span><strong>Community</strong> - Contributions and feedback</span>
  </div>
</div>

  </div>
</div>

---

# Real-World Component Examples

<div class="grid grid-cols-2 gap-8">
  <div v-click="1" class="bg-blue-50 p-6 rounded-lg">
    
**🐳 Docker Multi-Platform Build**
```yaml
include:
  - component: gitlab.com/components/docker@1.0.0
    inputs:
      platforms: ["linux/amd64", "linux/arm64"]
      push: true
      cache: true
```

_Features:_ BuildKit, multi-arch, registry integration, caching

  </div>

  <div v-click="2" class="bg-green-50 p-6 rounded-lg">
    
**☸️ Kubernetes Deployment**
```yaml  
include:
  - component: gitlab.com/components/k8s-deploy@2.1.0
    inputs:
      namespace: production
      helm_chart: ./chart
      values_file: values-prod.yaml
```

_Features:_ Helm integration, rollback support, health checks

  </div>

  <div v-click="3" class="bg-purple-50 p-6 rounded-lg">
    
**🔐 Security Scanning**
```yaml
include:
  - component: gitlab.com/components/security@1.5.0
    inputs:
      sast: true
      dependency_check: true
      container_scan: true
```

_Features:_ Multiple tools, vulnerability reports, policy enforcement

  </div>

  <div v-click="4" class="bg-orange-50 p-6 rounded-lg">
    
**📦 Package Publishing**
```yaml
include:
  - component: gitlab.com/components/npm-publish@1.2.0
    inputs:
      registry: https://registry.npmjs.org
      access: public
      provenance: true
```

_Features:_ Multi-registry, provenance, automated versioning

  </div>
</div>

---

# Creating Your First Component

<div v-click="1">

**Step 1: Component Structure**

```bash
mkdir my-awesome-component
cd my-awesome-component

# Create component files
touch .gitlab-ci.yml template.yml README.md
mkdir examples
```

</div>

<div v-click="2">

**Step 2: Define Inputs & Metadata**

```yaml
# .gitlab-ci.yml
spec:
  inputs:
    node_version:
      description: Node.js version to use
      type: string
      default: "18"
    run_tests:
      description: Whether to run tests
      type: boolean
      default: true
    build_command:
      description: Build command to run
      type: string
      default: "npm run build"

include:
  - local: template.yml
```

</div>

---

# Component Template Implementation

<div v-click="1">

```yaml
# template.yml
spec:
  inputs:
    node_version:
      type: string
      default: "18"
    run_tests:
      type: boolean
      default: true
    build_command:
      type: string
      default: "npm run build"

---
.node-setup:
  image: node:$[[ inputs.node_version ]]-alpine
  cache:
    key:
      files:
        - package-lock.json
    paths:
      - node_modules/
  before_script:
    - npm ci

.node-test:
  extends: [.node-setup]
  script:
    - npm test
  coverage: '/Coverage: \d+\.\d+%/'
  rules:
    - if: $[[ inputs.run_tests ]] == true

.node-build:
  extends: [.node-setup]
  script:
    - $[[ inputs.build_command ]]
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour
```

</div>

---

# Component Best Practices

<div class="grid grid-cols-2 gap-8">
<div v-motion :initial="{ x: -30, opacity: 0 }" :enter="{ x: 0, opacity: 1 }">
    
### Design Principles 🎨
- **Single responsibility** - One component, one purpose
- **Configurable** - Flexible inputs with sensible defaults
- **Composable** - Works well with other components
- **Idempotent** - Safe to run multiple times
- **Self-contained** - Minimal external dependencies

</div>

<div v-motion :initial="{ x: 30, opacity: 0 }" :enter="{ x: 0, opacity: 1, transition: { delay: 300 } }">
    
### Technical Guidelines 🔧
- **Version properly** - Follow semantic versioning
- **Document thoroughly** - Clear README and examples
- **Test extensively** - Example configurations
- **Validate inputs** - Use type system and options
- **Handle failures** - Graceful error handling

</div>
</div>

<div v-motion :initial="{ y: 30, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 600 } }" class="mt-8 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg">

### Popular Component Categories

<div class="grid grid-cols-4 gap-4 mt-4 text-center text-sm">
  <div><strong>🐳 Build Tools</strong><br/>Docker, Maven, Gradle</div>
  <div><strong>☸️ Deployment</strong><br/>Kubernetes, Helm, Terraform</div>
  <div><strong>🔐 Security</strong><br/>SAST, DAST, Dependency scanning</div>
  <div><strong>📊 Quality</strong><br/>Testing, Coverage, Code quality</div>
</div>

</div>
