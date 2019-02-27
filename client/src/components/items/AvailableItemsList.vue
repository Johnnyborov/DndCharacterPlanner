<template>
  <div @mouseenter="$emit('enter-child')">
    <ul class="scrollable-list" ref='scrollable-ul'>
      <li v-if="moduleType !== 'race' && moduleType !== 'class' && moduleType !== 'subclass'"
        @click="itemChosenHandler(-1)" class="remove-option">Remove</li>
      <available-item v-for="item in filteredAvailableItems" :key="item.id" :item="item" :moduleType="moduleType"
        @item-chosen="itemChosenHandler" class="available-item" />
    </ul>
  </div> 
</template>

<script>
import AvailableItem from './AvailableItem.vue'

export default {
  name: 'AvailableItemsList',
  components: {
    'available-item': AvailableItem,
  },

  props: {
    moduleType: String,
    slotId: Number
  },

  computed: {  
    filteredAvailableItems() {
      return this.$store.getters['character/' + this.moduleType + '/filteredAvailableItems']
    }
  },
  
  methods: {
    itemChosenHandler(itemId) {
      return this.$store.dispatch('character/' + this.moduleType + '/setChoosableItemId', {slotId: this.slotId, itemId: itemId})
    }
  }
}
</script>

<style>
</style>
