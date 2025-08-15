---
# You can also start simply with 'default'
theme: seriph
# # random image from a curated Unsplash collection by Anthony
# # like them? see https://unsplash.com/collections/94734566/slidev
# background: https://cover.sli.dev
# # some information about your slides (markdown enabled)
# title: Welcome to Slidev
info: |
  ## Slidev Starter Template
  Presentation slides for developers.

  Learn more at [Sli.dev](https://sli.dev)
# # apply unocss classes to the current slide
# class: text-center
# https://sli.dev/features/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations.html#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/features/mdc
mdc: true
# open graph
seoMeta:
  # By default, Slidev will use ./og-image.png if it exists,
  # or generate one from the first slide if not found.
  ogImage: auto
  # ogImage: https://cover.sli.dev
---

# Introduction to GitLab CI

<!-- ## Migrating from Jenkins to GitLab CI -->

<div class="text-3xl mt-8 text-gray-600">Step-by-Step Guide for Beginners</div>
<div class="text-2xl mt-4">Presented by Grok</div>

```yaml
src: ./pages/introduction.markdown
```

```yaml
src: ./pages/basics.markdown
```

```yaml
src: ./pages/writing-yaml.markdown
```

```yaml
src: ./pages/advanced-keywords.markdown
```

```yaml
src: ./pages/components.markdown
```
