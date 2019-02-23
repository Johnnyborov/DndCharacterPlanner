<template>
  <div>
    Class
    <select :value="charClass" @input="classChanged($event)">
      <option v-for="cls in classes" :key="cls">
        {{cls}}
      </option>
    </select>

    Subclass
    <select >
    </select>

    Level
    <select :value="charLevel" @input="levelChanged($event)">
      <option v-for="lvl in levels" :key="lvl">
        {{lvl}}
      </option>
    </select>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'ClassControl',

  data() {
    return {
      classes: ['Fighter', 'Sorcerer'],

      levels: [1,2,3,4,5]
    }
  },

  computed: {
    ...mapState('classConfig', {
      charClass: 'class',
      charLevel: 'level'
    })
  },

  methods: {
    classChanged(event) {
      this.$store.commit('classConfig/setClass', event.target.value)

      this.$store.dispatch('classConfig/setAmounts')
    },

    levelChanged(event) {
      this.$store.commit('classConfig/setLevel', event.target.value)

      this.$store.dispatch('classConfig/setAmounts')
    }
  }
}
</script>

<style>
</style>
