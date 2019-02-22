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

function updateStats(state, dispatch) {
  if (state.type === 'abilities' || state.type === 'feats') {
    dispatch('stats/calculateBonusValues', null, { root: true })
  }
}

export default {
  namespaced: true,

  state() {
    return {
      type: '',

      availableSpells: [],

      chosenSpells: []
    }
  },

  getters: {
    chosenSpell: (state) => (id) => {
      if (id === -1) return { id: -1 }
      
      return state.availableSpells.find(spell => spell.id == id)
    },

    choosableSpells: (state) => {
      return state.availableSpells.filter(availableSpell => {
        if (isVariation(availableSpell.id))
          return false

        let sameSpell = state.chosenSpells.find(chosenSpellId => chosenSpellId === availableSpell.id)
        if (sameSpell && !canHaveMultiple(availableSpell.id))
          return false

        return true
      })
    }
  },

  mutations: {
    setType(state, type) {
      state.type = type
    },

    setAvailableSpells(state, spells) {
      state.availableSpells = spells
    },

    setChosenSpells(state, spells) {
      state.chosenSpells = spells
    },

    setChosenSpellId(state, {slotId, spellId}) {
      state.chosenSpells.splice(slotId, 1, spellId)
    }
  },

  actions: {
    initializeModule({commit}, type) {
      commit('setType', type)


      let setterFunction = spells => {
        commit('setAvailableSpells', spells)
      }

      if (type == 'abilities') {
        api.getAbilitiesList(setterFunction)
      } else if (type == 'feats') {
        api.getFeatsList(setterFunction)
      } else if (type == 'spells') {
        api.getSpellsList(setterFunction)
      }
    },


    setChosenSpells({state, commit, dispatch}, spells) {
      commit('setChosenSpells', spells)

      updateStats(state, dispatch)
    },

    setChosenSpellId({state, commit, dispatch}, arg) {
      commit('setChosenSpellId', arg)

      updateStats(state, dispatch)
    },


    setChosenSpellsAmount({commit}, amount) {
      let idsList = Array(amount).fill(-1)
      commit('setChosenSpells', idsList)
    }
  }
}