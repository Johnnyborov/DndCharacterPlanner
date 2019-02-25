import api from '../../api/planner.js'

function isVariation(id) {
  if (id > 10 && id < 60 || id > 60 && id < 70) return true

  return false
}

function canHaveMultiple(id) {
  switch(id) {
    case 70:
    case 75:
      return true
  }

  return false
}

function sameClass(item, rootState) {
  if (typeof(item.classes) === 'undefined') return true

  let currentClass = rootState['character'].class.name
  let isDivineSoul = rootState['character'].subclass === 'Divine Soul'
  let found = item.classes.find(c => c === currentClass || isDivineSoul && c === 'Cleric')
  if (found) return true

  return false
}

function enoughLevel(item, rootState) {
  if (typeof(item.level) === 'undefined') return true

  if (item.level * 2 - 1 <= rootState['character'].level) return true

  return false
}

function satisfiesCharacterConfig(item, rootState) {
  if (!enoughLevel(item, rootState))
    return false

  if (!sameClass(item, rootState))
    return false

  return true
}

function isAppropriateType(item, state) {
  if (typeof(item.level) === 'undefined') return true

  if (state.type === 'cantrips' && item.level === 0 || state.type === 'spells' && item.level > 0) return true

  return false
}


export default {
  namespaced: true,

  state() {
    return {
      type: '',

      availableItems: [],

      choosableItems: []
    }
  },

  getters: {
    choosableItem: (state) => (id) => {
      if (id === -1) return { id: -1 }
      
      return state.availableItems.find(item => item.id === id)
    },

    filteredAvailableItems: (state, getters, rootState) => {
      return state.availableItems.filter(availableItem => {
        if (!isAppropriateType(availableItem, state))
          return false

        if (isVariation(availableItem.id))
          return false


        if (!satisfiesCharacterConfig(availableItem, rootState))
          return false


        let sameItem = state.choosableItems.find(choosableItemId => choosableItemId === availableItem.id)
        if (sameItem && !canHaveMultiple(availableItem.id))
          return false

        return true
      })
    }
  },

  mutations: {
    setType(state, type) {
      state.type = type
    },

    setAvailableItems(state, items) {
      state.availableItems = items
    },

    setChoosableItems(state, items) {
      state.choosableItems = items
    },

    setChoosableItemId(state, {slotId, itemId}) {
      state.choosableItems.splice(slotId, 1, itemId)
    }
  },

  actions: {
    initializeModule({commit}, type) {
      commit('setType', type)

      let itemsReceived
      if (type === 'classAbilities') {
        itemsReceived = api.getClassAbilitiesList()
      } else if (type === 'subclassAbilities') {
        itemsReceived = api.getSubclassAbilitiesList()
      } else if (type === 'feats') {
        itemsReceived = api.getFeatsList()
      } else if (type === 'cantrips') {
        itemsReceived = api.getCantripsList()
      } else if (type === 'spells') {
        itemsReceived = api.getSpellsList()
      }

      itemsReceived
      .then(items => commit('setAvailableItems', items))
    },


    setChoosableItemId({state, commit, dispatch}, arg) {
      commit('setChoosableItemId', arg)

      if (state.type === 'classAbilities' || state.type === 'subclassAbilities' || state.type === 'feats') {
        dispatch('character/stats/modifyBonusValues', null, { root: true })
      }
    },


    setChoosableItemsAmount({state, getters, commit, rootState}, amount) {
      let idsList = Array(amount)
      for (let i = 0; i < idsList.length; i++) {
        if (i < state.choosableItems.length && satisfiesCharacterConfig(getters.choosableItem(state.choosableItems[i]), rootState)) {
          idsList[i] = state.choosableItems[i]
        } else {
          idsList[i] = - 1
        }
      }

      commit('setChoosableItems', idsList)
    }
  }
}