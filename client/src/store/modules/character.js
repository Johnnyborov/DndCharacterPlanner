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
  
    let changed = false
    if (addOptions(newOptions, oldOptions, 1, state.character.race.abilities))
      changed = true
    if (addOptions(newOptions, oldOptions, 1, state.character.subrace.abilities))
      changed = true

    if (changed)
      commit('setRaceOptionsObject', newOptions)
  }


  for (let i = 0; i < state.character.classes.length; i++) {
    let newOptions = {}
    let oldOptions = state.character.classes[i].options

    let classLvl = state.character.classes[i].level
    let changed = false
    if (addOptions(newOptions, oldOptions, classLvl, state.character.classes[i].class.abilities))
      changed = true
    if (addOptions(newOptions, oldOptions, classLvl, state.character.classes[i].subclass.abilities))
      changed = true

    if (changed)
      commit('setClassOptionsObject', {classIndex: i, options: newOptions})
  }
}

function optionSatisfiesCharacterConfig(option, ability, classLvl) {
  let isForCurrentAbility = ability.options.findIndex(o => o.id === option.id) !== -1
  let enoughLevel = option.level ? option.level * 2 - 1 <= classLvl : true

  return isForCurrentAbility && enoughLevel
}

function addOptions(newOptions, oldOptions, classLvl, abilities) {
  if (!abilities) return false

  let changed = false

  abilities.forEach(a => {
    let amount = a.increases.filter(lvl => lvl <= classLvl).length

    let oldList = oldOptions[a.name]
    if (typeof(oldList) === 'undefined') oldList = []

    let newList = Array(amount)
    if (oldList.length !== newList.length) changed = true
    for (let i = 0; i < newList.length; i++) {
      if (i < oldList.length && optionSatisfiesCharacterConfig(oldList[i], a, classLvl)) {
        newList[i] = oldList[i]
      } else {
        changed = true
        newList[i] = {id: - 1}
      }
    }

    newOptions[a.name] = newList
  })

  return changed
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


function areDifferentLists(oldList, newList) {
  if (oldList.length !== newList.length) return true

  let changed = false
  for (let i = 0; i < oldList.length; i++) {
    if (oldList[i].id !== newList[i].id) changed = true
  }

  return changed
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
    changed: false,

    character: {
      race: {id: -1},
      subrace: {},
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
        case 'subrace': {
          let isForCurrentRace = false
          if (state.character.race.subraces) {
            isForCurrentRace = state.character.race.subraces
              .findIndex(sub => sub.id === item.id) !== -1
          }

          return isForCurrentRace
        }
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
    setChangedFalse(state) {
      state.changed = false
    },

    setCharacter(state, character) {
      state.character = character
      state.changed = true
    },

    setRace(state, race) {
      state.character.race = race
      state.changed = true
    },

    setSubrace(state, subrace) {
      state.character.subrace = subrace
      state.changed = true
    },

    setStat(state, {index, value}) {
      state.character.stats.splice(index, 1, value)
      state.changed = true
    },

    setFeat(state, {pos, feat}) {
      state.character.feats.splice(pos, 1, feat)
      state.changed = true
    },

    setClass(state, {classIndex, cls}) {
      state.character.classes[classIndex].class = cls
      state.changed = true
    },

    setSubclass(state, {classIndex, subclass}) {
      state.character.classes[classIndex].subclass = subclass
      state.changed = true
    },

    setLevel(state, {classIndex, level}) {
      state.character.classes[classIndex].level = level
      state.changed = true
    },

    setCantrip(state, {classIndex, pos, cantrip}) {
      state.character.classes[classIndex].cantrips.splice(pos, 1, cantrip)
      state.changed = true
    },

    setSpell(state, {classIndex, pos, spell}) {
      state.character.classes[classIndex].spells.splice(pos, 1, spell)
      state.changed = true
    },

    setRaceOption(state, {pos, abilityName, option}) {
      state.character.raceOptions[abilityName].splice(pos, 1, option)
      state.changed = true
    },

    setClassOption(state, {classIndex, pos, abilityName, option}) {
      state.character.classes[classIndex].options[abilityName].splice(pos, 1, option)
      state.changed = true
    },

    setFeatsList(state, feats) {
      if (areDifferentLists(state.character.feats, feats)) {
        state.character.feats = feats
        state.changed = true
      }
    },

    setRaceOptionsObject(state, options) {
      state.character.raceOptions = options
      state.changed = true
    },

    setClassOptionsObject(state, {classIndex, options}) {
      state.character.classes[classIndex].options = options
      state.changed = true
    },

    setCantripsList(state, {classIndex, cantrips}) {
      if (areDifferentLists(state.character.classes[classIndex].cantrips, cantrips)) {
        state.character.classes[classIndex].cantrips = cantrips
        state.changed = true
      }
    },

    setSpellsList(state, {classIndex, spells}) {
      if (areDifferentLists(state.character.classes[classIndex].spells, spells)) {
        state.character.classes[classIndex].spells = spells
        state.changed = true
      }
    },

    addClass(state) {
      state.character.classes.push(JSON.parse(JSON.stringify(emptyClass)))
      state.changed = true
    },

    removeClass(state, classIndex) {
      state.character.classes.splice(classIndex, 1)
      state.changed = true
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
      dispatch('checkSubrace')
      dispatch('setAmounts')
    },

    setSubrace({commit, dispatch}, arg) {
      commit('setSubrace', arg)
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

    checkSubrace({state, getters, commit}) {
      if (!getters.satisfiesCharacterConfig(state.character.subrace, 'subrace')) {
        commit('setSubrace', {id: -1})
      }
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