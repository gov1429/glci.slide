# Agenda

<div class="grid grid-cols-2 gap-8 mt-10">
  <div v-click v-motion :initial="{ y: 50, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 200 } }" class="p-6 detail-block">
    <h3 class="text-lg">Fundamentals</h3>
    <p class="text-sm">Pipelines, Jobs, Stages</p>
  </div>
  
  <div v-click v-motion :initial="{ y: 50, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 200 } }" class="p-6 detail-block">
    <h3 class="font-bold text-lg">Configuration</h3>
    <p>Writing <code v-pre>.gitlab-ci.yml</code></p>
  </div>
  
  <div v-click v-motion :initial="{ y: 50, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 200 } }" class="p-6 detail-block">
    <h3 class="font-bold text-lg">Advanced Features</h3>
    <p class="text-sm">Workflows, Rules, Variables, Artifacts, etc.</p>
  </div>
  
  <div v-click v-motion :initial="{ y: 50, opacity: 0 }" :enter="{ y: 0, opacity: 1, transition: { delay: 200 } }" class="p-6 detail-block">
    <h3 class="font-bold text-lg">Components</h3>
    <p class="text-sm">Reusable CI/CD Building Blocks</p>
  </div>
</div>

<!--
TODO: compare to Jenkins.
-->
