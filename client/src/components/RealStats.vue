<template>
  <div>
    <div>
      <p>Real Stat Scores:</p>  
      <ul>
        <li v-for="(statName, index) in Object.keys(character.stats)" :key="index" class="stat">
          {{statName}} {{realStatValues[statName]}}
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
    if (item.bonusStats) {
      Object.keys(item.bonusStats).forEach(statName => {
        bonusValues[statName] += item.bonusStats[statName]
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
      'filteredRaceAbilities',
      'filteredClassAbilities'
    ]),

    bonusValues() {
      let bonusValues = {
        'str': 0,
        'agi': 0,
        'con': 0,
        'wis': 0,
        'int': 0,
        'cha': 0
      }

      modifyBonusValuesFrom(this.character.feats, bonusValues)

      {
        modifyBonusValuesFrom(this.filteredRaceAbilities, bonusValues)

        let options = this.character.raceOptions
        Object.keys(options).forEach(abilityName => {
          modifyBonusValuesFrom(options[abilityName], bonusValues)
        })
      }

      for (let i = 0; i < this.character.classes.length; i++) {
        modifyBonusValuesFrom(this.filteredClassAbilities(i), bonusValues)

        let options = this.character.classes[i].options
        Object.keys(options).forEach(abilityName => {
          modifyBonusValuesFrom(options[abilityName], bonusValues)
        })
      }

      return bonusValues
    },

    realStatValues() {
      let res = {}
      Object.keys(this.character.stats).forEach(statName => {
        res[statName] = Math.min(this.character.stats[statName] + this.bonusValues[statName], 20)
      })

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
