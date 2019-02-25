<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="clickHandler" class="item-slot">
    {{levelText}}{{item.name}}

    <stat-chooser :itemId="item.id" @id-changed="idChangedHandler" />

    <div :style="{'top': posY + 'px', 'position': 'absolute'}">
      <item-tooltip v-if="mouseOver" :item="item" :moduleType="moduleType" class="item-tooltip"/>
    </div>
  </li>
</template>

<script>
import StatChooser from './StatChooser.vue'

import itemSlot from '../../mixins/itemSlot.js'

export default {
  name: 'AvailableItem',
  mixins: [itemSlot],
  components: {
    'stat-chooser': StatChooser
  },

  data() {
    return {
      realItemId: this.item.id
    }
  },

  methods: {
    clickHandler() {
      this.$emit('item-chosen', this.realItemId)
    },

    idChangedHandler(id) {
      this.realItemId = id
    }
  }
}
</script>

<style>
</style>
