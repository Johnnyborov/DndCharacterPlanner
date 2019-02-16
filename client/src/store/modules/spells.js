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

  mutations: {
    setType(state, type) {
      state.type = type
    },

    setAvailableSpells(state, list) {
      state.availableSpellsList = list
    },

    setChosenSpells(state, list) {
      state.chosenSpellsList = list
    },

    setChosenSpell(state, {slotId, spell}) {
      state.chosenSpellsList.splice(slotId, 1, spell)
    }
  },

  actions: {
    initializeModule({commit}, {type, amount}) {
      commit('setType', type)


      let chosenSpellsList = Array(amount).fill({id: -1})
      commit('setChosenSpells', chosenSpellsList)



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

    setChosenSpell({state, commit, dispatch}, spell) {
      commit('setChosenSpell', spell)

      if (state.type === 'abilities' || state.type === 'feats') {
        dispatch('stats/calculateBonusValues', null, { root: true })
      }
    }
  }
}