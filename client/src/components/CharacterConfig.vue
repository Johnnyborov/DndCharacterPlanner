<template>
  <div>
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Race</p>
      <choosable-items-list :moduleType="'race'" class="choosable-items-list list-single"
        :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event)" />
    </div>

    <base-stats class="base-stats" />
    
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Character Level:</p><p>{{level}}</p>
    </div>

    <div style="background:olive;margin: 1vmin 0 1vmin 0;" v-for="num in [0,1]" :key="num">
      <div style="display:flex;direction:row;justify-content:space-between;">
        <p>Class</p>
        <choosable-items-list :moduleType="'class'" class="choosable-items-list list-single"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event)" />
      </div>

      <div style="display:flex;direction:row;justify-content:space-between;margin: 1vmin 0 1vmin 0;">
        <p>Class Level</p>
        <select :value="level" @change="levelChangedHandler($event)" style="margin: 0.5vmin">
          <option v-for="lvl in levels" :key="lvl" :value="lvl">
            {{lvl}}
          </option>
        </select>
      </div>

      <div style="display:flex;direction:row;justify-content:space-between;">
        <p>Subclass</p>
        <choosable-items-list :moduleType="'subclass'" class="choosable-items-list list-single"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event)" />
      </div>
    </div>
  </div>
</template>

<script>
import ChoosableItemsList from './items/ChoosableItemsList.vue'
import items from '../store/modules/items.js'

import BaseStats from './BaseStats.vue'

import {mapState, mapActions} from 'vuex'

export default {
  name: 'CharacterConfig',
  components: {
    'choosable-items-list': ChoosableItemsList,
    'base-stats': BaseStats
  },

  props: {
    lastModuleToClickItem: String
  },

  data() {
    return {
      levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    }
  },

  computed: {
    ...mapState('character', [
      'level'
    ])
  },

  methods: {
    ...mapActions('character', [
      'setLevel'
    ]),

    levelChangedHandler(event) {
      this.setLevel(event.target.value)
    }
  },
  
  created() {
    this.$store.registerModule(['character/race'], items)
    this.$store.registerModule(['character/class'], items)
    this.$store.registerModule(['character/subclass'], items)

    this.$store.commit('character/race/setType', 'race')
    this.$store.commit('character/class/setType', 'class')
    this.$store.commit('character/subclass/setType', 'subclass')
  },

  destroyed() {
    this.$store.unregisterModule('character/race')
    this.$store.unregisterModule('character/class')
    this.$store.unregisterModule('character/subclass')
  }
}
</script>

<style>
</style>
