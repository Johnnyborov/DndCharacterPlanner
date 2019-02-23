<template>
  <div>
    <div style="display: flex; flex-direction: column;">
      <class-control class="class-control" />

      <div class="base-values">
        <p>Base Stat Values:</p>
        <ul>
          <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
            {{statName(index)}}
            <select :value="characterBaseStats[index]" @input="updateBaseStatValue(index, $event)">
              <option v-for="val in values" :key="val" :value="val">
                {{val}}
              </option>
            </select>
          </li>
        </ul>
      </div>

      Proficiencies
      <select >
      </select>
      <select >
      </select>
      <select >
      </select>
    </div>

    <div style="display: flex; flex-direction: column;">
      <div class="real-values">
        <p>Real Stat Values:</p>
        <ul>
          <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
            {{statName(index)}}
            {{realStatValue(index)}}
          </li>
        </ul>
      </div>

      <div class="real-values">
        <p>Real Skills Values:</p>
        <ul>
          <li v-for="(skill, index) in characterSkills" :key="index" class="stat">
            {{skill}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ClassControl from './ClassControl.vue'

import {mapState, mapGetters} from 'vuex'

import {statName as statNameImported} from '../store/modules/stats.js'

export default {
  name: 'CharacterStats',
  components: {
    'class-control': ClassControl
  },

  data() {
    return {
      values: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    }
  },

  computed: {
    ...mapState('stats', [
      'characterBaseStats'
    ]),

    ...mapGetters('stats', [
      'realStatValue',
      'characterSkills'
    ])
  },

  methods: {
    statName(index) {
      return statNameImported(index)
    },

    updateBaseStatValue(index, event) {
      this.$store.commit('stats/setBaseStatValue', {index: index, value: Number(event.target.value)})
    }
  }
}
</script>

<style>
</style>
