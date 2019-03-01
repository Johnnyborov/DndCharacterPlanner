<template>
  <div @mouseenter="$emit('enter-child')">
    <ul class="scrollable-list" ref='scrollable-ul'>
      <li @click="itemChosenHandler(-1)" class="remove-option">Remove</li>
      <available-item v-for="item in itemsList" :key="item.id" :item="item" :moduleType="moduleType"
        @item-chosen="itemChosenHandler" class="available-item" />
    </ul>
  </div> 
</template>

<script>
import AvailableItem from './AvailableItem.vue'

import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'AvailableItemsList',
  components: {
    'available-item': AvailableItem,
  },

  props: {
    moduleType: String,
    slotId: Number,
    classListIndex: Number
  },

  computed: {  
    ...mapGetters('database', [
      'filteredRaces',
      'filteredFeats',
      'filteredClasses',
      'filteredSubclasses',
      'filteredCantrips',
      'filteredSpells'
    ]),

    itemsList() {
      switch(this.moduleType) {
        case 'race':
          return this.filteredRaces
        case 'feats':
          return this.filteredFeats
        case 'class':
          return this.filteredClasses(this.classListIndex)
        case 'subclass':
          return this.filteredSubclasses(this.classListIndex)
        case 'cantrips':
          return this.filteredCantrips(this.classListIndex)
        case 'spells':
          return this.filteredSpells(this.classListIndex)
      }
    }
  },
  
  methods: {
    ...mapActions('character', [
      'setItem'
    ]),

    itemChosenHandler(itemId) {
      this.setItem({type: this.moduleType, classListIndex: this.classListIndex, slotId: this.slotId, itemId: itemId})
    }
  }
}
</script>

<style>
</style>
