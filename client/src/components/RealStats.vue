<template>
  <div>
    <div>
      <p>Real Stat Scores:</p>  
      <ul>
        <li v-for="(stat, index) in stats" :key="index" class="stat">
          {{statName(index)}}
          {{realStatValues[index]}}
        </li>
      </ul>
    </div>

    <div>
      <p>Skills:</p>
      <ul>
        <li v-for="(skill, index) in [0,0,0,0,0,0,0,0,0,0]" :key="index" class="stat">
          {{skill}}
        </li>
      </ul>
    </div>
  </div>
</template>


<script>
import {mapState} from 'vuex'

function modifyBonusValuesFrom(items, bonusValues) {
  items.forEach(item => {
    if (typeof(item.bonusStats) !== 'undefined') {
      item.bonusStats.forEach(bonusStat => {
        bonusValues[bonusStat.index] = bonusValues[bonusStat.index] + bonusStat.value
      })
    }
  })
}

export default {
  name: 'RealStats',

  computed: {
    ...mapState('character', [
      'stats',
      'feats'
    ]),

    bonusValues() {
      let bonusValues = [0, 0, 0, 0, 0, 0]

      modifyBonusValuesFrom(this.feats, bonusValues)

      return bonusValues
    },

    realStatValues() {
      let res = []
      for (let i = 0; i < this.stats.length; i++) {
        res[i] = this.stats[i] + this.bonusValues[i]
      }

      return res
    },
  },

  methods: {
    statName(index) {
      switch(index) {
        case 0:
          return 'str'
        case 1:
          return 'agi'
        case 2:
          return 'con'
        case 3:
          return 'wis'
        case 4:
          return 'int'
        case 5:
          return 'cha'
      }
    }
  }
}
</script>

<style>
</style>
