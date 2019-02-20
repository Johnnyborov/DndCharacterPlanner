<template>
  <div id="app">
    <character-planner class="character-planner"/>
  </div>
</template>

<script>
import CharacterPlanner from './CharacterPlanner.vue'

export default {
  name: 'app',
  components: {
    'character-planner': CharacterPlanner
  }
}
</script>

<style src="../css/planner.css">
</style>
