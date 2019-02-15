export default {
  namespaced: true,

  state: {
    availableSpellsList: [{name: 'spell1'}, {name: 'spell2'}, {name: 'spell3'}, {name: 'spell4'}],

    chosenSpellsList: [{name: ''}, {name: ''}]
  },

  mutations: {
    setChosenSpell(state, {id, spell}) {
      state.chosenSpellsList.splice(id, 1, spell)
    }
  }
}