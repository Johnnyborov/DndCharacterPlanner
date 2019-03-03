<template>
  <div>
    <div>
      <p>Real Stat Scores:</p>  
      <ul>
        <li v-for="(stat, index) in character.stats" :key="index" class="stat">
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
import {mapState, mapGetters} from 'vuex'

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
      'character'
    ]),

    ...mapGetters('database', [
      'filteredRaceAbilities'
    ]),

    bonusValues() {
      let bonusValues = [0, 0, 0, 0, 0, 0]

      modifyBonusValuesFrom(this.character.feats, bonusValues)
      modifyBonusValuesFrom(this.filteredRaceAbilities, bonusValues)
      Object.keys(this.character.options).forEach(abilityName => {
        modifyBonusValuesFrom(this.character.options[abilityName], bonusValues)
      })

      return bonusValues
    },

    realStatValues() {
      let res = []
      for (let i = 0; i < this.character.stats.length; i++) {
        res[i] = Math.min(this.character.stats[i] + this.bonusValues[i], 20)
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
