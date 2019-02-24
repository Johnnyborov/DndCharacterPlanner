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

function sameClass(spell, rootState) {
  if (typeof(spell.classes) === 'undefined') return true

  let currentClass = rootState['classConfig'].class
  let isDivineSoul = rootState['classConfig'].subclass === 'Divine Soul'
  let found = spell.classes.find(c => c === currentClass || isDivineSoul && c === 'Cleric')
  if (found) return true

  return false
}

function enoughLevel(spell, rootState) {
  if (typeof(spell.level) === 'undefined') return true

  if (spell.level * 2 - 1 <= rootState['classConfig'].level) return true

  return false
}

function satisfiesClassConfig(spell, rootState) {
  if (!enoughLevel(spell, rootState))
    return false

  if (!sameClass(spell, rootState))
    return false

  return true
}

function isAppropriateType(spell, state) {
  if (typeof(spell.level) === 'undefined') return true

  if (state.type === 'cantrips' && spell.level === 0 || state.type === 'spells' && spell.level > 0) return true

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
      
      return state.availableSpells.find(spell => spell.id === id)
    },

    choosableSpells: (state, getters, rootState) => {
      return state.availableSpells.filter(availableSpell => {
        if (!isAppropriateType(availableSpell, state))
          return false

        if (isVariation(availableSpell.id))
          return false


        if (!satisfiesClassConfig(availableSpell, rootState))
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

      if (type === 'abilities') {
        api.getAbilitiesList(setterFunction)
      } else if (type === 'feats') {
        api.getFeatsList(setterFunction)
      } else if (type === 'cantrips') {
        api.getSpellsList(setterFunction)
      } else if (type === 'spells') {
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


    setChosenSpellsAmount({state, getters, commit, rootState}, amount) {
      let idsList = Array(amount)
      for (let i = 0; i < idsList.length; i++) {
        if (i < state.chosenSpells.length && satisfiesClassConfig(getters.chosenSpell(state.chosenSpells[i]), rootState)) {
          idsList[i] = state.chosenSpells[i]
        } else {
          idsList[i] = - 1
        }
      }

      commit('setChosenSpells', idsList)
    }
  }
}