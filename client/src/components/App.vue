<template>
  <div id="app">
    <dnd-profile class="dnd-profile"/>
  </div>
</template>

<script>
import DndProfile from './DndProfile.vue'

export default {
  name: 'app',
  components: {
    'dnd-profile': DndProfile
  }
}
</script>

<style src="../css/profiler.css">
</style>
