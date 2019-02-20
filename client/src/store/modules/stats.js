import api from '../../api/planner.js'

function modifyBonusValuesFrom(moduleName, bonusValues, rootState, rootGetters) {
  rootState[moduleName].chosenSpells.forEach(spellId => {
    let spell = rootGetters[moduleName + '/chosenSpell'](spellId)
    if (typeof(spell.bonusStats) !== 'undefined') {
      spell.bonusStats.forEach(bonusStat => {
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
    characterBaseStats: [],
    bonusValues: []
  },

  getters: {
    realStatValue: (state) => (index) => {
      return Math.min(20, state.characterBaseStats[index] + state.bonusValues[index])
    }
  },

  mutations: {
    setBonusValues(state, values) {
      state.bonusValues = values
    },

    setBaseStats(state, values) {
      state.characterBaseStats = values
    },

    setBaseStatValue(state, {index, value}) {
      state.characterBaseStats.splice(index, 1, value)
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

      modifyBonusValuesFrom('abilities', bonusValues, rootState, rootGetters)
      modifyBonusValuesFrom('feats', bonusValues, rootState, rootGetters)

      
      commit('setBonusValues', bonusValues)
    }
  }
}