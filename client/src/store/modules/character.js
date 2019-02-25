import stats from './stats.js'
import api from '../../api/planner.js'

function getListAmount(state, amountsType) {
  let start = state.amountsDictionary[amountsType][state.class.name].start
  let increases = state.amountsDictionary[amountsType][state.class.name].increases.filter(lvl => lvl <= state.level)
  let amount = start + increases.length

  return amount
}

function setAmounts(state, dispatch) {
  let classAmount = getListAmount(state, 'class')
  let subclassAmount = getListAmount(state, 'subclass')

  let featsAmount = getListAmount(state, 'feats')

  let cantripsAmount = getListAmount(state, 'cantrips')
  let spellsAmount = getListAmount(state, 'spells')


  if (state.race.name === 'Human') featsAmount += 1 // state.race.id === |id of Human(1 feat + 1x2 stat)|
  if (state.class.name === 'Sorcerer') {  
    if (state.subclass.name === 'Divine Soul') {
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

export default {
  namespaced: true,
  modules: {
    stats
  },

  state: {
    race: {},
    racesList: [],

    class: {},
    classesList: [],

    subclass: {},

    level: 0,

    amountsDictionary: null
  },

  mutations: {
    setRace(state, race) {
      state.race = race
    },

    setRacesList(state, races) {
      state.racesList = races
    },


    setClass(state, cls) {
      state.class = cls
    },

    setClassesList(state, classes) {
      state.classesList = classes
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
    initializeModule({state, commit, dispatch}) {
      let receiveData = new Promise(resolve => {
        dispatch('classAbilities/initializeModule', 'classAbilities')
        dispatch('subclassAbilities/initializeModule', 'subclassAbilities')
        dispatch('feats/initializeModule', 'feats')
        dispatch('cantrips/initializeModule', 'cantrips')
        dispatch('spells/initializeModule', 'spells')

        api.getRacesList()
        .then(races => commit('setRacesList', races))
        
        api.getClassesList()
        .then(classes => commit('setClassesList', classes))

        api.getAmounts()
        .then(amounts => commit('setAmountsDictionary', amounts))

        api.getStartCharacter()
        .then(char => resolve(char))
      })


      receiveData
      .then(char => {
        dispatch('setCharacter', char)

        setAmounts(state, dispatch)
      })
    },


    setCharacter({state, commit, dispatch}, char) {
      let race = state.racesList.find(r => r.name === char.race)
      commit('setRace', race)

      let cls = state.classesList.find(c => c.name === char.class)
      commit('setClass', cls)

      let subclass = cls.subclasses.find(sc => sc.name === char.subclass)
      commit('setSubclass', subclass)

      commit('setLevel', char.level)


      commit('stats/setBaseStats', char.stats)


      commit('classAbilities/setChoosableItems', char.classAbilities)
      commit('subclassAbilities/setChoosableItems', char.subclassAbilities)
      commit('feats/setChoosableItems', char.feats)
      commit('cantrips/setChoosableItems', char.cantrips)
      commit('spells/setChoosableItems', char.spells)
    },
  
    
    setRaceByName({state, commit, dispatch}, raceName) {
      let race = state.racesList.find(r => r.name === raceName)
      commit('setRace', race)

      setAmounts(state, dispatch)
    },

    setClassByName({state, commit, dispatch}, className) {
      let cls = state.classesList.find(c => c.name === className)
      commit('setClass', cls)

      setAmounts(state, dispatch)
    },

    setSubclassByName({state, commit, dispatch}, subclassName) {
      let subclass = state.class.subclasses.find(sc => sc.name === subclassName)
      commit('setSubclass', subclass)

      setAmounts(state, dispatch)
    },

    setLevel({state, commit, dispatch}, level) {
      commit('setLevel', level)

      setAmounts(state, dispatch)
    }
  }
}