<template>
  <div @mouseenter="$emit('enter-child')">
    <ul class="scrollable-list">
      <li @click="spellChosenHandler(-1)" class="remove-option">Remove</li>
      <available-spell v-for="spell in choosableSpellsList" :key="spell.id" :spell="spell"
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
    availableSpells() {
      return this.$store.state[this.moduleName].availableSpells.filter(s => s.id < 1077)
    },

    chosenSpells() {
      return this.$store.state[this.moduleName].chosenSpells
    },


    choosableSpellsList() {
      return this.availableSpells.filter(availableSpell => {
        if (isVariation(availableSpell.id))
          return false

        let sameSpell = this.chosenSpells.find(chosenSpellId => chosenSpellId === availableSpell.id)
        if (sameSpell && !canHaveMultiple(availableSpell.id))
          return false

        return true
      })
    }
  },

  methods: {
    spellChosenHandler(spellId) {
      return this.$store.dispatch(this.moduleName + '/setChosenSpellId', {slotId: this.slotId, spellId: spellId})
    }
  }
}
</script>

<style>
</style>
