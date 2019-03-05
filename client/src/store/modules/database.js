import api from '../../api/planner.js'

const statsTwice = [
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
  {id: 155, name: 'stats+1x2', bonusStats: [{index: 4, value: 1}, {index: 5, value: 1}]}
]

const statsOnce = [
  {id: 160, name: 'stats+2', bonusStats: []},
  {id: 161, name: 'stats+2', bonusStats: [{index: 0, value: 2}]},
  {id: 162, name: 'stats+2', bonusStats: [{index: 1, value: 2}]},
  {id: 163, name: 'stats+2', bonusStats: [{index: 2, value: 2}]},
  {id: 164, name: 'stats+2', bonusStats: [{index: 3, value: 2}]},
  {id: 165, name: 'stats+2', bonusStats: [{index: 4, value: 2}]},
  {id: 166, name: 'stats+2', bonusStats: [{index: 5, value: 2}]}
]

const featsList = [
  {id: 200, name: 'feat1'},
  {id: 201, name: 'feat2'},
  {id: 202, name: 'feat3'},
  {id: 203, name: 'feat4'},
  {id: 204, name: 'feat5'}
]


const racesList = [
  {id: 1000, name: 'Human (Normal)', abilities: [
    {
      id: 4000, name: 'Ability Score Increase',
      bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}, {index: 2, value: 1},
        {index: 3, value: 1}, {index: 4, value: 1}, {index: 5, value: 1}],
      increases: []
    }
  ]},

  {id: 1001, name: 'Human (Variant)', abilities: [
    {id: 4011, name: 'Ability Score Increase', increases: []},
    {id: 4022, name: 'Variant Human Stats',
      optionOnly: true, options: statsTwice, increases: [1]},
    {id: 4033, name: 'Variant Human Feat',
      optionOnly: true, options: featsList, increases: [1]},
    {id: 4044, name: 'Variant Human Skill',
      optionOnly: true, options: [{id: 5300, name: 'SkillChooser'}], increases: [1]}
  ]},

  {id: 1010, name: 'Dwarf', abilities: []},
  {id: 1011, name: 'Hill Dwarf', abilities: []},
  {id: 1012, name: 'Mountain Dwarf', abilities: []}
]


const database = {
  races: racesList,
  feats: statsTwice.concat(statsOnce, featsList)
}

function isVariation(id) {
  if (id >= 111 && id <= 155 || id >= 161 && id <= 166) return true
  if (id >= 5111 && id <= 5155) return true

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
    database: {
      races: [],
      feats: [],
  
      cantrips: [],
      spells: [],
      classes: []
    }
  },

  getters: {
    filteredRaces: (state, getters, rootState, rootGetters) => {
      return state.database.races.filter(race => {
        let alreadyChosen = rootState['character'].character.race.id === race.id

        return !alreadyChosen
      })
    },

    filteredFeats: (state, getters, rootState, rootGetters) => {
      return state.database.feats.filter(feat => {
        let alreadyChosen = rootState['character'].character.feats.findIndex(f => f.id === feat.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](feat, 'feat')

        return !isVariation(feat.id) && satisfiesCharacterConfig && (!alreadyChosen || canHaveMultiple(feat.id))
      })
    },

    filteredRaceAbilities: (state, getters, rootState, rootGetters) => {
      let raceAbilities = rootState['character'].character.race.abilities
      if (!raceAbilities) return []

      return raceAbilities.filter(ability => {
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](ability, 'raceAbility')

        return satisfiesCharacterConfig
      })
    },

    filteredClassAbilities: (state, getters, rootState, rootGetters) => (index) => {
      let classAbilities = rootState['character'].character.classes[index].class.abilities
      if (!classAbilities) return []

      return classAbilities.filter(ability => {
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](ability, 'classAbility', index)

        return satisfiesCharacterConfig
      })
    },

    filteredSubclassAbilities: (state, getters, rootState, rootGetters) => (index) => {
      let subclassAbilities = rootState['character'].character.classes[index].subclass.abilities
      if (!subclassAbilities) return []

      return subclassAbilities.filter(ability => {
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](ability, 'classAbility', index)

        return satisfiesCharacterConfig
      })
    },

    filteredOptions: (state, getters, rootState, rootGetters) => (ability) => {
      return ability.options.filter(option => {
        let alreadyChosen = false
        for (let i = 0; i < rootState['character'].character.classes.length; i++) {
          let options = rootState['character'].character.classes[i].options
          Object.keys(options).forEach(abilityName => {
            let alreadyChosenByClass = options[abilityName].findIndex(o => o.name === option.name) !== -1

            if (alreadyChosenByClass) alreadyChosen = true
          })
        }

        return !isVariation(option.id) && !alreadyChosen
      })
    },

    filteredClasses: (state, getters, rootState, rootGetters) => {
      return state.database.classes.filter(cls => {
        let alreadyChosen = rootState['character'].character.classes.findIndex(c => c.class.id === cls.id) !== -1
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](cls, 'class')
        
        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredSubclasses: (state, getters, rootState, rootGetters) => (index) => {
      let subclasses = rootState['character'].character.classes[index].class.subclasses
      if (!subclasses) return []

      return subclasses.filter(subclass => {
        let alreadyChosen = rootState['character'].character.classes[index].subclass.id === subclass.id
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](subclass, 'subclass', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredCantrips: (state, getters, rootState, rootGetters) => (index) => {
      return state.database.cantrips.filter(cantrip => {
        let alreadyChosen = false
        for (let i = 0; i < rootState['character'].character.classes.length; i++) {
          let alreadyChosenByClass = rootState['character'].character.classes[i].cantrips.findIndex(c => c.id === cantrip.id) !== -1

          if (alreadyChosenByClass) alreadyChosen = true
        }

        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](cantrip, 'cantrip', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    },

    filteredSpells: (state, getters, rootState, rootGetters) => (index) => {
      return state.database.spells.filter(spell => {
        let alreadyChosen = false
        for (let i = 0; i < rootState['character'].character.classes.length; i++) {
          let alreadyChosenByClass = rootState['character'].character.classes[i].spells.findIndex(s => s.id === spell.id) !== -1

          if (alreadyChosenByClass) alreadyChosen = true
        }

        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](spell, 'spell', index)

        return satisfiesCharacterConfig && !alreadyChosen
      })
    }
  },

  mutations: {
    setDatabase(state, database) {
      state.database = database
    }
  },

  actions: {
    load({commit}) {
      api.getDndDatabase()
      .then(db => {
        database.cantrips = db.cantrips
        database.spells = db.spells
        database.classes = db.classes
        commit('setDatabase', database)
      })
    }
  }
}