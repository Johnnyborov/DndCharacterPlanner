<template>
  <div @mouseenter="$emit('enter-child')">
    <ul class="scrollable-list" ref='scrollable-ul'>
      <li @click="itemChosenHandler(-1)" class="remove-option">Remove</li>
      <available-item v-for="item in choosableItems" :key="item.id" :item="item" :moduleName="moduleName"
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
    moduleName: String,
    slotId: Number
  },

  computed: {  
    choosableItems() {
      return this.$store.getters[this.moduleName + '/choosableItems']
    }
  },
  
  methods: {
    itemChosenHandler(itemId) {
      return this.$store.dispatch(this.moduleName + '/setChoosableItemId', {slotId: this.slotId, itemId: itemId})
    }
  }
}
</script>

<style>
</style>
