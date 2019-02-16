<template>
  <div @mouseenter="$emit('enter-child')">
    <ul>
      <li @click="spellChosenHandler({id: -1})" class="remove-option">Remove</li>
      <available-spell v-for="(spell, index) in availableMinusChosenList" :key="index" :slotId="index" :spell="spell"
        @spell-chosen="spellChosenHandler" class="available-spell" />
    </ul>
  </div> 
</template>

<script>
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
    availableMinusChosenList() {
      return this.availableSpellsList.filter(availableSpell => {
          return !this.chosenSpellsList.find(chosenSpell => chosenSpell.id === availableSpell.id)
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
    spellChosenHandler(spell) {
      return this.$store.dispatch(this.moduleName + '/setChosenSpell', {slotId: this.slotId, spell: spell})
    }
  }
}
</script>

<style>
</style>
