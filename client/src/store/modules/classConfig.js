import api from '../../api/planner.js'

function getListAmount(state, amountsType) {
  let start = state.amountsDictionary[amountsType][state.class].start
  let increases = state.amountsDictionary[amountsType][state.class].increases.filter(lvl => lvl <= state.level)
  let amount = start + increases.length

  return amount
}

function setAmounts(state, dispatch) {
  if (state.class === 'Fighter') {
    dispatch('abilities/setChosenSpellsAmount', 4, {root: true})
    dispatch('feats/setChosenSpellsAmount', 5, {root: true})
  } else if (state.class === 'Sorcerer') {
    dispatch('abilities/setChosenSpellsAmount', 3, {root: true})
    dispatch('feats/setChosenSpellsAmount', 4, {root: true})
  }


  dispatch('cantrips/setChosenSpellsAmount', getListAmount(state, 'cantrips'), {root: true})
  dispatch('spells/setChosenSpellsAmount', getListAmount(state, 'spells'), {root: true})
}

export default {
  namespaced: true,

  state: {
    class: '',
    subclass: '',
    level: 0,

    amountsDictionary: null
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
    },

    setAmountsDictionary(state, dictionary) {
      state.amountsDictionary = dictionary
    }
  },

  actions: {
    initializeModule({state, commit, dispatch}, vueContext) {
      api.getClassConfig(config => {
        commit('setClass', config.class)
        vueContext.$nextTick(() => commit('setSubclass', config.subclass))
        commit('setLevel', config.level)
        
        api.getAmounts(amounts => {
          commit('setAmountsDictionary', amounts)

          setAmounts(state, dispatch)
        })
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