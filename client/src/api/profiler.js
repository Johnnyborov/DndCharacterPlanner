const debug = process.env.NODE_ENV !== 'production'
const url = debug ? 'http://localhost:5000/api/profiler/list' : '/api/profiler/list'

export default {
  getSpellsList(func) {
    //setTimeout(() => func(list), 1000)

    fetch(url).then(responce => responce.json()).then(json => func(json))
  }
}