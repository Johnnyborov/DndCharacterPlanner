<template>
  <div>
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Race</p>
      <choosable-items-list :moduleType="'race'" :moduleId="'race'"
        :choosableSource="[race]" :availableSource="filteredRaces"
        @item-chosen="setRace($event.item)"
        :lastModuleToClickItem="lastModuleToClickItem" @slot-clicked="$emit('slot-clicked', $event)" class="choosable-items-list list-single" />
    </div>

    <base-stats class="base-stats" />
    
    <div style="display:flex;direction:row;justify-content:space-between;">
      <p>Character Level:</p><p>{{totalLevel}}</p>
    </div>

    <div style="background-color:olive;margin: 1vmin 0 1vmin 0;" v-for="(cls, classIndex) in classes" :key="classIndex">
      <div style="display:flex;direction:row;justify-content:space-between;">
        <p>Class</p>
        <choosable-items-list :moduleType="'class'" :moduleId="'class'+classIndex"
          :choosableSource="[classes[classIndex].class]" :availableSource="filteredClasses"
          @item-chosen="setClass({classIndex: classIndex, cls: $event.item})"
          :lastModuleToClickItem="lastModuleToClickItem" @slot-clicked="$emit('slot-clicked', $event)" class="choosable-items-list list-single" />
      </div>

      <div v-show="showSubclass(classIndex)"
        style="display:flex;direction:row;justify-content:space-between;">
        <p>Subclass</p>
        <choosable-items-list :moduleType="'subclass'" :moduleId="'subclass'+classIndex"
          :choosableSource="[classes[classIndex].subclass]" :availableSource="filteredSubclasses(classIndex)"
          @item-chosen="setSubclass({classIndex: classIndex, subclass: $event.item})"
          :lastModuleToClickItem="lastModuleToClickItem" @slot-clicked="$emit('slot-clicked', $event)" class="choosable-items-list list-single" />
      </div>

      <div style="display:flex;direction:row;justify-content:space-between;margin: 1vmin 0 1vmin 0;">
        <p>Class Level</p>
        <select :value="classes[classIndex].level" @change="levelChangedHandler(classIndex, $event)" style="margin: 0.5vmin">
          <option v-for="lvl in possibleLevels(classIndex)" :key="lvl" :value="lvl">
            {{lvl}}
          </option>
        </select>
      </div>

      <button v-show="canRemoveClass" @click="removeClass(classIndex)" style="background-color:red;width:100%">Remove Class</button>
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
      'race',
      'classes',
    ]),

    ...mapGetters('character', [
      'totalLevel',
      'canAddClass',
      'canRemoveClass'
    ]),

    ...mapGetters('database', [
      'filteredRaces',
      'filteredClasses',
      'filteredSubclasses',
    ])
  },

  methods: {
    ...mapActions('character', [
      'setRace',
      'setClass',
      'setSubclass',
      'setLevel',
      'addClass',
      'removeClass'
    ]),

    levelChangedHandler(index, event) {
      this.setLevel({classIndex: index, level: Number(event.target.value)})
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
