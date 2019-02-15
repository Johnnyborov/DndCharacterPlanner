<template>
  <div @mouseenter="$emit('enter-child')">
    <ul>
      <available-spell v-for="(spell, index) in availableMinusChosenList" :key="index" :id="index" :spell="spell"
        @clicked-spell="clickedSpellHandler" class="available-spell" />
    </ul>
  </div> 
</template>

<script>
import {mapState} from 'vuex'

import AvailableSpell from './AvailableSpell.vue'

export default {
  name: 'AvailableSpellsList',
  components: {
    'available-spell': AvailableSpell,
  },

  computed: {
    availableMinusChosenList() {
      return this.availableSpellsList.filter(spell => {
          return !this.chosenSpellsList.find(chosenSpell => chosenSpell.name === spell.name)
        })
    },

    ...mapState('spells', [
      'availableSpellsList',
      'chosenSpellsList'
    ])
  },

  methods: {
    clickedSpellHandler(id) {
      this.$emit('spell-chosen', this.availableMinusChosenList[id])
    }
  }
}
</script>

<style>
</style>
