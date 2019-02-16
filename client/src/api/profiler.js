const debug = process.env.NODE_ENV !== 'production'
const url = debug ? 'http://localhost:5000/api/profiler/list' : '/api/profiler/list'

const characterBaseStats = [
  {name: 'str', value: 12}, {name: 'agi', value: 12}, {name: 'con', value: 12},
  {name: 'wis', value: 12}, {name: 'int', value: 12}, {name: 'cha', value: 12}
]
const abilitiesList = [
  {id: 201, name: 'ability1', bonusStats: [{index: 0, value: 1}]},
  {id: 202, name: 'ability2', bonusStats: [{index: 1, value: 1}]},
  {id: 203, name: 'ability3', bonusStats: [{index: 2, value: 1}]},
  {id: 204, name: 'ability4', bonusStats: [{index: 3, value: 1}]},
  {id: 205, name: 'ability5', bonusStats: [{index: 4, value: 1}]},
  {id: 206, name: 'ability6', bonusStats: [{index: 5, value: 1}]},
]
const featsList = [
  {id: 1, name: 'feat+1x2', bonusStats: []},
  {id: 2, name: 'feat+2x1', bonusStats: []},
  {id: 3, name: 'feat3', bonusStats: [{index: 0, value: 1}, {index: 1, value: 1}, {index: 2, value: 1}, {index: 3, value: 1}, {index: 4, value: 1}, {index: 5, value: 1}]}
]
const spellsList = [
  {id: 1001, name: 'spell1'},
  {id: 1002, name: 'spell2'},
  {id: 1003, name: 'spell3'},
  {id: 1004, name: 'spell4'},
  {id: 1005, name: 'spell5'},
  {id: 1006, name: 'spell6'}
]
export default {
  getBaseStats(func) {
    setTimeout(() => func(characterBaseStats), 100)
  },

  getAbilitiesList(func) {
    setTimeout(() => func(abilitiesList), 100)
  },

  getFeatsList(func) {
    setTimeout(() => func(featsList), 100)
  },

  getSpellsList(func) {
    //fetch(url).then(responce => responce.json()).then(json => func(json))

    setTimeout(() => func(spellsList), 100)
  }
}