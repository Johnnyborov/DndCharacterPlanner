<template>
  <div class="home">
    <character-planner :charId="$route.params.id"/>
  </div>
</template>

<script>
// @ is an alias to /src
import CharacterPlanner from '@/components/CharacterPlanner.vue'

export default {
  name: 'home',
  components: {
    'character-planner': CharacterPlanner
  }
}
</script>
