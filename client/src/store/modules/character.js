function idToItem(id, array) {
  if (id === -1) return {id: -1}

  let item = array.find(s => s.id === id)

  return item
}

function makeNewList(amount, state, getters, type, index) {
  let oldList = []
  let itemType = ''
  switch(type) {
    case 'feats':
      oldList = state.feats
      itemType = 'feat'
      break
    case 'cantrips':
      oldList = state.classes[index].cantrips
      itemType = 'cantrip'
      break
    case 'spells':
      oldList = state.classes[index].spells
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

  for (let i = 0; i < state.classes.length; i++) {
    let abilities = rootGetters['database/filteredAbilities'](i)
    
    abilities.forEach(a => {
      let increases = rootState['database'].amounts.options[a.name]
      if (typeof(increases) !== 'undefined') {
        let amount = increases.filter(lvl => lvl <= state.classes[i].level).length
  
        let oldList = state.options[a.name]
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
  if (state.classes[i].class.id === -1) return 0

  let increases = listAmounts[state.classes[i].class.name].filter(lvl => lvl <= state.classes[i].level)

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
    race: {id: -1},
    stats: [13,13,13,12,12,12],
    feats: [],
    options: {},

    classes: [JSON.parse(JSON.stringify(emptyClass))]
  },

  getters: {
    totalLevel(state) {
      let sum = 0
      state.classes.forEach(c => {
        sum = sum + c.level
      })

      return sum
    },

    canAddClass(state, getters, rootState) {
      return getters.totalLevel < 20 && state.classes.length < rootState['database'].classes.length
    },

    canRemoveClass(state) {
      return state.classes.length > 1
    },

    satisfiesCharacterConfig: (state) => (item, type, index) => {
      switch(type) {
        case 'feat': {
          return true
        }
        case 'ability': {
          let className = state.classes[index].class.name
          let isForCurrentClass = item.classes.findIndex(c => c === className) !== -1

          let enoughLevel = item.level <= state.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        case 'class': {
          return true
        }
        case 'subclass': {
          let isForCurrentClass = item.classId === state.classes[index].class.id

          let enoughLevel = typeof(item.level) === 'undefined' ? true : item.level <= state.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        case 'cantrip':
        case 'spell': {
          if (item.id === -1) return true

          let className = state.classes[index].class.name
          let isDivineSoul = state.classes[index].subclass.name === 'Divine Soul'
          let isForCurrentClass = item.classes.findIndex(c => c === className || isDivineSoul && c === 'Cleric') !== -1
    
          let enoughLevel = item.level * 2 - 1 <= state.classes[index].level

          return isForCurrentClass && enoughLevel
        }
        default:
          return false
      }
    }
  },

  mutations: {
    setFeatsList(state, feats) {
      state.feats = feats
    },

    setOptionsObject(state, options) {
      state.options = options
    },

    setCantripsList(state, {classListIndex, cantrips}) {
      state.classes[classListIndex].cantrips = cantrips
    },

    setSpellsList(state, {classListIndex, spells}) {
      state.classes[classListIndex].spells = spells
    },

    addClass(state) {
      state.classes.push(JSON.parse(JSON.stringify(emptyClass)))
    },

    removeClass(state, classListIndex) {
      state.classes.splice(classListIndex, 1)
    },

    setCharacter(state, character) {
      state.race = character.race
      state.stats = character.stats
      state.feats = character.feats

      state.classes = character.classes
    },


    setRace(state, race) {
      state.race = race
    },

    setStat(state, {index, value}) {
      state.stats.splice(index, 1, value)
    },

    setFeat(state, {pos, feat}) {
      state.feats.splice(pos, 1, feat)
    },


    setClass(state, {classListIndex, cls}) {
      state.classes[classListIndex].class = cls
    },

    setSubclass(state, {classListIndex, subclass}) {
      state.classes[classListIndex].subclass = subclass
    },

    setLevel(state, {classListIndex, level}) {
      state.classes[classListIndex].level = level
    },

    setCantrip(state, {classListIndex, pos, cantrip}) {
      state.classes[classListIndex].cantrips.splice(pos, 1, cantrip)
    },

    setSpell(state, {classListIndex, pos, spell}) {
      state.classes[classListIndex].spells.splice(pos, 1, spell)
    },

    setOption(state, {pos, abilityName, option}) {
      state.options[abilityName].splice(pos, 1, option)
    }
  },

  actions: {
    setCharacter({commit, dispatch}, character) {
      commit('setCharacter', character)

      dispatch('checkSubclass')

      dispatch('setAmounts')
    },

    setItem({rootState, commit, dispatch}, {type, classListIndex, slotId, itemId, abilityName}) {
      switch(type) {
        case 'race':
          let race = idToItem(itemId, rootState['database'].races)
          commit('setRace', race)
          dispatch('setAmounts')
          break
        case 'feats':
          let feat = idToItem(itemId, rootState['database'].feats)
          commit('setFeat', {pos: slotId, feat: feat})
          dispatch('setAmounts')
          break

        case 'class':
          let cls = idToItem(itemId, rootState['database'].classes)
          commit('setClass', {classListIndex: classListIndex, cls: cls})
          dispatch('checkSubclass')
          dispatch('setAmounts')
          break
        case 'subclass':
          let subclass = idToItem(itemId, rootState['database'].subclasses)
          commit('setSubclass', {classListIndex: classListIndex, subclass: subclass})
          dispatch('setAmounts')
          break
        case 'cantrips':
          let cantrip = idToItem(itemId, rootState['database'].cantrips)
          commit('setCantrip', {classListIndex: classListIndex, pos: slotId, cantrip: cantrip})
          break
        case 'spells':
          let spell = idToItem(itemId, rootState['database'].spells)
          commit('setSpell', {classListIndex: classListIndex, pos: slotId, spell: spell})
          break

        case 'options':
          let option = idToItem(itemId, rootState['database'].options[abilityName])
          commit('setOption', {pos: slotId, abilityName: abilityName, option: option})
          break
      }
    },

    setLevel({commit, dispatch}, arg) {
      commit('setLevel', arg)

      dispatch('checkSubclass')

      dispatch('setAmounts')
    },

    setAmounts({state, getters, rootState, rootGetters, commit}) {
      let totalFeatsAmount = 0
      if (state.race.id === 1001) totalFeatsAmount += 1 // Human +1x2 + 1 feat

      for (let i = 0; i < state.classes.length; i++) {
        let featsAmount = getListAmount(state, i, rootState['database'].amounts.feats)
        let cantripsAmount = getListAmount(state, i, rootState['database'].amounts.cantrips)
        let spellsAmount = getListAmount(state, i, rootState['database'].amounts.spells)

        if (state.classes[i].class.name === 'Sorcerer') {
          if (state.classes[i].subclass.name === 'Divine Soul') {
            spellsAmount += 1
          }
        }
        totalFeatsAmount += featsAmount

        commit('setCantripsList', {classListIndex: i, cantrips: makeNewList(cantripsAmount, state, getters, 'cantrips', i)})
        commit('setSpellsList', {classListIndex: i, spells: makeNewList(spellsAmount, state, getters, 'spells', i)})
      }

      commit('setFeatsList', makeNewList(totalFeatsAmount, state, getters, 'feats'))

      setNewOptions(state, rootState, rootGetters, commit)
    },

    checkSubclass({state, getters, commit}) {
      for (let i = 0; i < state.classes.length; i++) {
        if (!getters.satisfiesCharacterConfig(state.classes[i].subclass, 'subclass', i)) {
          commit('setSubclass', {classListIndex: i, subclass: {id: -1}})
        }
      }
    },

    addClass({getters, commit, dispatch}) {
      if (getters.canAddClass) {
        commit('addClass')

        dispatch('setAmounts')
      }
    },

    removeClass({getters, commit, dispatch}, classListIndex) {
      if (getters.canRemoveClass){
        commit('removeClass', classListIndex)

        dispatch('setAmounts')
      }
    }
  }
}