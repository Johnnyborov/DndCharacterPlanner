import api from '../../api/planner.js'

function getListAmount(state, amountsType) {
  let start = state.amountsDictionary[amountsType][state.class].start
  let increases = state.amountsDictionary[amountsType][state.class].increases.filter(lvl => lvl <= state.level)
  let amount = start + increases.length

  return amount
}

function setAmounts(state, dispatch) {
  let classAmount = getListAmount(state, 'class')
  let subclassAmount = getListAmount(state, 'subclass')

  let featsAmount = getListAmount(state, 'feats')

  let cantripsAmount = getListAmount(state, 'cantrips')
  let spellsAmount = getListAmount(state, 'spells')


  if (state.race === 'Human') featsAmount += 1 // state.race === |id of Human(1 feat + 1x2 stat)|
  if (state.class === 'Sorcerer') {  
    if (state.subclass === 'Divine Soul') {
      spellsAmount += 1
    }
  }

  
  dispatch('classAbilities/setChoosableItemsAmount', classAmount, {root: true})
  dispatch('subclassAbilities/setChoosableItemsAmount', subclassAmount, {root: true})

  dispatch('feats/setChoosableItemsAmount', featsAmount, {root: true})

  dispatch('cantrips/setChoosableItemsAmount', cantripsAmount, {root: true})
  dispatch('spells/setChoosableItemsAmount', spellsAmount, {root: true})
}

export default {
  namespaced: true,

  state: {
    race: '',
    class: '',
    subclass: '',
    level: 0,

    amountsDictionary: null
  },

  mutations: {
    setRace(state, race) {
      state.race = race
    },

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
      api.getCharacterConfig(config => {
        commit('setRace', config.race)
        commit('setClass', config.class)
        vueContext.$nextTick(() => commit('setSubclass', config.subclass))
        commit('setLevel', config.level)
        
        api.getAmounts(amounts => {
          commit('setAmountsDictionary', amounts)

          setAmounts(state, dispatch)
        })
      })
    },

    setRace({state, commit, dispatch}, value) {
      commit('setRace', value)

      setAmounts(state, dispatch)
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