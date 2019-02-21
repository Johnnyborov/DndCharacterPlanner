<template>
  <div>
    <div class="base-values">
      <p>Base Values:</p>
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

    <div class="real-values">
      <p>Real Values:</p>
      <ul>
        <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
          {{statName(index)}}
          {{realStatValue(index)}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

import {statName as statNameImported} from '../store/modules/stats.js'

export default {
  name: 'CharacterStats',

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
      'realStatValue'
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
