import api from '../../api/planner.js'

function getListAmount(state, amountsType) {
  let start = state.amountsDictionary[amountsType][state.class].start
  let increases = state.amountsDictionary[amountsType][state.class].increases.filter(lvl => lvl <= state.level)
  let amount = start + increases.length

  return amount
}

function setAmounts(state, dispatch) {
  let abilitiesAmount = getListAmount(state, 'abilities')
  let featsAmount = getListAmount(state, 'feats')

  let cantripsAmount = getListAmount(state, 'cantrips')
  let spellsAmount = getListAmount(state, 'spells')

  if (state.class === 'Fighter') {
      ;
  } else if (state.class === 'Sorcerer') {  
    if (state.subclass === 'Divine Soul') {
      spellsAmount += 1
    }
  }

  dispatch('abilities/setChosenSpellsAmount', abilitiesAmount, {root: true})
  dispatch('feats/setChosenSpellsAmount', featsAmount, {root: true})

  dispatch('cantrips/setChosenSpellsAmount', cantripsAmount, {root: true})
  dispatch('spells/setChosenSpellsAmount', spellsAmount, {root: true})
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