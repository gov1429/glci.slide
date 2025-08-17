---
# try also 'default' to start simple
theme: seriph
# random image from a curated Unsplash collection by Anthony
# like them? see https://unsplash.com/collections/94734566/slidev
background: https://cover.sli.dev/1920x1080.png
# some information about your slides, markdown enabled
title: "GitLab CI/CD Introduction"
info: |
  ## GitLab CI/CD Introduction

  A comprehensive guide for migrating from Jenkins to GitLab CI/CD

  Learn fundamentals, advanced concepts, and CI/CD Components

# apply any unocss classes to the current slide
class: text-center
# https://sli.dev/custom/highlighters.html
highlighter: shiki
# https://sli.dev/guide/drawing
drawings:
  persist: false
# slide transition: https://sli.dev/guide/animations#slide-transitions
transition: slide-left
# enable MDC Syntax: https://sli.dev/guide/syntax#mdc-syntax
mdc: true
# use UnoCSS for animations
unocss:
  attributify: true
  shortcuts:
    "fade-in": "op-0 transition-all duration-400 ease-in-out hover:op-100"
    "slide-in": "transform transition-all duration-500 ease-in-out translate-x-[-100%] hover:translate-x-0"
---

# GitLab CI/CD Introduction

## From Jenkins to GitLab: A Complete Migration Guide

<div class="pt-12">
  <span @click="$slidev.nav.next" class="px-2 py-1 rounded cursor-pointer bg-white bg-opacity-10 hover:bg-opacity-20">
    Press Space for next page <carbon:arrow-right class="inline"/>
  </span>
</div>

<div class="abs-br m-6 flex gap-2">
  <button @click="$slidev.nav.openInEditor()" title="Open in Editor" class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon:edit />
  </button>
  <a href="https://github.com/slidevjs/slidev" target="_blank" alt="GitHub" title="Open in GitHub"
    class="text-xl slidev-icon-btn opacity-50 !border-none !hover:text-white">
    <carbon-logo-github />
  </a>
</div>

<!--
The last comment block of each slide will be treated as slide notes. It will be visible and editable in Presenter Mode along with the slide. [Read more in the docs](https://sli.dev/guide/syntax.html#notes)
-->

---
src: ./01-introduction.md
---

<!--

- --
src: ./02-fundamentals.md
- --

- --
src: ./03-gitlab-ci-yaml.md
- --

- --
src: ./04-workflows-rules.md
- --

- --
src: ./05-advanced-features.md
- --

- --
src: ./06-cicd-components.md
- --

- --
src: ./07-live-demos.md
- --

- --
src: ./08-migration-guide.md
- --

-->

---
layout: center
class: text-center
---

# Thank You!

<div class="grid grid-cols-3 gap-8 pt-8">
<div v-motion :initial="{ x: -80 }" :enter="{ x: 0 }" :delay="200">

## Questions?

Feel free to ask any questions about GitLab CI/CD

</div>

<div v-motion :initial="{ y: 80 }" :enter="{ y: 0 }" :delay="400">

## Next Steps

- Start with simple pipelines
- Gradually adopt CI/CD Components
- Explore the GitLab CI/CD Catalog

</div>

<div v-motion :initial="{ x: 80 }" :enter="{ x: 0 }" :delay="600">

## Resources

- [GitLab CI/CD Docs](https://docs.gitlab.com/ci/)
- [CI/CD Catalog](https://docs.gitlab.com/ci/components/)
- [Best Practices Guide](https://docs.gitlab.com/ci/pipelines/)

</div>
</div>

<div class="pt-8">
  <span class="text-2xl font-bold text-gradient bg-gradient-to-r from-teal-400 to-blue-500">
    Happy Coding! 🚀
  </span>
</div>
