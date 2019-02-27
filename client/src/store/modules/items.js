function isVariation(id) {
  if (id >= 111 && id <= 155 || id >= 161 && id <= 166) return true

  return false
}

function canHaveMultiple(id) {
  switch(id) {
    case 170:
    case 175:
      return true
  }

  return false
}

function sameClass(item, state, rootGetters) {
  if (state.type === 'subclass' && rootGetters['character/class/firstItem'].id !== item.class) return false

  if (typeof(item.classes) === 'undefined') return true

  let className = rootGetters['character/class/firstItem'].name
  let isDivineSoul = rootGetters['character/subclass/firstItem'].name === 'Divine Soul'
  let found = item.classes.find(c => c === className || isDivineSoul && c === 'Cleric')
  if (found) return true

  return false
}

function enoughLevel(item, rootState) {
  if (typeof(item.level) === 'undefined') return true

  let level = rootState['character'].level
  if (item.level * 2 - 1 <= level) return true

  return false
}

function satisfiesCharacterConfig(item, state, rootState, rootGetters) {
  if (typeof(rootGetters['character/race/firstItem']) === 'undefined') return false
  if (typeof(rootGetters['character/class/firstItem']) === 'undefined') return false
  if (typeof(rootGetters['character/subclass/firstItem']) === 'undefined') return false


  if (!enoughLevel(item, rootState))
    return false

  if (!sameClass(item, state, rootGetters))
    return false

  return true
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
    firstItem: (state) => {
      if (state.choosableItems[0] === -1) return { id: -1 }
      
      return state.availableItems.find(item => item.id === state.choosableItems[0])
    },

    choosableItem: (state) => (id) => {
      if (id === -1) return { id: -1 }

      return state.availableItems.find(item => item.id === id)
    },

    filteredAvailableItems: (state, getters, rootState, rootGetters) => {
      return state.availableItems.filter(availableItem => {
        if (isVariation(availableItem.id))
          return false


        if (!satisfiesCharacterConfig(availableItem, state, rootState, rootGetters))
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

    setFirstItemId(state, itemId) {
      state.choosableItems.splice(0, 1, itemId)
    },

    setChoosableItemId(state, {slotId, itemId}) {
      state.choosableItems.splice(slotId, 1, itemId)
    }
  },

  actions: {
    setChoosableItemId({state, commit, dispatch}, arg) {
      commit('setChoosableItemId', arg)

      if (state.type === 'classAbilities' || state.type === 'subclassAbilities' || state.type === 'feats'
          || state.type === 'subclass') {

        dispatch('character/stats/modifyBonusValues', null, { root: true })
      }

      if (state.type === 'race' || state.type === 'class' || state.type === 'subclass') {
        dispatch('character/setAmounts', null, { root: true })
      }
    },


    setChoosableItemsAmount({state, getters, commit, rootState, rootGetters}, amount) {
      let idsList = Array(amount)
      for (let i = 0; i < idsList.length; i++) {
        if (i < state.choosableItems.length && satisfiesCharacterConfig(getters.choosableItem(state.choosableItems[i]), state, rootState, rootGetters)) {
          idsList[i] = state.choosableItems[i]
        } else {
          idsList[i] = - 1
        }
      }

      commit('setChoosableItems', idsList)
    }
  }
}