import api from '../../api/profiler.js'

export function statName(index) {
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

export function statIndex(name) {
  switch(name) {
    case 'str':
      return 0
    case 'agi':
      return 1
    case 'con':
      return 2
    case 'wis':
      return 3
    case 'int':
      return 4
    case 'cha':
      return 5
  }
}

export default {
  namespaced: true,

  state: {
    characterBaseStats: [],
    bonusValues: []
  },

  getters: {
    realStatValue: (state) => (index) => {
      return Math.min(20, state.characterBaseStats[index].value + state.bonusValues[index])
    },

    baseStatsValues: (state) => {
      return state.characterBaseStats.map(stat => stat.value)
    }
  },

  mutations: {
    setBonusValues(state, values) {
      state.bonusValues = values
    },

    setBaseStats(state, statValues) {
      let i = 0
      let stats = statValues.map(statValue => {return { name: statName(i++), value: statValue }})
      state.characterBaseStats = stats
    },

    setBaseStatValue(state, {index, value}) {
      state.characterBaseStats[index].value = value
    }
  },

  actions: {
    initializeModule({commit, dispatch}) {
      api.getBaseStats(stats => {
        commit('setBaseStats', stats)
        
        dispatch('calculateBonusValues')
      })
    },

    calculateBonusValues({commit, rootState}) {
      let bonusValues = [0, 0, 0, 0, 0, 0]

      rootState['abilities'].chosenSpellsList.forEach(abiltiy => {
        if (abiltiy.id !== -1) {
          abiltiy.bonusStats.forEach(bonusStat => {
            bonusValues.splice(bonusStat.index, 1, bonusValues[bonusStat.index] + bonusStat.value)
          })
        }
      })

      rootState['feats'].chosenSpellsList.forEach(feat => {
        if (feat.id !== -1) {
          feat.bonusStats.forEach(bonusStat => {
            bonusValues.splice(bonusStat.index, 1, bonusValues[bonusStat.index] + bonusStat.value)
          })
        }
      })


      commit('setBonusValues', bonusValues)
    }
  }
}