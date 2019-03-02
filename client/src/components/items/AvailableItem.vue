<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="$emit('item-clicked', realItem)" class="item-slot">
    {{levelText}}{{item.name}}

    <stat-chooser :item="item" @id-changed="idChangedHandler" />

    <div :style="{'position': 'absolute', 'top': posY + 'px'}">
      <item-tooltip v-if="mouseOver" :item="item" :moduleType="moduleType" :posX="posX" class="item-tooltip" />
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
      realItem: this.item
    }
  },

  methods: {
    idChangedHandler(item) {
      this.realItem = item
    }
  }
}
</script>

<style>
</style>
