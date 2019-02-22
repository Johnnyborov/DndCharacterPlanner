<template>
  <div @mouseenter="$emit('enter-child')">
    <ul class="scrollable-list" ref='scrollable-ul'>
      <li @click="spellChosenHandler(-1)" class="remove-option">Remove</li>
      <available-spell v-for="spell in choosableSpells" :key="spell.id" :spell="spell"
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
    choosableSpells() {
      return this.$store.getters[this.moduleName + '/choosableSpells']
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
