<template>
  <div @click="clickedEslewhereHandler" @mouseleave="clickedEslewhereHandler" class="character-spells">
    <ul>
      <chosen-spell v-for="(spell, index) in chosenSpellsList" :key="index" :id="index" :spell="spell" :currentlyClickedId="currentlyClickedId"
        @clicked-spell="clickedSpellHandler" class="chosen-spell"/>
    </ul>
  </div>
</template>

<script>
import {mapState} from 'vuex'

import ChosenSpell from './ChosenSpell.vue'

export default {
  name: 'ChosenSpellsList',
  components: {
    'chosen-spell': ChosenSpell
  },

  data() {
    return {
      currentlyClickedId: -1
    }
  },

  computed: {
    ...mapState('spells', [
      'chosenSpellsList'
    ])
  },

  methods: {
    clickedSpellHandler(id) {
      this.currentlyClickedId = id
    },

    clickedEslewhereHandler() {
      this.currentlyClickedId = -1
    }
  }
}
</script>

<style>
</style>
