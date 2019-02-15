import api from '../../api/profiler.js'

export default {
  namespaced: true,

  state: {
    availableSpellsList: [],

    chosenSpellsList: [{name: ''}, {name: ''}]
  },

  mutations: {
    setAvailableSpells(state, list) {
      state.availableSpellsList = list
    },

    setChosenSpell(state, {id, spell}) {
      state.chosenSpellsList.splice(id, 1, spell)
    }
  },

  actions: {
    getSpellsList({commit}) {
      api.getSpellsList(list => {
        commit('setAvailableSpells', list)
      })
    }
  }
}