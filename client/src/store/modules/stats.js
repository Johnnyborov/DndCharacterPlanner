import api from '../../api/planner.js'

function modifyBonusValuesFrom(moduleName, bonusValues, rootState, rootGetters) {
  rootState[moduleName].choosableItems.forEach(itemId => {
    let item = rootGetters[moduleName + '/choosableItem'](itemId)
    if (typeof(item.bonusStats) !== 'undefined') {
      item.bonusStats.forEach(bonusStat => {
        bonusValues.splice(bonusStat.index, 1, bonusValues[bonusStat.index] + bonusStat.value)
      })
    }
  })
}

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
    baseStats: [],
    bonusValues: []
  },

  getters: {
    realStatValue: (state) => (index) => {
      return Math.min(20, state.baseStats[index] + state.bonusValues[index])
    },

    characterSkills: (state, getters) => {
      let skills = Array(10).fill(0)

      return skills
    }
  },

  mutations: {
    setBonusValues(state, values) {
      state.bonusValues = values
    },

    setBaseStats(state, values) {
      state.baseStats = values
    },

    setBaseStatValue(state, {index, value}) {
      state.baseStats.splice(index, 1, value)
    }
  },

  actions: {
    initializeModule({commit, dispatch}) {
      api.getBaseStats(stats => {
        commit('setBaseStats', stats)
        
        dispatch('calculateBonusValues')
      })
    },

    calculateBonusValues({commit, rootState, rootGetters}) {
      let bonusValues = [0, 0, 0, 0, 0, 0]

      modifyBonusValuesFrom('classAbilities', bonusValues, rootState, rootGetters)
      modifyBonusValuesFrom('subclassAbilities', bonusValues, rootState, rootGetters)
      modifyBonusValuesFrom('feats', bonusValues, rootState, rootGetters)

      
      commit('setBonusValues', bonusValues)
    }
  }
}