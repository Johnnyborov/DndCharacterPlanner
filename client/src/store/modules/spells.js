import api from '../../api/profiler.js'

export default {
  namespaced: true,

  state() {
    return {
      type: '',

      availableSpellsList: [],

      chosenSpellsList: []
    }
  },

  getters: {
    chosenSpellsIds(state) {
      return state.chosenSpellsList.map(spell => spell.id)
    }
  },

  mutations: {
    setType(state, type) {
      state.type = type
    },

    setAvailableSpells(state, list) {
      state.availableSpellsList = list
    },

    setChosenSpells(state, idsList) {
      let list = idsList.map(id => {
        let spell = state.availableSpellsList.find(s => s.id === id)

        if (typeof(spell) === 'undefined')
          spell = {id: -1}
 
        return spell
      })

      state.chosenSpellsList = list
    },

    setChosenSpell(state, {slotId, spellId}) {
      let spell = state.availableSpellsList.find(s => s.id === spellId)
      if (typeof(spell) === 'undefined')
        spell = {id: -1}
 
      state.chosenSpellsList.splice(slotId, 1, spell)
    }
  },

  actions: {
    initializeModule({commit}, type) {
      commit('setType', type)


      let setterFunction = list => {
        commit('setAvailableSpells', list)
      }

      if (type == 'abilities') {
        api.getAbilitiesList(setterFunction)
      } else if (type == 'feats') {
        api.getFeatsList(setterFunction)
      } else if (type == 'spells') {
        api.getSpellsList(setterFunction)
      }
    },

    setChosenSpell({state, commit, dispatch}, spellId) {
      commit('setChosenSpell', spellId)

      if (state.type === 'abilities' || state.type === 'feats') {
        dispatch('stats/calculateBonusValues', null, { root: true })
      }
    },

    setChosenSpellsAmount({commit}, amount) {
      let chosenSpellsList = Array(amount).fill(-1)
      commit('setChosenSpells', chosenSpellsList)
    }
  }
}