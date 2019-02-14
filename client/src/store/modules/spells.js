export default {
  namespaced: true,

  state: {
    spellList: ["spell1", "spell2", "spell3", "spell4"],

    chosenSpells: [{name: "", showList: false}, {name: "", showList: false}],

    prevClicked: -1
  },

  mutations: {
    setChosenSpell(state, {id, name}) {
      state.chosenSpells[id].name = name
    },

    showSpellList(state, id) {
      if (state.prevClicked !== -1) {
        state.chosenSpells[state.prevClicked].showList = false
      }

      state.prevClicked = id
      state.chosenSpells[id].showList = true
    },

    hideSpellList(state) {
      if (state.prevClicked !== -1) {
        state.chosenSpells[state.prevClicked].showList = false
      }

      state.prevClicked = -1
    }
  }
}