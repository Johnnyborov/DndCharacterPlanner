<template>
  <li>
    <div @mouseenter="enterHandler" @mouseleave="leaveHandler" class="item-slot choosable-item disabled-item">
      {{levelText}}{{item.name}}

      <div :style="{'position': 'absolute', 'top': posY + 'px'}">
        <item-tooltip v-if="mouseOver" :item="item" :moduleType="moduleType" :posX="posX" class="item-tooltip" />
      </div>
    </div>
  

    <div v-if="typeof(options[item.name]) !== 'undefined'">
      <choosable-items-list :moduleType="'options'" :abilityName="item.name" :classListIndex="classListIndex"
        :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event + item.name)" class="choosable-items-list list-options">
      </choosable-items-list>
    </div>
  </li>
</template>

<script>
import ChoosableItemsList from './ChoosableItemsList.vue'

import itemSlot from '../../mixins/itemSlot.js'

import {mapState} from 'vuex'

export default {
  name: 'StaticAbility',
  mixins: [itemSlot],
  components: {
    'choosable-items-list': ChoosableItemsList
  },

  props: {
    lastModuleToClickItem: String,
    classListIndex: Number
  },

  computed: {
    ...mapState('character', [
      'options'
    ])
  }
}
</script>

<style>
</style>
