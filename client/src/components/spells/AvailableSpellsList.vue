<template>
  <div @mouseenter="$emit('enter-child')">
    <ul>
      <li @click="spellChosenHandler(-1)" class="remove-option">Remove</li>
      <available-spell v-for="(spell, index) in choosableSpellsList" :key="index" :slotId="index" :spell="spell"
        @spell-chosen="spellChosenHandler" class="available-spell" />
    </ul>
  </div> 
</template>

<script>
function isVariation(id) {
  if (id > 10 && id < 60 || id > 60 && id < 70) return true

  return false
}

function canHaveMultiple(id) {
  switch(id) {
    case 70:
    case 75:
      return true
  }

  return false
}

import AvailableSpell from './AvailableSpell.vue'

export default {
  name: 'AvailableSpellsList',
  components: {
    'available-spell': AvailableSpell,
  },

  props: {
    moduleName: String,
    slotId: Number
  },

  computed: {
    choosableSpellsList() {
      return this.availableSpellsList.filter(availableSpell => {
        if (isVariation(availableSpell.id))
          return false

        let sameSpell = this.chosenSpellsList.find(chosenSpell => chosenSpell.id === availableSpell.id)
        if (sameSpell && !canHaveMultiple(availableSpell.id))
          return false

        return true
      })
    },

    availableSpellsList() {
      return this.$store.state[this.moduleName].availableSpellsList
    },

    chosenSpellsList() {
      return this.$store.state[this.moduleName].chosenSpellsList
    }
  },

  methods: {
    spellChosenHandler(spellId) {
      return this.$store.dispatch(this.moduleName + '/setChosenSpell', {slotId: this.slotId, spellId: spellId})
    }
  }
}
</script>

<style>
</style>
