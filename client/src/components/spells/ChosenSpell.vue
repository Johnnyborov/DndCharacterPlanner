<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="clickHandler"
    class="spell-slot" :class="{'currently-choosing': currentlyClickedSlotId === slotId}">

    {{spell.name}}

    <spell-tooltip v-if="mouseOver && spell.id !== -1" :spell="spell" @enter-child="enterChildHandler" class="spell-tooltip" />
    
    <available-spells-list v-if="currentlyClickedSlotId === slotId" :slotId="slotId" @enter-child="leaveHandler"
      :moduleName="moduleName" class="available-spells-list" />
  </li>
</template>

<script>
import spellSlot from '../../mixins/spellSlot.js'

import AvailableSpellsList from './AvailableSpellsList.vue'

export default {
  name: 'ChosenSpell',
  mixins: [spellSlot],

  components: {
    'available-spells-list': AvailableSpellsList
  },

  props: {
    moduleName: String,
    slotId: Number,
    currentlyClickedSlotId: Number
  },

  methods: {
    clickHandler() {
      this.$emit('clicked-slot', this.slotId)
    }
  }
}
</script>

<style>
</style>
