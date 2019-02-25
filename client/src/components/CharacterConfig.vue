<template>
  <div>
    Race
    <select :value="charRace.name" @input="raceChanged($event)">
      <option v-for="race in racesList" :key="race.id">
        {{race.name}}
      </option>
    </select>
    Class
    <select :value="charClass.name" @input="classChanged($event)">
      <option v-for="cls in classesList" :key="cls.id">
        {{cls.name}}
      </option>
    </select>

    Subclass
    <select :value="charSubclass.name" @input="subclassChanged($event)">
      <option v-for="sub in charClass.subclasses" :key="sub.id">
        {{sub.name}}
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

import {mapState, mapActions} from 'vuex'

export default {
  name: 'CharacterConfig',
  components: {
    'base-stats': BaseStats
  },

  data() {
    return {
      levels: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    }
  },

  computed: {
    ...mapState('character', {
      charRace: 'race',
      racesList: 'racesList',

      charClass: 'class',
      classesList: 'classesList',

      charSubclass: 'subclass',

      charLevel: 'level'
    })
  },

  methods: {
    ...mapActions('character', [
      'setRaceByName',
      'setClassByName',
      'setSubclassByName',
      'setLevel',
    ]),

    raceChanged(event) {
      this.setRaceByName(event.target.value)
    },

    classChanged(event) {
      this.setClassByName(event.target.value)
    },

    subclassChanged(event) {
      this.setSubclassByName(event.target.value)
    },

    levelChanged(event) {
      this.setLevel(event.target.value)
    }
  }
}
</script>

<style>
</style>
