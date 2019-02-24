<template>
  <div>
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
  name: 'ClassConfig',
  components: {
    'base-stats': BaseStats
  },

  data() {
    return {
      classes: ['Fighter', 'Sorcerer'],

      possibleSubclasses: {'Fighter': ['Champion', 'Samurai'], 'Sorcerer': ['Draconic Bloodline', 'Wild Magic']},

      levels: [1,2,3,4,5]
    }
  },

  computed: {
    ...mapState('classConfig', {
      charClass: 'class',
      charSubclass: 'subclass',
      charLevel: 'level'
    }),

    subClasses() {
      return this.possibleSubclasses[this.charClass]
    }
  },

  methods: {
    classChanged(event) {
      this.$store.dispatch('classConfig/setClass', event.target.value)
    },

    subclassChanged(event) {
      this.$store.dispatch('classConfig/setSubclass', event.target.value)
    },

    levelChanged(event) {
      this.$store.dispatch('classConfig/setLevel', event.target.value)
    }
  }
}
</script>

<style>
</style>
