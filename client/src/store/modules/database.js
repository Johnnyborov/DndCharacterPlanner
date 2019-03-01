import api from '../../api/planner.js'


const racesList = [
  {id: 1000, name: 'Human'},
  {id: 1001, name: 'Human (Variant)'},
  {id: 1010, name: 'Dwarf'},
  {id: 1011, name: 'Hill Dwarf'},
  {id: 1012, name: 'Mountain Dwarf'}
]
const classesList = [
  {id: 2000, name: 'Fighter'},
  {id: 2001, name: 'Sorcerer'}
]
const subclassesList = [
  {id: 3000, name: 'Champion', classId: 2000, level: 3},
  {id: 3001, name: 'Samurai', classId: 2000, level: 3},
  {id: 3010, name: 'Draconic Bloodline', classId: 2001},
  {id: 3011, name: 'Wild Magic', classId: 2001},
  {id: 3012, name: 'Divine Soul', classId: 2001}
]


const amounts = {
  feats: {
    'Sorcerer': {start: 0, increases: [4,8,12,16,19]},
    'Fighter': {start: 0, increases: [4,6,8,12,14,16,19]}
  },
  cantrips: {
    'Sorcerer': {start: 4, increases: [4,10]},
    'Fighter': {start: 0, increases: []}
  },
  spells: {
    'Sorcerer': {start: 2, increases: [2,3,4,5,6,7,8,9,10,11,13,15,17]},
    'Fighter': {start: 0, increases: []}
  }
}


const featsList = [
  {id: 100, name: 'stats+1x6', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}, {index: 2, value: 1}, {index: 3, value: 1}, {index: 4, value: 1}, {index: 5, value: 1}]},

  {id: 110, name: 'stats+1x2', bonusStats: []},
  {id: 111, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}]},
  {id: 112, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 2, value: 1}]},
  {id: 113, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 3, value: 1}]},
  {id: 114, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 4, value: 1}]},
  {id: 115, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 5, value: 1}]},
  {id: 122, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 2, value: 1}]},
  {id: 123, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 3, value: 1}]},
  {id: 124, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 4, value: 1}]},
  {id: 125, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 5, value: 1}]},
  {id: 133, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 3, value: 1}]},
  {id: 134, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 4, value: 1}]},
  {id: 135, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 5, value: 1}]},
  {id: 144, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 4, value: 1}]},
  {id: 145, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 5, value: 1}]},
  {id: 155, name: 'stats+1x2', bonusStats: [{index: 4, value: 1}, {index: 5, value: 1}]},

  {id: 160, name: 'stats+2', bonusStats: []},
  {id: 161, name: 'stats+2', bonusStats: [{index: 0, value: 2}]},
  {id: 162, name: 'stats+2', bonusStats: [{index: 1, value: 2}]},
  {id: 163, name: 'stats+2', bonusStats: [{index: 2, value: 2}]},
  {id: 164, name: 'stats+2', bonusStats: [{index: 3, value: 2}]},
  {id: 165, name: 'stats+2', bonusStats: [{index: 4, value: 2}]},
  {id: 166, name: 'stats+2', bonusStats: [{index: 5, value: 2}]},
]


const db = {
  races: racesList,
  classes: classesList,
  subclasses: subclassesList,
  feats: featsList,
  amounts: amounts
}

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

export default {
  namespaced: true,

  state: {
    races: [],
    feats: [],

    classes: [],
    subclasses: [],
    cantrips: [],
    spells: [],

    amounts: {}
  },

  getters: {
    filteredRaces: (state, getters, rootState, rootGetters) => {
      return state.races.filter(race => {
        let alreadyChosen = rootState['character'].race.id === race.id

        return !alreadyChosen
      })
    },

    filteredFeats: (state, getters, rootState, rootGetters) => {
      return state.feats.filter(feat => {
        let alreadyChosen = rootState['character'].feats.findIndex(f => f.id === feat.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](feat, 'feat')

        return !isVariation(feat.id) && satisfiesCharacterConfig && (!alreadyChosen || canHaveMultiple(feat.id))
      })
    },

    filteredClasses: (state, getters, rootState, rootGetters) => (index) => {
      return state.classes.filter(cls => {
        let alreadyChosen = rootState['character'].classes.findIndex(c => c.class.id === cls.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](cls, 'class', index)
        
        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredSubclasses: (state, getters, rootState, rootGetters) => (index) => {
      return state.subclasses.filter(subclass => {
        let alreadyChosen = rootState['character'].classes[index].subclass.id === subclass.id
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](subclass, 'subclass', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredCantrips: (state, getters, rootState, rootGetters) => (index) => {
      return state.cantrips.filter(cantrip => {
        let alreadyChosen = rootState['character'].classes[index].cantrips.findIndex(c => c.id === cantrip.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](cantrip, 'cantrip', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredSpells: (state, getters, rootState, rootGetters) => (index) => {
      return state.spells.filter(spell => {
        let alreadyChosen = rootState['character'].classes[index].spells.findIndex(s => s.id === spell.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](spell, 'spell', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    }
  },

  mutations: {
    setDatabase(state, database) {
      state.races = database.races
      state.feats = database.feats

      state.classes = database.classes
      state.subclasses = database.subclasses
      state.cantrips = database.cantrips
      state.spells = database.spells

      state.amounts = database.amounts
    }
  },

  actions: {
    load({commit}) {
      api.getSpellsList()
      .then(spells => {
        api.getCantripsList()
        .then(cantrips => {
          db.cantrips = cantrips
          db.spells = spells
          commit('setDatabase', db)
        })
      })
    }
  }
}