<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="clickHandler"
    class="spell-slot" :class="{'currently-choosing': currentlyClickedSlotId === slotId}">

    {{spell.name}}

    <div :style="{'top': posY + 'px', 'position': 'absolute'}">
      <spell-tooltip v-if="mouseOver && spell.id !== -1" :spell="spell" :moduleName="moduleName" class="spell-tooltip" />
    </div>
  </li>
</template>

<script>
import spellSlot from '../../mixins/spellSlot.js'

export default {
  name: 'ChosenSpell',
  mixins: [spellSlot],

  props: {
    slotId: Number,
    currentlyClickedSlotId: Number
  },

  methods: {
    clickHandler() {
      if (this.moduleName !== 'abilities') {
        this.$emit('clicked-slot', {slotId: this.slotId, posY: this.posY})
      }
    }
  }
}
</script>

<style>
</style>
