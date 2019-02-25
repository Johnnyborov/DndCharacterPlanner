import 'whatwg-fetch'

const debug = process.env.NODE_ENV !== 'production'
const baseUrl = debug ? 'http://localhost:5000/api/planner' : '/api/planner'

function jsonResponsePromise(url, options) {
  return new Promise(resolve => {
    fetch(url, options)
    .then(response => {
      if (response.ok)
        return response.json()
      else
        throw new Error(response.status + ' ' + response.statusText)
    })
    .catch(error => {
      throw new Error(error.message)
    })
    .then(json => {
      resolve(json)
    })
    .catch(error => {
      console.log('Error: ' + error.message)
    })
  })  
}

function timeoutPromise(arg) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(arg)
    }, 100)
  })
}


const racesList = [
  {id: 100, name: 'Human'},
  {id: 101, name: 'Dwarf'},
  {id: 102, name: 'Hill Dwarf'},
  {id: 103, name: 'Mountain Dwarf'}
]
const classesList = [
  {id: 200, name: 'Fighter', subclasses: [
    {id: 300, name: 'Champion'},
    {id: 301, name: 'Samurai'}
  ]},
  {id: 201, name: 'Sorcerer', subclasses: [
    {id: 310, name: 'Draconic Bloodline'},
    {id: 311, name: 'Wild Magic'},
    {id: 312, name: 'Divine Soul'}
  ]},
]

const amounts = {
  class: {
    'Sorcerer': {start: 2, increases: [2,3,10,17,20]},
    'Fighter': {start: 2, increases: [2,3,5,9]}
  },
  subclass: {
    'Sorcerer': {start: 1, increases: [7,10,15,18]},
    'Fighter': {start: 1, increases: [6,14,18]}
  },
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

const classAbilitiesList = []
const subclassAbilitiesList = []
const featsList = [
  {id: 1, name: 'stats+1x6', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}, {index: 2, value: 1}, {index: 3, value: 1}, {index: 4, value: 1}, {index: 5, value: 1}]},

  {id: 10, name: 'stats+1x2', bonusStats: []},
  {id: 11, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}]},
  {id: 12, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 2, value: 1}]},
  {id: 13, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 3, value: 1}]},
  {id: 14, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 4, value: 1}]},
  {id: 15, name: 'stats+1x2', bonusStats: [{index: 0, value: 1}, {index: 5, value: 1}]},
  {id: 22, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 2, value: 1}]},
  {id: 23, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 3, value: 1}]},
  {id: 24, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 4, value: 1}]},
  {id: 25, name: 'stats+1x2', bonusStats: [{index: 1, value: 1}, {index: 5, value: 1}]},
  {id: 33, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 3, value: 1}]},
  {id: 34, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 4, value: 1}]},
  {id: 35, name: 'stats+1x2', bonusStats: [{index: 2, value: 1}, {index: 5, value: 1}]},
  {id: 44, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 4, value: 1}]},
  {id: 45, name: 'stats+1x2', bonusStats: [{index: 3, value: 1}, {index: 5, value: 1}]},
  {id: 55, name: 'stats+1x2', bonusStats: [{index: 4, value: 1}, {index: 5, value: 1}]},

  {id: 60, name: 'stats+2', bonusStats: []},
  {id: 61, name: 'stats+2', bonusStats: [{index: 0, value: 2}]},
  {id: 62, name: 'stats+2', bonusStats: [{index: 1, value: 2}]},
  {id: 63, name: 'stats+2', bonusStats: [{index: 2, value: 2}]},
  {id: 64, name: 'stats+2', bonusStats: [{index: 3, value: 2}]},
  {id: 65, name: 'stats+2', bonusStats: [{index: 4, value: 2}]},
  {id: 66, name: 'stats+2', bonusStats: [{index: 5, value: 2}]},
]


const startCharacter = {
  race: 'Hill Dwarf',
  class: 'Sorcerer',
  subclass: 'Wild Magic',
  level: 20,
  stats: [8,14,15,10,8,15],
  classAbilities: [],
  subclassAbilities: [],
  feats: [],
  cantrips: [],
  spells: [],
}

export default {
  getStartCharacter() {
    return timeoutPromise(JSON.parse(JSON.stringify(startCharacter)))
  },


  getRacesList() {
    return timeoutPromise(racesList)
  },

  getClassesList() {
    return timeoutPromise(classesList)
  },


  getAmounts() {
    return timeoutPromise(amounts)
  },


  getClassAbilitiesList() {
    return timeoutPromise(classAbilitiesList)
  },

  getSubclassAbilitiesList() {
    return timeoutPromise(subclassAbilitiesList)
  },

  getFeatsList() {
    return timeoutPromise(featsList)
  },

  getCantripsList() {
    return jsonResponsePromise(baseUrl + '/spelllist')
  },

  getSpellsList() {
    return jsonResponsePromise(baseUrl + '/spelllist')
  },


  saveCharacter(char) {
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(char)
    }

    return jsonResponsePromise(baseUrl + '/savecharacter', options)
  },

  getCharacter(id) {
    return jsonResponsePromise(baseUrl + '/getcharacter?id=' + id)
  }
}