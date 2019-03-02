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

function setNewOptions(state, rootState, rootGetters, commit) {
  let options = {}

  for (let i = 0; i < state.character.classes.length; i++) {
    let abilities = rootGetters['database/filteredAbilities'](i)
    
    abilities.forEach(a => {
      let increases = rootState['database'].database.amounts.options[a.name]
      if (typeof(increases) !== 'undefined') {
        let amount = increases.filter(lvl => lvl <= state.character.classes[i].level).length
  
        let oldList = state.character.options[a.name]
        if (typeof(oldList) === 'undefined') oldList = []
  
        let newList = Array(amount)
        for (let i = 0; i < newList.length; i++) {
          if (i < oldList.length) {
            newList[i] = oldList[i]
          } else {
            newList[i] = {id: - 1}
          }
        }
  
        options[a.name] = newList
      }
    })
  }

  commit('setOptionsObject', options)
}

function getListAmount(state, i, listAmounts) {
  if (state.character.classes[i].class.id === -1) return 0

  let increases = listAmounts[state.character.classes[i].class.name].filter(lvl => lvl <= state.character.classes[i].level)

  return increases.length
}

const emptyClass = {
  class: {id: -1},
  subclass: {},
  level: 1,
  cantrips: [],
  spells: []
}

export default {
  namespaced: true,

  state: {
    character: {
      race: {id: -1},
      stats: [13,13,13,12,12,12],
      feats: [],
      options: {},
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
        case 'ability': {
          let className = state.character.classes[index].class.name
          let isForCurrentClass = item.classes.findIndex(c => c === className) !== -1

          let enoughLevel = item.level <= state.character.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        case 'class': {
          return true
        }
        case 'subclass': {
          let isForCurrentClass = item.classId === state.character.classes[index].class.id

          let enoughLevel = typeof(item.level) === 'undefined' ? true : item.level <= state.character.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        case 'cantrip':
        case 'spell': {
          if (item.id === -1) return true

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

    setOption(state, {pos, abilityName, option}) {
      state.character.options[abilityName].splice(pos, 1, option)
    },

    setFeatsList(state, feats) {
      state.character.feats = feats
    },

    setOptionsObject(state, options) {
      state.character.options = options
    },

    setCantripsList(state, {classIndex, cantrips}) {
      state.character.classes[classIndex].cantrips = cantrips
    },

    setSpellsList(state, {classIndex, spells}) {
      state.character.classes[classIndex].spells = spells
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

    setOption({commit}, arg) {
      commit('setOption', arg)
    },

    setLevel({commit, dispatch}, arg) {
      commit('setLevel', arg)
      dispatch('checkSubclass')
      dispatch('setAmounts')
    },

    setAmounts({state, getters, rootState, rootGetters, commit}) {
      let totalFeatsAmount = 0
      if (state.character.race.id === 1001) totalFeatsAmount += 1 // Human +1x2 + 1 feat

      for (let i = 0; i < state.character.classes.length; i++) {
        let featsAmount = getListAmount(state, i, rootState['database'].database.amounts.feats)
        let cantripsAmount = getListAmount(state, i, rootState['database'].database.amounts.cantrips)
        let spellsAmount = getListAmount(state, i, rootState['database'].database.amounts.spells)

        if (state.character.classes[i].class.name === 'Sorcerer') {
          if (state.character.classes[i].subclass.name === 'Divine Soul') {
            spellsAmount += 1
          }
        }
        totalFeatsAmount += featsAmount

        commit('setCantripsList', {classIndex: i, cantrips: makeNewList(cantripsAmount, state, getters, 'cantrips', i)})
        commit('setSpellsList', {classIndex: i, spells: makeNewList(spellsAmount, state, getters, 'spells', i)})
      }

      commit('setFeatsList', makeNewList(totalFeatsAmount, state, getters, 'feats'))

      setNewOptions(state, rootState, rootGetters, commit)
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