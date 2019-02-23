import api from '../../api/planner.js'

export default {
  namespaced: true,

  state: {
    class: '',
    subclass: '',
    level: 0,
  },

  mutations: {
    setClass(state, cls) {
      state.class = cls
    },

    setSubclass(state, subclass) {
      state.subclass = subclass
    },

    setLevel(state, level) {
      state.level = level
    }
  },

  actions: {
    initializeModule({commit, dispatch}) {
      api.getClassConfig(config => {
        commit('setClass', config.class)
        commit('setSubclass', config.subclass)
        commit('setLevel', config.level)

        dispatch('setAmounts')
      })
    },

    setAmounts({state, dispatch}) {
      if (state.class === 'Fighter') {
        dispatch('abilities/setChosenSpellsAmount', 4, {root: true})
        dispatch('feats/setChosenSpellsAmount', 5, {root: true})
        dispatch('spells/setChosenSpellsAmount', 0, {root: true})
      } else if (state.class === 'Sorcerer') {
        dispatch('abilities/setChosenSpellsAmount', 3, {root: true})
        dispatch('feats/setChosenSpellsAmount', 4, {root: true})
        dispatch('spells/setChosenSpellsAmount', 7, {root: true})
      }
    
      dispatch('stats/initializeModule',null, {root: true}) // reset stats state
    }
  }
}