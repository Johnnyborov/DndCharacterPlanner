import api from '../../api/planner.js'

const scoreImprovement = [
  {id: 110, name: 'stats+1x2'},
  {id: 160, name: 'stats+2'}
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
      bonusStats: [{i:0,v:1},{i:1,v:1},{i:2,v:1},{i:3,v:1},{i:4,v:1},{i:5,v:1}],
      increases: []
    }
  ]},

  {id: 1001, name: 'Human (Variant)', abilities: [
    {id: 4011, name: 'Ability Score Increase', increases: []},
    {id: 4022, name: 'Variant Human Stats',
      optionOnly: true, options: [{id: 5400, name: 'stats+1x2'}], increases: [1]},
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
  feats: scoreImprovement.concat(featsList)
}

function canHaveMultiple(id) {
  switch(id) {
    case 110:
    case 160:
    case 5400:
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

        let options = rootState['character'].character.raceOptions
        Object.keys(options).forEach(abilityName => {
          let alreadyChosenByRaceOption = options[abilityName].findIndex(o => o.name === feat.name) !== -1

          if (alreadyChosenByRaceOption) alreadyChosen = true
        })

        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](feat, 'feat')

        return satisfiesCharacterConfig && (!alreadyChosen || canHaveMultiple(feat.id))
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
      if (ability.name === 'Divine Magic') {
        let index = rootState['character'].character.classes.findIndex(c => c.subclass.name === 'Divine Soul')
        return ability.options.filter(option => {
          let alreadyChosen = false
          for (let i = 0; i < rootState['character'].character.classes.length; i++) {
            let alreadyChosenByClass = rootState['character'].character.classes[i].spells.findIndex(s => s.id === option.id) !== -1

            if (alreadyChosenByClass) alreadyChosen = true
          }

          let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](option, 'spell', index)

          return satisfiesCharacterConfig && !alreadyChosen
        })
      } else {
        return ability.options.filter(option => {
          let alreadyChosen = false
          for (let i = 0; i < rootState['character'].character.classes.length; i++) {
            let options = rootState['character'].character.classes[i].options
            Object.keys(options).forEach(abilityName => {
              let alreadyChosenByClass = options[abilityName].findIndex(o => o.name === option.name) !== -1
  
              if (alreadyChosenByClass) alreadyChosen = true
            })
          }

          let options = rootState['character'].character.raceOptions
          Object.keys(options).forEach(abilityName => {
            let alreadyChosenByRace = options[abilityName].findIndex(o => o.name === option.name) !== -1

            if (alreadyChosenByRace) alreadyChosen = true
          })

          let alreadyChosenByFeat = rootState['character'].character.feats
          .findIndex(f => f.name === option.name) !== -1

          if (alreadyChosenByFeat) alreadyChosen = true

  
          return !alreadyChosen || canHaveMultiple(option.id)
        })
      }
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
          let chosenInSpells = rootState['character'].character.classes[i].spells.findIndex(s => s.id === spell.id) !== -1
          
          let options = rootState['character'].character.classes[i].options
          let chosenInOptions = Object.keys(options)
            .findIndex(oName => options[oName].findIndex(o => o.id === spell.id) !== -1) !== -1

          if (chosenInSpells || chosenInOptions) alreadyChosen = true
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

        let dm = database.classes.find(c => c.name === 'Sorcerer').subclasses
          .find(sc => sc.name === 'Divine Soul').abilities.find(a => a.name === 'Divine Magic')
        dm.options = database.spells.filter(s => s.classes.findIndex(c => c === 'Cleric') !== -1)

        let afs = database.classes.find(c => c.name === 'Fighter').subclasses
          .find(sc => sc.name === 'Champion').abilities.find(a => a.name === 'Additional Fighting Style')
        afs.options = database.classes.find(c => c.name === 'Fighter').abilities
          .find(a => a.name === 'Fighting Style').options

        commit('setDatabase', database)
      })
    }
  }
}