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


const startCharacter = {
  race: 1001,
  class: 2001,
  subclass: 3011,
  level: 20,
  stats: [8,14,15,10,8,15],
  classAbilities: [],
  subclassAbilities: [],
  feats: [],
  cantrips: [],
  spells: [],
}


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
  {id: 3000, name: 'Champion', class: 2000},
  {id: 3001, name: 'Samurai', class: 2000},
  {id: 3010, name: 'Draconic Bloodline', class: 2001},
  {id: 3011, name: 'Wild Magic', class: 2001},
  {id: 3012, name: 'Divine Soul', class: 2001}
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

  getSubclassesList() {
    return timeoutPromise(subclassesList)
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
    return jsonResponsePromise(baseUrl + '/cantripslist')
  },

  getSpellsList() {
    return jsonResponsePromise(baseUrl + '/spellslist')
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