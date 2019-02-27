<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="clickHandler"
    class="item-slot" :class="{'selected-item': currentlyClickedSlotId === slotId}">
    {{levelText}}{{item.name}}

    <div :style="{'position': 'absolute', 'top': posY + 'px'}">
      <item-tooltip v-if="mouseOver && item.id !== -1" :item="item" :moduleType="moduleType" :posX="posX" class="item-tooltip" />
    </div>
  </li>
</template>

<script>
import itemSlot from '../../mixins/itemSlot.js'

export default {
  name: 'ChoosableItem',
  mixins: [itemSlot],

  props: {
    slotId: Number,
    currentlyClickedSlotId: Number
  },

  methods: {
    clickHandler() {
      if (this.moduleType !== 'classAbilities' && this.moduleType !== 'subclassAbilities') {
        this.$emit('clicked-item', {slotId: this.slotId, posY: this.posY})
      }
    }
  }
}
</script>

<style>
</style>
