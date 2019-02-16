import api from '../../api/profiler.js'

export default {
  namespaced: true,

  state: {
    characterBaseStats: [],
    bonusValues: []
  },

  getters: {
    realStatValue: (state) => (index) => {
      return state.characterBaseStats[index].value + state.bonusValues[index]
    }
  },

  mutations: {
    setBonusValues(state, values) {
      state.bonusValues = values
    },

    setBaseStats(state, stats) {
      state.characterBaseStats = stats
    },

    setBaseStatValue(state, {index, value}) {
      state.characterBaseStats[index].value = value
    }
  },

  actions: {
    initializeModule({commit, dispatch}) {
      dispatch('calculateBonusValues')

      api.getBaseStats(stats => {
        commit('setBaseStats', stats)
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