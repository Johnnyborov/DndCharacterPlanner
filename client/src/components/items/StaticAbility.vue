<template>
  <li class="item-slot">
    <div v-if="!item.optionOnly" @mouseenter="enterHandler" @mouseleave="leaveHandler" class="item-slot choosable-item disabled-item">
      {{levelText}}{{item.name}}

      <div :style="{'position': 'absolute', 'top': posY + 'px'}">
        <item-tooltip v-if="mouseOver" :item="item" :moduleType="moduleType" :posX="posX" class="item-tooltip" />
      </div>
    </div>
  

    <div v-if="typeof(character.options[item.name]) !== 'undefined'">
      <choosable-items-list :moduleType="'options'" :moduleId="'options'+item.name"
        :choosableSource="character.options[item.name]" :availableSource="filteredOptions(item.name)"
        @item-chosen="setOption({pos: $event.slotId, abilityName: item.name, option: $event.item})"
        :lastModuleToClickItem="lastModuleToClickItem" @slot-clicked="$emit('slot-clicked', $event)" class="choosable-items-list list-options" />
    </div>
  </li>
</template>

<script>
import ChoosableItemsList from './ChoosableItemsList.vue'

import itemSlot from '../../mixins/itemSlot.js'

import {mapState, mapGetters, mapActions} from 'vuex'

export default {
  name: 'StaticAbility',
  mixins: [itemSlot],
  components: {
    'choosable-items-list': ChoosableItemsList
  },

  props: {
    lastModuleToClickItem: String
  },

  computed: {
    ...mapState('character', [
      'character'
    ]),

    ...mapGetters('database', [
      'filteredOptions'
    ])
  },

  methods: {
    ...mapActions('character', [
      'setOption'
    ])
  }
}
</script>

<style>
</style>
