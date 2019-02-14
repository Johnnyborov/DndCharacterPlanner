<template>
  <div @click="clickedEslewhereHandler" @mouseleave="clickedEslewhereHandler" class="character-spells">
    <ul>
      <chosen-spell v-for="(spell, index) in chosenSpells" :key="index" :id="index" :spell="spell"
      @clicked-spell="clickedSpellHandler" class="chosen-spell"/>
    </ul>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

import ChosenSpell from './ChosenSpell.vue'

export default {
  name: 'CharacterSpells',
  components: {
    'chosen-spell': ChosenSpell
  },

  computed: {
    ...mapState('spells', [
      'chosenSpells'
    ])
  },

  methods: {
    ...mapMutations('spells', [
      'showSpellList',
      'hideSpellList'
    ]),

    clickedSpellHandler(id) {
      this.showSpellList(id)
    },

    clickedEslewhereHandler() {
      this.hideSpellList()
    }
  }
}
</script>

<style>
</style>
