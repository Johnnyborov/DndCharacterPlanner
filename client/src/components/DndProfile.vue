<template>
  <div>
    <character-stats class="character-stats" />

    <chosen-spells-list :moduleName="'abilities'" class="chosen-spells-list">
      <p>Class Abilities</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'feats'" class="chosen-spells-list">
      <p>Chosen Feats</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'spells'" class="chosen-spells-list">
      <p>Chosen Spells</p>
    </chosen-spells-list>
  </div>
</template>

<script>
import CharacterStats from './CharacterStats.vue'

import ChosenSpellsList from './spells/ChosenSpellsList.vue'
import spells from '../store/modules/spells.js'

export default {
  name: 'DndProfile',
  components: {
    'character-stats': CharacterStats,
    'chosen-spells-list': ChosenSpellsList
  },

  created() {
    this.$store.registerModule('abilities', spells)
    this.$store.dispatch('abilities/initializeModule', {type: 'abilities', amount: 4})

    this.$store.registerModule('feats', spells)
    this.$store.dispatch('feats/initializeModule', {type: 'feats', amount: 2})

    this.$store.registerModule('spells', spells)
    this.$store.dispatch('spells/initializeModule', {type: 'spells', amount: 3})

    this.$store.dispatch('stats/initializeModule')
  },

  destroyed() {
    this.$store.unregisterModule('abilities')
    this.$store.unregisterModule('feats')
    this.$store.unregisterModule('spells')
  }
}
</script>

<style>
</style>
