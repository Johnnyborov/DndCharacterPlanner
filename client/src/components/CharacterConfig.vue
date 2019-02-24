<template>
  <div>
    Race
    <select :value="charRace" @input="raceChanged($event)">
      <option v-for="race in races" :key="race">
        {{race}}
      </option>
    </select>
    Class
    <select :value="charClass" @input="classChanged($event)">
      <option v-for="cls in classes" :key="cls">
        {{cls}}
      </option>
    </select>

    Subclass
    <select :value="charSubclass" @input="subclassChanged($event)">
      <option v-for="sub in subClasses" :key="sub">
        {{sub}}
      </option>
    </select>

    Level
    <select :value="charLevel" @input="levelChanged($event)">
      <option v-for="lvl in levels" :key="lvl">
        {{lvl}}
      </option>
    </select>

    <br/>
    Background
    <select >
    </select>

    <br/>
    Proficiencies
    <select >
    </select>
    <select >
    </select>
    <select >
    </select>


    <base-stats class="base-stats" />
  </div>
</template>

<script>
import BaseStats from './BaseStats.vue'

import {mapState} from 'vuex'

export default {
  name: 'CharacterConfig',
  components: {
    'base-stats': BaseStats
  },

  data() {
    return {
      races: ['Human', 'Dwarf', 'Hill Dwarf', 'Mountain Dwarf'],

      classes: ['Fighter', 'Sorcerer'],

      possibleSubclasses: {'Fighter': ['Champion', 'Samurai'], 'Sorcerer': ['Draconic Bloodline', 'Wild Magic', 'Divine Soul']},

      levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    }
  },

  computed: {
    ...mapState('characterConfig', {
      charRace: 'race',
      charClass: 'class',
      charSubclass: 'subclass',
      charLevel: 'level'
    }),

    subClasses() {
      return this.possibleSubclasses[this.charClass]
    }
  },

  methods: {
    raceChanged(event) {
      this.$store.dispatch('characterConfig/setRace', event.target.value)
    },

    classChanged(event) {
      this.$store.dispatch('characterConfig/setClass', event.target.value)
    },

    subclassChanged(event) {
      this.$store.dispatch('characterConfig/setSubclass', event.target.value)
    },

    levelChanged(event) {
      this.$store.dispatch('characterConfig/setLevel', event.target.value)
    }
  }
}
</script>

<style>
</style>
