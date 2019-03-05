function makeNewList(amount, state, getters, type, index) {
  let oldList = []
  let itemType = ''
  switch(type) {
    case 'feats':
      oldList = state.character.feats
      itemType = 'feat'
      break
    case 'cantrips':
      oldList = state.character.classes[index].cantrips
      itemType = 'cantrip'
      break
    case 'spells':
      oldList = state.character.classes[index].spells
      itemType = 'spell'
      break
  }

  let newList = Array(amount)
  for (let i = 0; i < newList.length; i++) {
    if (i < oldList.length && getters.satisfiesCharacterConfig(oldList[i], itemType, index)) {
      newList[i] = oldList[i]
    } else {
      newList[i] = {id: - 1}
    }
  }

  return newList
}

function setNewOptions(state, commit) {
  {
    let newOptions = {}
    let oldOptions = state.character.raceOptions
  
    addOptions(newOptions, oldOptions, 1, state.character.race.abilities)

    commit('setRaceOptionsObject', newOptions)
  }


  for (let i = 0; i < state.character.classes.length; i++) {
    let newOptions = {}
    let oldOptions = state.character.classes[i].options

    let classLvl = state.character.classes[i].level
    addOptions(newOptions, oldOptions, classLvl, state.character.classes[i].class.abilities)
    addOptions(newOptions, oldOptions, classLvl, state.character.classes[i].subclass.abilities)

    commit('setClassOptionsObject', {classIndex: i, options: newOptions})
  }
}

function addOptions(newOptions, oldOptions, classLvl, abilities) {
  if (!abilities) return

  abilities.forEach(a => {
    if (a.increases.length > 0) {
      let amount = a.increases.filter(lvl => lvl <= classLvl).length

      let oldList = oldOptions[a.name]
      if (typeof(oldList) === 'undefined') oldList = []

      let newList = Array(amount)
      for (let i = 0; i < newList.length; i++) {
        if (i < oldList.length) {
          newList[i] = oldList[i]
        } else {
          newList[i] = {id: - 1}
        }
      }

      newOptions[a.name] = newList
    }
  })
}

function getListAmount(state, i, type) {
  if (state.character.classes[i].class.id === -1) return 0

  let increases
  switch(type) {
    case 'feats':
      let feats = state.character.classes[i].class.feats
      increases = feats.filter(lvl => lvl <= state.character.classes[i].level)
      break
    case 'cantrips':
      let cantrips = state.character.classes[i].class.cantrips
      increases = cantrips.filter(lvl => lvl <= state.character.classes[i].level)
      break
    case 'spells':
      let spells = state.character.classes[i].class.spells
      increases = spells.filter(lvl => lvl <= state.character.classes[i].level)
      break
  }

  return increases.length
}

const emptyClass = {
  class: {id: -1},
  level: 1,
  subclass: {},
  cantrips: [],
  spells: [],
  options: {}
}

export default {
  namespaced: true,

  state: {
    character: {
      race: {id: -1},
      raceOptions: {},
      stats: [13,13,13,12,12,12],
      feats: [],
      classes: [JSON.parse(JSON.stringify(emptyClass))]
    }
  },

  getters: {
    totalLevel(state) {
      let sum = 0
      state.character.classes.forEach(c => {
        sum = sum + c.level
      })

      return sum
    },

    canAddClass(state, getters, rootState) {
      return getters.totalLevel < 20 && state.character.classes.length < rootState['database'].database.classes.length
    },

    canRemoveClass(state) {
      return state.character.classes.length > 1
    },

    satisfiesCharacterConfig: (state) => (item, type, index) => {
      switch(type) {
        case 'feat': {
          return true
        }
        case 'raceAbility': {
          return true
        }
        case 'classAbility': {
          let enoughLevel = item.level <= state.character.classes[index].level

          return enoughLevel
        }
        case 'class': {
          return true
        }
        case 'subclass': {
          // check isForCurrentClass in case of class/level change
          let isForCurrentClass = false
          if (state.character.classes[index].class.subclasses) {
            isForCurrentClass = state.character.classes[index].class.subclasses
              .findIndex(sub => sub.id === item.id) !== -1
          }
          

          let enoughLevel = item.level <= state.character.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        case 'cantrip':
        case 'spell': {
          if (item.id === -1) return false // oldList value when called from makeNewList

          let className = state.character.classes[index].class.name
          let isDivineSoul = state.character.classes[index].subclass.name === 'Divine Soul'
          let isForCurrentClass = item.classes.findIndex(c => c === className || isDivineSoul && c === 'Cleric') !== -1
    
          let enoughLevel = item.level * 2 - 1 <= state.character.classes[index].level

          return isForCurrentClass && enoughLevel
        }
      }
    }
  },

  mutations: {
    setCharacter(state, character) {
      state.character = character
    },

    setRace(state, race) {
      state.character.race = race
    },

    setStat(state, {index, value}) {
      state.character.stats.splice(index, 1, value)
    },

    setFeat(state, {pos, feat}) {
      state.character.feats.splice(pos, 1, feat)
    },

    setClass(state, {classIndex, cls}) {
      state.character.classes[classIndex].class = cls
    },

    setSubclass(state, {classIndex, subclass}) {
      state.character.classes[classIndex].subclass = subclass
    },

    setLevel(state, {classIndex, level}) {
      state.character.classes[classIndex].level = level
    },

    setCantrip(state, {classIndex, pos, cantrip}) {
      state.character.classes[classIndex].cantrips.splice(pos, 1, cantrip)
    },

    setSpell(state, {classIndex, pos, spell}) {
      state.character.classes[classIndex].spells.splice(pos, 1, spell)
    },

    setRaceOption(state, {pos, abilityName, option}) {
      state.character.raceOptions[abilityName].splice(pos, 1, option)
    },

    setClassOption(state, {classIndex, pos, abilityName, option}) {
      state.character.classes[classIndex].options[abilityName].splice(pos, 1, option)
    },

    setFeatsList(state, feats) {
      state.character.feats = feats
    },

    setRaceOptionsObject(state, options) {
      state.character.raceOptions = options
    },

    setClassOptionsObject(state, {classIndex, options}) {
      state.character.classes[classIndex].options = options
    },

    setCantripsList(state, {classIndex, cantrips}) {
      state.character.classes[classIndex].cantrips = cantrips
    },

    setSpellsList(state, {classIndex, spells}) {
      let start = Date.now()
      state.character.classes[classIndex].spells = spells
      console.log(Date.now() - start)
    },

    addClass(state) {
      state.character.classes.push(JSON.parse(JSON.stringify(emptyClass)))
    },

    removeClass(state, classIndex) {
      state.character.classes.splice(classIndex, 1)
    }
  },

  actions: {
    setCharacter({commit, dispatch}, character) {
      commit('setCharacter', character)
      dispatch('checkSubclass')
      dispatch('setAmounts')
    },

    setRace({commit, dispatch}, arg) {
      commit('setRace', arg)
      dispatch('setAmounts')
    },

    setFeat({commit, dispatch}, arg) {
      commit('setFeat', arg)
      dispatch('setAmounts')
    },

    setClass({commit, dispatch}, arg) {
      commit('setClass', arg)
      dispatch('checkSubclass')
      dispatch('setAmounts')
    },

    setSubclass({commit, dispatch}, arg) {
      commit('setSubclass', arg)
      dispatch('setAmounts')
    },

    setCantrip({commit}, arg) {
      commit('setCantrip', arg)
    },

    setSpell({commit}, arg) {
      commit('setSpell', arg)
    },

    setRaceOption({commit}, arg) {
      commit('setRaceOption', arg)
    },

    setClassOption({commit}, arg) {
      commit('setClassOption', arg)
    },

    setLevel({commit, dispatch}, arg) {
      commit('setLevel', arg)
      dispatch('checkSubclass')
      dispatch('setAmounts')
    },

    setAmounts({state, getters, rootState, rootGetters, commit}) {
      let totalFeatsAmount = 0

      for (let i = 0; i < state.character.classes.length; i++) {
        let featsAmount = getListAmount(state, i, 'feats')
        let cantripsAmount = getListAmount(state, i, 'cantrips')
        let spellsAmount = getListAmount(state, i, 'spells')

        totalFeatsAmount += featsAmount

        commit('setCantripsList', {classIndex: i, cantrips: makeNewList(cantripsAmount, state, getters, 'cantrips', i)})
        commit('setSpellsList', {classIndex: i, spells: makeNewList(spellsAmount, state, getters, 'spells', i)})
      }

      commit('setFeatsList', makeNewList(totalFeatsAmount, state, getters, 'feats'))

      setNewOptions(state, commit)
    },

    checkSubclass({state, getters, commit}) {
      for (let i = 0; i < state.character.classes.length; i++) {
        if (!getters.satisfiesCharacterConfig(state.character.classes[i].subclass, 'subclass', i)) {
          commit('setSubclass', {classIndex: i, subclass: {id: -1}})
        }
      }
    },

    addClass({getters, commit, dispatch}) {
      if (getters.canAddClass) {
        commit('addClass')
        dispatch('setAmounts')
      }
    },

    removeClass({getters, commit, dispatch}, classIndex) {
      if (getters.canRemoveClass){
        commit('removeClass', classIndex)
        dispatch('setAmounts')
      }
    }
  }
}