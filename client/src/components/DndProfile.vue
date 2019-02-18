<template>
  <div @click="focusedModule=''" @mouseleave="focusedModule=''">
    <class-control class="class-control" />

    <character-stats class="character-stats" />

    <chosen-spells-list :moduleName="'abilities'" class="chosen-spells-list" :focusedModule="focusedModule" @got-focus="focusedModule=$event">
      <p>Class Abilities</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'feats'" class="chosen-spells-list" :focusedModule="focusedModule" @got-focus="focusedModule=$event">
      <p>Chosen Feats</p>
    </chosen-spells-list>

    <chosen-spells-list :moduleName="'spells'" class="chosen-spells-list" :focusedModule="focusedModule" @got-focus="focusedModule=$event">
      <p>Chosen Spells</p>
    </chosen-spells-list>

    <saver-loader class="saver-loader" />
  </div>
</template>

<script>
import ClassControl from './ClassControl.vue'
import SaverLoader from './SaverLoader.vue'
import CharacterStats from './CharacterStats.vue'
import ChosenSpellsList from './spells/ChosenSpellsList.vue'

import spells from '../store/modules/spells.js'

export default {
  name: 'DndProfile',
  components: {
    'class-control': ClassControl,
    'saver-loader': SaverLoader,
    'character-stats': CharacterStats,
    'chosen-spells-list': ChosenSpellsList
  },

  data() {
    return {
      focusedModule: ''
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
