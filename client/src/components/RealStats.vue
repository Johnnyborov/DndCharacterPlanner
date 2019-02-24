<template>
  <div>
    <div>
      <p>Real Stat Scores:</p>  
      <ul>
        <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
          {{statName(index)}}
          {{realStatValue(index)}}
        </li>
      </ul>
    </div>

    <div>
      <p>Skills:</p>
      <ul>
        <li v-for="(skill, index) in characterSkills" :key="index" class="stat">
          {{skill}}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import {mapState, mapGetters} from 'vuex'

import {statName as statNameImported} from '../store/modules/stats.js'

export default {
  name: 'RealStats',

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
    }
  }
}
</script>

<style>
</style>
