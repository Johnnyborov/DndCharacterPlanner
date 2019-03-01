<template>
  <div>
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Race</p>
      <choosable-items-list :moduleType="'race'" class="choosable-items-list list-single"
        :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event)" />
    </div>

    <base-stats class="base-stats" />
    
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Character Level:</p><p>{{totalLevel}}</p>
    </div>

    <div style="background-color:olive;margin: 1vmin 0 1vmin 0;" v-for="(cls, index) in classes" :key="index">
      <div style="display:flex;direction:row;justify-content:space-between;">
        <p>Class</p>
        <choosable-items-list :moduleType="'class'" class="choosable-items-list list-single" :classListIndex="index"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event+index)" />
      </div>

      <div v-show="showSubclass(index)"
        style="display:flex;direction:row;justify-content:space-between;">
        <p>Subclass</p>
        <choosable-items-list :moduleType="'subclass'" class="choosable-items-list list-single" :classListIndex="index"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="$emit('item-clicked', $event+index)" />
      </div>

      <div style="display:flex;direction:row;justify-content:space-between;margin: 1vmin 0 1vmin 0;">
        <p>Class Level</p>
        <select :value="classes[index].level" @change="levelChangedHandler(index, $event)" style="margin: 0.5vmin">
          <option v-for="lvl in possibleLevels(index)" :key="lvl" :value="lvl">
            {{lvl}}
          </option>
        </select>
      </div>

      <button v-show="canRemoveClass" @click="removeClass(index)" style="background-color:red;width:100%">Remove Class</button>
    </div>

    <button v-show="canAddClass" @click="addClass" style="background-color:green;">Add New Class</button>
  </div>
</template>

<script>
import ChoosableItemsList from './items/ChoosableItemsList.vue'
import BaseStats from './BaseStats.vue'
import {mapState, mapGetters, mapActions} from 'vuex'

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
      levelsList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    }
  },

  computed: {
    ...mapState('character', [
      'classes'
    ]),

    ...mapGetters('character', [
      'totalLevel',
      'canAddClass',
      'canRemoveClass'
    ]),

    ...mapGetters('database', [
      'filteredSubclasses'
    ])
  },

  methods: {
    ...mapActions('character', [
      'setLevel',
      'addClass',
      'removeClass'
    ]),

    levelChangedHandler(index, event) {
      this.setLevel({classListIndex: index, level: Number(event.target.value)})
    },

    showSubclass(index) {
      if (this.filteredSubclasses(index).length === 0) return false

      return true
    },

    possibleLevels(index) {
      return this.levelsList.filter(lvl => this.totalLevel + lvl - this.classes[index].level <= 20)
    }
  }
}
</script>

<style>
</style>
