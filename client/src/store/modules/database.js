import api from '../../api/planner.js'

const statsTwice = [
  {id: 5110, name: 'stats+1x2', bonusStats: []},
  {id: 5111, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}]},
  {id: 5112, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 2, value: 1}]},
  {id: 5113, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 3, value: 1}]},
  {id: 5114, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 4, value: 1}]},
  {id: 5115, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 5, value: 1}]},
  {id: 5122, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 2, value: 1}]},
  {id: 5123, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 3, value: 1}]},
  {id: 5124, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 4, value: 1}]},
  {id: 5125, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 5, value: 1}]},
  {id: 5133, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 3, value: 1}]},
  {id: 5134, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 4, value: 1}]},
  {id: 5135, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 5, value: 1}]},
  {id: 5144, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 4, value: 1}]},
  {id: 5145, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 5, value: 1}]},
  {id: 5155, name: 'stats+1x2', bonusStats: [{index: 4, value: 1}, {index: 5, value: 1}]}
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
  {id: 1000, name: 'Human'},
  {id: 1001, name: 'Human (Variant)'},
  {id: 1010, name: 'Dwarf'},
  {id: 1011, name: 'Hill Dwarf'},
  {id: 1012, name: 'Mountain Dwarf'}
]
const classesList = [
  {id: 2000, name: 'Fighter'},
  {id: 2001, name: 'Sorcerer'},
  {id: 2002, name: 'Wizard'}
]
const subclassesList = [
  {id: 3000, name: 'Champion', classId: 2000, level: 3},
  {id: 3001, name: 'Samurai', classId: 2000, level: 3},
  {id: 3010, name: 'Draconic Bloodline', classId: 2001},
  {id: 3011, name: 'Wild Magic', classId: 2001},
  {id: 3012, name: 'Divine Soul', classId: 2001, description: "Divine Magic\nYour link to the divine allows you to learn spells normally associated with the cleric class. When your Spellcasting feature lets you learn a sorcerer cantrip or a sorcerer spell of 1st level or higher, you can choose the new spell from the cleric spell list or the sorcerer spell list. You must otherwise obey all the restrictions for selecting the spell, and it becomes a sorcerer spell for you.\n\nIn addition, choose an affinity for the source of your divine power: good, evil, law, chaos, or neutrality. You learn an additional spell based on that affinity, as shown below. It is a sorcerer spell for you, but it doesn't count against your number of sorcerer spells known. If you later replace this spell, you must replace it with a spell from the cleric spell list."}
]

const abilities = [
  {id: 4000, name: 'Spellcasting', classes: ['Sorcerer'], level: 1},
  {id: 4001, name: 'Sorcerous Origin', classes: ['Sorcerer'], level: 1},
  {id: 4002, name: 'Font of Magic', classes: ['Sorcerer'], level: 2},
  {id: 4010, name: 'Metamagic', classes: ['Sorcerer'], level: 3,},
  {id: 4030, name: 'Sorcerous Restoration', classes: ['Sorcerer'], level: 20},

  {id: 4100, name: 'Fighting Style', classes: ['Fighter'], level: 1},
  {id: 4101, name: 'Second Wind', classes: ['Fighter'], level: 1},
  {id: 4102, name: 'Action Surge', classes: ['Fighter'], level: 2},
  {id: 4110, name: 'Martial Archetype', classes: ['Fighter'], level: 3},
  {id: 4120, name: 'Extra Attack', classes: ['Fighter'], level: 5},
  {id: 4130, name: 'Indomitable', classes: ['Fighter'], level: 9},

  {
    id: 6000, name: 'Ability Score Increase', races: [1000],
    bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}, {index: 2, value: 1}, {index: 3, value: 1}, {index: 4, value: 1}, {index: 5, value: 1}]
  },
  {id: 6011, name: 'Variant Human', races: [1001]},
  {id: 6012, name: 'Variant Human Feat', races: [1001], optionOnly: true},
  {id: 6013, name: 'Variant Human Background', races: [1001], optionOnly: true},
  {id: 6014, name: 'Variant Human Language', races: [1001], optionOnly: true}
]

const options = {
  'Metamagic': [
    {id: 5000, name: 'Empowered'},
    {id: 5001, name: 'Twinned'},
    {id: 5002, name: 'Hastened'}
  ],
  'Fighting Style': [
    {id: 5010, name: 'Armor Class'},
    {id: 5011, name: 'One Hand'},
    {id: 5012, name: 'Two Hand'}
  ],

  'Variant Human': statsTwice,
  'Variant Human Feat': featsList,
  'Variant Human Background': [
    {id: 5210, name: 'BackgroundChooser'}
  ],
  'Variant Human Language': [
    {id: 5270, name: 'LangueageChooser'}
  ]
}

const amounts = {
  options: {
    'Metamagic': [3,3,10,17],
    'Fighting Style': [1],
    'Variant Human': [1],
    'Variant Human Feat': [1],
    'Variant Human Background': [1],
    'Variant Human Language': [1]
  },
  feats: {
    'Sorcerer': [4,8,12,16,19],
    'Wizard': [4,8,12,16,19],
    'Fighter': [4,6,8,12,14,16,19]
  },
  cantrips: {
    'Sorcerer': [1,1,1,1,4,10],
    'Wizard': [1,1,1,1,4,10],
    'Fighter': []
  },
  spells: {
    'Sorcerer': [1,1,2,3,4,5,6,7,8,9,10,11,13,15,17],
    'Wizard': [1,1,2,3,4,5,6,7,8,9,10,11,13,15,17],
    'Fighter': []
  }
}


const database = {
  races: racesList,
  classes: classesList,
  subclasses: subclassesList,
  feats: statsTwice.concat(statsOnce, featsList),
  abilities: abilities,
  options: options,
  amounts: amounts
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
      abilities: [],
      options: [],
  
      classes: [],
      subclasses: [],
      cantrips: [],
      spells: [],
  
      amounts: {}
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

    filteredClassAbilities: (state, getters, rootState, rootGetters) => (index) => {
      return state.database.abilities.filter(ability => {
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](ability, 'classAbility', index)

        return satisfiesCharacterConfig
      })
    },

    filteredRaceAbilities: (state, getters, rootState, rootGetters) => {
      return state.database.abilities.filter(ability => {
        let satisfiesCharacterConfig = rootGetters['character/satisfiesCharacterConfig'](ability, 'raceAbility')

        return satisfiesCharacterConfig
      })
    },

    filteredOptions: (state, getters, rootState, rootGetters) => (abilityName) => {
      return state.database.options[abilityName].filter(option => {
        let alreadyChosen = rootState['character'].character.options[abilityName].findIndex(o => o.id === option.id) !== -1

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
      return state.database.subclasses.filter(subclass => {
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
        console.log(db)
        database.cantrips = db.cantrips
        database.spells = db.spells
        commit('setDatabase', database)
      })
    }
  }
}