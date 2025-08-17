---
title: "Examples & Patterns"
---

# Build → Push → Teardown (single runner or registry)
```yaml
stages: [build, push, teardown]
variables:
  IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

docker-build:
  stage: build
  image: docker:24
  services: [docker:dind]
  script:
    - docker build -t $IMAGE .
    - docker push $IMAGE
  tags: [docker]
  artifacts:
    paths: [image-info.txt]

# If you must separate build & push across runners:
# build job should push to registry so next job can pull/push.
```

---
# Keep shared logic as scripts (recommended)
- scripts/docker-login.sh
- scripts/bump-version.sh
- scripts/deploy-preview.sh

Use in jobs:
```yaml
script:
  - ./scripts/docker-login.sh
  - ./scripts/bump-version.sh
```

---
# Passing commits between jobs (version → push)
```yaml
version:
  stage: version
  script:
    - git config user.name "CI Bot"
    - git checkout $CI_COMMIT_REF_NAME
    - ./scripts/bump-version.sh && git commit -am "bump"
  artifacts:
    paths: [.] # include .git
    expire_in: 1 hr

push-version:
  stage: push
  needs: [ { job: version, artifacts: true } ]
  script:
    - git config user.name "CI Bot"
    - git push origin HEAD:$CI_COMMIT_REF_NAME
```

