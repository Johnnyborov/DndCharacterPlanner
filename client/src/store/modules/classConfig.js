import api from '../../api/planner.js'

function setAmounts(state, dispatch) {
  if (state.class === 'Fighter') {
    dispatch('abilities/setChosenSpellsAmount', 4, {root: true})
    dispatch('feats/setChosenSpellsAmount', 5, {root: true})
    dispatch('spells/setChosenSpellsAmount', 0, {root: true})
  } else if (state.class === 'Sorcerer') {
    dispatch('abilities/setChosenSpellsAmount', 3, {root: true})
    dispatch('feats/setChosenSpellsAmount', 4, {root: true})
    dispatch('spells/setChosenSpellsAmount', 9, {root: true})
  }
}

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
    initializeModule({state, commit, dispatch}, vueContext) {
      api.getClassConfig(config => {
        commit('setClass', config.class)
        vueContext.$nextTick(() => commit('setSubclass', config.subclass))
        commit('setLevel', config.level)
        
        setAmounts(state, dispatch)
      })
    },

    setClass({state, commit, dispatch}, value) {
      commit('setClass', value)

      setAmounts(state, dispatch)
    },

    setSubclass({state, commit, dispatch}, value) {
      commit('setSubclass', value)

      setAmounts(state, dispatch)
    },

    setLevel({state, commit, dispatch}, value) {
      commit('setLevel', value)

      setAmounts(state, dispatch)
    }
  }
}