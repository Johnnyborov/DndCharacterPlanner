<template>
  <character-spells class="character-spells" />
</template>

<script>
import CharacterSpells from './spells/CharacterSpells.vue'

export default {
  name: 'DndProfile',
  components: {
    'character-spells': CharacterSpells
  }
}
</script>

<style>
</style>
