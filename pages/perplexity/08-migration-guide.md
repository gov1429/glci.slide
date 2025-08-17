---
layout: section
---

# Migration Guide
## From Jenkins to GitLab CI/CD

<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="300" class="mt-8">
  <span class="text-lg opacity-75">Your step-by-step migration strategy...</span>
</div>

---
layout: two-cols-header
---

# Migration Strategy Overview

<div class="mt-6">

## Migration Phases 📋

<v-clicks>

- **Assessment**: Analyze current Jenkins setup
- **Planning**: Design GitLab CI/CD architecture  
- **Preparation**: Set up GitLab environment
- **Migration**: Move pipelines incrementally
- **Optimization**: Improve and standardize

</v-clicks>

</div>

::left::

<v-click="6">

## Assessment Checklist ✅

<div class="space-y-3">

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Current State Analysis**
- Number of Jenkins jobs
- Plugin dependencies  
- Build agents/runners
- Integration points

</div>

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Complexity Evaluation**  
- Simple vs complex pipelines
- Custom scripts and tools
- Security requirements
- Deployment strategies

</div>

</div>

</v-click>

::right::

<v-click="7">

## Migration Timeline 📅

<div class="space-y-2">

<div class="flex items-center space-x-3">
  <div class="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
  <div>
    <div class="font-semibold">Week 1-2: Assessment</div>
    <div class="text-sm opacity-75">Inventory and analysis</div>
  </div>
</div>

<div class="flex items-center space-x-3">
  <div class="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
  <div>
    <div class="font-semibold">Week 3-4: Planning</div>
    <div class="text-sm opacity-75">Architecture design</div>
  </div>
</div>

<div class="flex items-center space-x-3">
  <div class="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
  <div>
    <div class="font-semibold">Week 5-8: Migration</div>
    <div class="text-sm opacity-75">Incremental migration</div>
  </div>
</div>

<div class="flex items-center space-x-3">
  <div class="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
  <div>
    <div class="font-semibold">Week 9-10: Optimization</div>
    <div class="text-sm opacity-75">Refinement and training</div>
  </div>
</div>

</div>

</v-click>

---
layout: default
---

# Jenkins vs GitLab Mapping

<div class="grid grid-cols-2 gap-8">

<div>

## Core Concepts Translation 🔄

<v-click="1">

| Jenkins | GitLab CI/CD |
|---------|-------------|
| **Job** | Job |
| **Stage** | Stage |  
| **Pipeline** | Pipeline |
| **Build** | Runner/Job execution |
| **Workspace** | Project directory |
| **Artifact** | Artifact |
| **Plugin** | Built-in feature/Component |
| **Node/Agent** | Runner |

</v-click>

<v-click="2">

## Configuration Mapping

<div class="space-y-3 mt-4">

<div class="p-3 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Jenkins**: UI-based configuration
**GitLab**: `.gitlab-ci.yml` file

</div>

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Jenkins**: Groovy/Pipeline script  
**GitLab**: YAML configuration

</div>

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Jenkins**: Plugin management
**GitLab**: Built-in features

</div>

</div>

</v-click>

</div>

<div>

<v-click="3">

## Feature Comparison

<div class="space-y-3">

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded">

**✅ GitLab Advantages**
- Integrated Git repository
- Built-in container registry
- Security scanning included
- No plugin maintenance
- Configuration as code

</div>

<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">

**⚠️ Migration Considerations**
- Learn new YAML syntax
- Adapt existing scripts
- Runner setup/migration
- Team training required

</div>

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">

**🔧 Migration Tools**
- Jenkins import wizard  
- Configuration converters
- Script migration helpers
- Community templates

</div>

</div>

</v-click>

</div>

</div>

---
layout: default
---

# Pipeline Translation Examples

<div class="grid grid-cols-2 gap-8">

<div>

## Jenkins Freestyle Job

<v-click="1">

```groovy
// Jenkins Pipeline
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        DEPLOY_ENV = 'staging'
    }
    
    stages {
        stage('Build') {
            steps {
                sh 'npm ci'
                sh 'npm run build'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test'
            }
            post {
                always {
                    publishTestResults testResultsPattern: 'test-results.xml'
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                sh './deploy.sh ${DEPLOY_ENV}'
            }
        }
    }
}
```

</v-click>

</div>

<div>

<v-click="2">

## GitLab CI/CD Equivalent

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test  
  - deploy

variables:
  NODE_VERSION: "18"
  DEPLOY_ENV: "staging"

build:
  stage: build
  image: node:$NODE_VERSION
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - node_modules/
      - dist/

test:
  stage: test
  image: node:$NODE_VERSION
  needs: [build]
  script:
    - npm test
  artifacts:
    reports:
      junit: test-results.xml

deploy:
  stage: deploy
  image: alpine:latest
  needs: [test]
  script:
    - ./deploy.sh $DEPLOY_ENV
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

</v-click>

</div>

</div>

<v-click="3">

<div class="mt-8 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-l-4 border-green-400">

## 🎯 **Key Translation Points**
- **Pipeline syntax** → YAML configuration
- **Agent/Node** → Docker image + runner  
- **Environment variables** → Variables section
- **When conditions** → Rules section
- **Post actions** → artifacts/after_script

</div>

</v-click>

---
layout: default
---

# Complex Pipeline Migration

<div class="grid grid-cols-2 gap-8">

<div>

## Jenkins Multi-branch Pipeline

<v-click="1">

```groovy
pipeline {
    agent none
    
    stages {
        stage('Parallel Build') {
            parallel {
                stage('Frontend') {
                    agent { label 'nodejs' }
                    steps {
                        sh 'npm ci'
                        sh 'npm run build'
                    }
                }
                stage('Backend') {
                    agent { label 'java' }
                    steps {
                        sh './mvnw clean compile'
                    }
                }
            }
        }
        
        stage('Integration Tests') {
            agent { label 'test-runner' }
            steps {
                sh 'docker-compose up -d'
                sh 'npm run test:integration'
                sh 'docker-compose down'
            }
        }
        
        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'develop'
                }
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh './deploy-prod.sh'
                    } else {
                        sh './deploy-staging.sh'  
                    }
                }
            }
        }
    }
}
```

</v-click>

</div>

<div>

<v-click="2">

## GitLab CI/CD Translation

```yaml
stages:
  - build
  - test
  - deploy

# Parallel build jobs
build_frontend:
  stage: build
  image: node:18
  tags: [nodejs]
  script:
    - npm ci  
    - npm run build
  artifacts:
    paths: [dist/]

build_backend:
  stage: build
  image: maven:3.8-openjdk-17
  tags: [java]
  script:
    - ./mvnw clean compile
  artifacts:
    paths: [target/]

# Integration tests
integration_tests:
  stage: test
  image: docker:latest
  services:
    - docker:dind
  tags: [test-runner]
  needs: [build_frontend, build_backend]
  script:
    - docker-compose up -d
    - npm run test:integration
    - docker-compose down

# Environment-specific deploys
deploy:
  stage: deploy
  image: alpine:latest
  needs: [integration_tests]
  script:
    - |
      if [[ "$CI_COMMIT_BRANCH" == "main" ]]; then
        ./deploy-prod.sh
      else
        ./deploy-staging.sh
      fi
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
    - if: $CI_COMMIT_BRANCH == "develop"
```

</v-click>

</div>

</div>

---
layout: default
---

# Migration Tools & Resources

<div class="grid grid-cols-2 gap-8">

<div>

## Automated Migration Tools 🛠️

<v-click="1">

<div class="space-y-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**GitLab Jenkins Importer**
- Import Jenkins jobs to GitLab
- Converts basic pipeline structures
- Available in GitLab Enterprise

</div>

<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Community Converters**
- jenkins-to-gitlab-ci converter
- Pipeline syntax translators  
- Configuration mapping tools

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Custom Scripts**
- Parse Jenkinsfiles
- Generate GitLab YAML
- Bulk migration tools

</div>

</div>

</v-click>

</div>

<div>

<v-click="2">

## Migration Checklist 📋

<div class="space-y-2">

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Inventory** all Jenkins jobs and pipelines</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">  
  <span>**Document** dependencies and integrations</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Set up** GitLab runners and infrastructure</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Migrate** simple pipelines first</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Test** each migrated pipeline thoroughly</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Train** team on GitLab CI/CD features</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Optimize** pipelines using GitLab features</span>
</div>

<div class="flex items-center space-x-2">
  <input type="checkbox" class="rounded">
  <span>**Decommission** Jenkins infrastructure</span>
</div>

</div>

</v-click>

<v-click="3">

## Success Metrics 📊

<div class="mt-4 space-y-2 text-sm">

- **⏱️ Pipeline Speed**: Faster execution times
- **🔄 Deployment Frequency**: More frequent releases  
- **❌ Failure Rate**: Reduced pipeline failures
- **🛠️ Maintenance**: Less infrastructure overhead
- **👥 Developer Experience**: Improved satisfaction
- **🔒 Security**: Integrated security scanning

</div>

</v-click>

</div>

</div>

---
layout: default
---

# Migration Best Practices

<div class="grid grid-cols-2 gap-8">

<div>

## Incremental Approach 📈

<v-click="1">

<div class="space-y-4">

<div class="p-3 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Phase 1**: Simple build/test jobs
- No complex dependencies
- Standard tools and languages
- Low business impact

</div>

<div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Phase 2**: Integration pipelines  
- Multi-stage workflows
- Service dependencies
- Moderate complexity

</div>

<div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Phase 3**: Complex deployments
- Production pipelines
- Custom tooling
- High business impact

</div>

</div>

</v-click>

<v-click="2">

## Risk Mitigation 🛡️

<div class="mt-4 space-y-3">

<div class="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">

**Parallel Running**
Keep Jenkins and GitLab running simultaneously

</div>

<div class="p-3 bg-orange-50 dark:bg-orange-900/20 rounded">

**Rollback Plan**
Document steps to revert if needed

</div>

<div class="p-3 bg-red-50 dark:bg-red-900/20 rounded">

**Testing**  
Thorough validation of migrated pipelines

</div>

</div>

</v-click>

</div>

<div>

<v-click="3">

## Team Preparation 👥

<div class="space-y-4">

<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Training Plan**
- GitLab CI/CD fundamentals
- YAML syntax workshop  
- Hands-on pipeline creation
- Advanced features demo

</div>

<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**Documentation**
- Migration guides
- Common patterns library
- Troubleshooting guides
- Best practices handbook

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Support Structure**  
- Champion/expert network
- Office hours for questions
- Internal Slack channels
- Regular feedback sessions

</div>

</div>

</v-click>

<v-click="4">

## Common Pitfalls ⚠️

<div class="mt-4 space-y-2 text-sm">

- **Big Bang Migration**: Avoid migrating everything at once
- **Insufficient Testing**: Test pipelines thoroughly before going live  
- **Ignoring Team Training**: Invest in proper education
- **Not Optimizing**: Don't just copy Jenkins patterns
- **Poor Communication**: Keep stakeholders informed

</div>

</v-click>

</div>

</div>

---
layout: default
---

# Post-Migration Optimization

<div class="grid grid-cols-2 gap-8">

<div>

## GitLab-specific Improvements 🚀

<v-click="1">

<div class="space-y-4">

<div class="p-4 bg-green-50 dark:bg-green-900/20 rounded border-l-4 border-green-400">

**CI/CD Components**
- Replace duplicated pipeline code
- Create reusable building blocks
- Establish component library

</div>

<div class="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border-l-4 border-blue-400">

**Built-in Features**
- Container registry integration
- Security scanning activation
- Merge request pipelines

</div>

<div class="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border-l-4 border-purple-400">

**Advanced Workflows**
- Smart rules and conditions
- DAG pipelines for complex deps
- Parent-child pipelines

</div>

</div>

</v-click>

</div>

<div>

<v-click="2">

## Performance Optimization ⚡

<div class="space-y-4">

<div class="p-4 bg-orange-50 dark:bg-orange-900/20 rounded border-l-4 border-orange-400">

**Caching Strategy**
- Implement smart caching
- Share cache between jobs
- Monitor cache hit rates

</div>

<div class="p-4 bg-red-50 dark:bg-red-900/20 rounded border-l-4 border-red-400">

**Parallel Execution**
- Use `needs` for job dependencies
- Implement matrix/parallel jobs
- Optimize job scheduling

</div>

<div class="p-4 bg-teal-50 dark:bg-teal-900/20 rounded border-l-4 border-teal-400">

**Resource Management**
- Right-size Docker images
- Optimize runner allocation
- Monitor resource usage

</div>

</div>

</v-click>

<v-click="3">

## Monitoring & Analytics 📊

<div class="mt-4 space-y-3">

<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">

**Pipeline Analytics**
Success rates, duration trends, bottleneck identification

</div>

<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">

**Resource Metrics**
Runner utilization, queue times, cost optimization

</div>

<div class="p-3 bg-gray-50 dark:bg-gray-800 rounded">

**Developer Experience**
Pipeline adoption rates, feedback collection

</div>

</div>

</v-click>

</div>

</div>

---
layout: center
class: text-center
---

# Your Migration Journey 🗺️

<div v-motion :initial="{ scale: 0.8, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }" :delay="300" class="mt-8">

<div class="grid grid-cols-4 gap-4">

<div class="p-4 border rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">

## 🔍 **Assess**
- Current state analysis
- Complexity evaluation  
- Resource planning

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">

## 📋 **Plan**
- Migration strategy
- Timeline creation
- Team preparation

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">

## 🚀 **Migrate**
- Incremental approach
- Testing & validation
- Risk mitigation

</div>

<div class="p-4 border rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">

## ⚡ **Optimize**
- Use GitLab features
- Performance tuning
- Continuous improvement

</div>

</div>

</div>

<div v-click class="mt-8">
  <span class="text-xl font-semibold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Ready to transform your CI/CD? Let's do this! 💪
  </span>
</div>