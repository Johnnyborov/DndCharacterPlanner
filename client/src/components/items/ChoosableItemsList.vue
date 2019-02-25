<template>
  <div>
    <slot></slot>
    <ul>
      <choosable-item v-for="(itemId, index) in choosableItems" :key="index" :slotId="index" :item="choosableItem(itemId)" :currentlyClickedSlotId="currentlyClickedSlotId"
        @clicked-item="clickedSlotHandler" :moduleType="moduleType" class="choosable-item" />
    </ul>
    
    <div :style="{'top': avaliableItemsPosY + 'px', 'position': 'absolute'}">
      <available-items-list v-show="currentlyClickedSlotId !== -1" ref="available-items"
        :slotId="currentlyClickedSlotId" :moduleType="moduleType" class="available-items-list" />
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
    moduleType: String,
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
      return this.$store.state['character/' + this.moduleType].choosableItems
    },

    currentlyClickedSlotId() {
      if (this.lastModuleToClickItem !== this.moduleType)
        this.currentlyClickedSlotIdData = -1
        
      return this.currentlyClickedSlotIdData
    }
  },

  methods: {
    choosableItem(id) {
      return this.$store.getters['character/' + this.moduleType + '/choosableItem'](id)
    },

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
