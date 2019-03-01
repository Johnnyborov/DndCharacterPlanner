<template>
  <div>
    <slot></slot>
    <ul>
      <choosable-item v-for="(item, index) in itemsList" :key="index" :slotId="index" :item="item" :currentlyClickedSlotId="currentlyClickedSlotId"
        @clicked-item="clickedSlotHandler" :moduleType="moduleType" class="choosable-item" />
    </ul>
    
    <div :style="{'top': avaliableItemsPosY + 'px', 'position': 'absolute'}">
      <available-items-list v-show="currentlyClickedSlotId !== -1" ref="available-items" :classListIndex="classListIndex"
        :slotId="currentlyClickedSlotId" :moduleType="moduleType" class="available-items-list" />
    </div>
  </div>
</template>

<script>
import ChoosableItem from './ChoosableItem.vue'
import AvailableItemsList from './AvailableItemsList.vue'

import {mapState} from 'vuex'

export default {
  name: 'ChoosableItemsList',
  components: {
    'choosable-item': ChoosableItem,
    'available-items-list': AvailableItemsList
  },

  props: {
    moduleType: String,
    lastModuleToClickItem: String,
    classListIndex: Number
  },

  data() {
    return {
      currentlyClickedSlotIdData: -1,
      avaliableItemsPosY: 0
    }
  },

  computed: {
    ...mapState('character', [
      'race',
      'feats',
      'classes',
    ]),

    itemsList() {
      switch(this.moduleType) {
        case 'race':
          return [this.race]
        case 'feats':
          return this.feats
        case 'class':
          return [this.classes[this.classListIndex].class]
        case 'subclass':
          return [this.classes[this.classListIndex].subclass]
        case 'cantrips':
          return this.classes[this.classListIndex].cantrips
        case 'spells':
          return this.classes[this.classListIndex].spells
        case 'classAbilities':
        case 'subclassAbilities':
          return []
      }
    },

    currentlyClickedSlotId() {
      if (this.lastModuleToClickItem !== this.moduleType && this.lastModuleToClickItem !== this.moduleType + this.classListIndex)
        this.currentlyClickedSlotIdData = -1
        
      return this.currentlyClickedSlotIdData
    }
  },

  methods: {
    clickedSlotHandler({slotId, posY}) {
      this.currentlyClickedSlotIdData = slotId
      this.avaliableItemsPosY = posY

      this.$nextTick(function() { // wait for display change back to visible
        this.$refs['available-items'].$refs['scrollable-ul'].scrollTop = 0
      })

      this.$emit('item-clicked', this.moduleType)
    }
  }
}
</script>

<style>
</style>
