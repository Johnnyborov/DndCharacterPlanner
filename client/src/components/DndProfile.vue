<template>
  <chosen-spells-list class="chosen-spells-list" />
</template>

<script>
import ChosenSpellsList from './spells/ChosenSpellsList.vue'

export default {
  name: 'DndProfile',
  components: {
    'chosen-spells-list': ChosenSpellsList
  },

  created() {
    this.$store.dispatch('spells/getSpellsList')
  }
}
</script>

<style>
</style>
