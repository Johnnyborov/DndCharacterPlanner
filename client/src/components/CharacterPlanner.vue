<template>
  <div @click="spellPressedByModule=''" @mouseleave="spellPressedByModule=''">
    <character-stats class="character-stats" />
    <chosen-spells-list :moduleName="'abilities'" class="chosen-spells-list" :spellPressedByModule="spellPressedByModule" @spell-pressed="spellPressedByModule=$event">
      <p>Class Abilities</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'feats'" class="chosen-spells-list" :spellPressedByModule="spellPressedByModule" @spell-pressed="spellPressedByModule=$event">
      <p>Chosen Feats</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'spells'" class="chosen-spells-list" :spellPressedByModule="spellPressedByModule" @spell-pressed="spellPressedByModule=$event">
      <p>Chosen Spells</p>
    </chosen-spells-list>

    <saver-loader class="saver-loader">Saving/Loading</saver-loader>
  </div>
</template>

<script>
import SaverLoader from './SaverLoader.vue'
import CharacterStats from './CharacterStats.vue'
import ChosenSpellsList from './spells/ChosenSpellsList.vue'

import spells from '../store/modules/spells.js'

export default {
  name: 'CharacterPlanner',
  components: {
    'saver-loader': SaverLoader,
    'character-stats': CharacterStats,
    'chosen-spells-list': ChosenSpellsList
  },

  data() {
    return {
      spellPressedByModule: ''
    }
  },


  created() {
    this.$store.registerModule('abilities', spells)
    this.$store.dispatch('abilities/initializeModule', 'abilities')

    this.$store.registerModule('feats', spells)
    this.$store.dispatch('feats/initializeModule', 'feats')

    this.$store.registerModule('spells', spells)
    this.$store.dispatch('spells/initializeModule', 'spells')

    this.$store.dispatch('stats/initializeModule')

    this.$store.dispatch('classConfig/initializeModule')
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
