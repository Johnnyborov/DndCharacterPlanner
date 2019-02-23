require('isomorphic-fetch') // for fetch with IE

const debug = process.env.NODE_ENV !== 'production'
const baseUrl = debug ? 'http://localhost:5000/api/planner' : '/api/planner'

function makeRequest(url, options, func) {
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
    func(json)
  })
  .catch(error => {
    console.log('Error: ' + error.message)
  })
}

const classConfig = {class: 'Sorcerer', subclass: '', level: 1}
const characterBaseStats = [13,13,13,12,12,12]
const abilitiesList = []
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

export default {
  getClassConfig(func) {
    setTimeout(() => func(JSON.parse(JSON.stringify(classConfig))), 100)
  },

  getBaseStats(func) {
    setTimeout(() => func(JSON.parse(JSON.stringify(characterBaseStats))), 100)
  },

  getAbilitiesList(func) {
    setTimeout(() => func(abilitiesList), 100)
  },

  getFeatsList(func) {
    setTimeout(() => func(featsList), 100)
  },

  getSpellsList(func) {
    makeRequest(baseUrl + '/spelllist', null, func)
  },

  saveCharacter(char, func) {
    let options = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(char)
    }

    makeRequest(baseUrl + '/savecharacter', options, func)
  },

  getCharacters() {
    makeRequest(baseUrl + '/getcharacters', null, arg => console.log(arg))
  },

  getCharacter(id, func) {
    makeRequest(baseUrl + '/getcharacter?id=' + id, null, func)
  }
}