<template>
  <div>
    <slot></slot>
    <ul>
      <choosable-item v-for="(itemId, index) in choosableItems" :key="index" :slotId="index" :item="choosableItem(itemId)" :currentlyClickedSlotId="currentlyClickedSlotId"
        @clicked-item="clickedSlotHandler" :moduleName="moduleName" class="choosable-item" />
    </ul>
    
    <div :style="{'top': avaliableItemsPosY + 'px', 'position': 'absolute'}">
      <available-items-list v-show="currentlyClickedSlotId !== -1" ref="available-items"
        :slotId="currentlyClickedSlotId" :moduleName="moduleName" class="available-items-list" />
    </div>
  </div>
</template>

<script>
import ChoosableItem from './ChoosableItem.vue'
import AvailableItemsList from './AvailableItemsList.vue'


export default {
  name: 'ChoosableItemsList',
  components: {
    'choosable-item': ChoosableItem,
    'available-items-list': AvailableItemsList
  },

  props: {
    moduleName: String,
    lastModuleToClickItem: String
  },

  data() {
    return {
      currentlyClickedSlotIdData: -1,
      avaliableItemsPosY: 0
    }
  },

  computed: {
    choosableItems() {
      return this.$store.state[this.moduleName].choosableItems
    },

    currentlyClickedSlotId() {
      if (this.lastModuleToClickItem !== this.moduleName)
        this.currentlyClickedSlotIdData = -1
        
      return this.currentlyClickedSlotIdData
    }
  },

  methods: {
    choosableItem(id) {
      return this.$store.getters[this.moduleName + '/choosableItem'](id)
    },

    clickedSlotHandler({slotId, posY}) {
      this.currentlyClickedSlotIdData = slotId
      this.avaliableItemsPosY = posY

      this.$nextTick(function() { // wait for display change back to visible
        this.$refs['available-items'].$refs['scrollable-ul'].scrollTop = 0
      })

      this.$emit('item-clicked', this.moduleName)
    }
  }
}
</script>

<style>
</style>
