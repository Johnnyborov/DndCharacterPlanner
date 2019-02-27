import stats from './stats.js'
import api from '../../api/planner.js'

function getListAmount(state, charConfig, amountsType) {
  if (charConfig.class.id === -1) return 0

  let start = state.amountsDictionary[amountsType][charConfig.class.name].start
  let increases = state.amountsDictionary[amountsType][charConfig.class.name].increases.filter(lvl => lvl <= charConfig.level)
  let amount = start + increases.length

  return amount
}


export default {
  namespaced: true,
  modules: {
    stats
  },

  state: {
    level: 0,

    amountsDictionary: null
  },

  mutations: {
    setLevel(state, level) {
      state.level = level
    },

    setAmountsDictionary(state, dictionary) {
      state.amountsDictionary = dictionary
    }
  },

  actions: {
    initializeModule({commit, dispatch}) {
      let receiveData = new Promise(resolve => {
        api.getClassAbilitiesList()
        .then(items => commit('classAbilities/setAvailableItems', items))

        api.getSubclassAbilitiesList()
        .then(items => commit('subclassAbilities/setAvailableItems', items))

        api.getFeatsList()
        .then(items => commit('feats/setAvailableItems', items))

        api.getCantripsList()
        .then(items => commit('cantrips/setAvailableItems', items))

        api.getSpellsList()
        .then(items => commit('spells/setAvailableItems', items))


        api.getRacesList()
        .then(items => commit('race/setAvailableItems', items))
        
        api.getClassesList()
        .then(items => commit('class/setAvailableItems', items))

        api.getSubclassesList()
        .then(items => commit('subclass/setAvailableItems', items))


        api.getAmounts()
        .then(amounts => commit('setAmountsDictionary', amounts))


        api.getStartCharacter()
        .then(char => resolve(char))
      })


      receiveData
      .then(char => { 
        dispatch('setCharacter', char)

        dispatch('setAmounts')
      })
    },


    setCharacter({commit, dispatch}, char) {
      commit('race/setFirstItemId', char.race)
      commit('class/setFirstItemId', char.class)
      commit('subclass/setFirstItemId', char.subclass)
      commit('setLevel', char.level)

      commit('stats/setBaseStats', char.stats)

      commit('classAbilities/setChoosableItems', char.classAbilities)
      commit('subclassAbilities/setChoosableItems', char.subclassAbilities)
      commit('feats/setChoosableItems', char.feats)
      commit('cantrips/setChoosableItems', char.cantrips)
      commit('spells/setChoosableItems', char.spells)

      dispatch('stats/modifyBonusValues')
    },

    setLevel({commit, dispatch}, level) {
      commit('setLevel', level)

      dispatch('setAmounts')
    },
  

    setAmounts({state, dispatch, getters}) {
      let charConfig = {}
      charConfig.race = getters['race/firstItem']
      charConfig.class = getters['class/firstItem']
      charConfig.subclass = getters['subclass/firstItem']
      charConfig.level = state.level


      let classAmount = getListAmount(state, charConfig, 'class')
      let subclassAmount = getListAmount(state, charConfig, 'subclass')  
      let featsAmount = getListAmount(state, charConfig, 'feats')
      let cantripsAmount = getListAmount(state, charConfig, 'cantrips')
      let spellsAmount = getListAmount(state, charConfig, 'spells')

    

      if (charConfig.race.id === 1001) featsAmount += 1 // Human +1x2 + 1 feat
      if (charConfig.class.name === 'Sorcerer') {
        if (charConfig.subclass.name === 'Divine Soul') {
          spellsAmount += 1
        }
      }
    
    
      dispatch('classAbilities/setChoosableItemsAmount', classAmount)
      dispatch('subclassAbilities/setChoosableItemsAmount', subclassAmount)
      dispatch('feats/setChoosableItemsAmount', featsAmount)
      dispatch('cantrips/setChoosableItemsAmount', cantripsAmount)
      dispatch('spells/setChoosableItemsAmount', spellsAmount)
    
      dispatch('stats/modifyBonusValues')
    }
  }
}