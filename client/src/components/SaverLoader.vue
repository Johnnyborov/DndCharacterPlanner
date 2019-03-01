<template>
  <div style="display: flex; flex-direction: column;">
    <slot></slot>
    <button @click="saveHandler">Save</button>
    
    Id to load:
    <input v-model="characterId"/>
    <button @click="loadHandler">Load</button>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'

import api from '../api/planner.js'

function idToItem(id, array) {
  if (id === -1) return {id: -1}

  let item = array.find(s => s.id === id)

  return item
}

export default {
  name: 'SaverLoader',

  data() {
    return {
      characterId: ''
    }
  },

  computed: {
    ...mapState('character', [
      'race',
      'stats',
      'feats',
      'classes'
    ]),

    ...mapState('database', {
      racesDb: 'races',
      featsDb: 'feats',
      classesDb: 'classes',
      subclassesDb: 'subclasses',
      spellsDb: 'spells'
    })
  },

  methods: {
    ...mapActions({
      setCharacter: 'character/setCharacter',
    }),


    saveHandler() {
      let character = {
        raceId: this.race.id,
        stats: this.stats,
        feats: this.feats.map(feat => feat.id),

        classes: this.classes.map(c => {
          return {
            classId: c.class.id,
            subclassId: c.subclass.id,
            level: c.level,
            spells: c.spells.map(spell => spell.id)
          }
        })
      }

      api.saveCharacter(character)
      .then(id => {
        this.characterId = id
      })
    },

    loadHandler() {
      api.getCharacter(this.characterId)
      .then(char => {
          let character = {
          race: idToItem(char.raceId, this.racesDb),
          stats: char.stats,
          feats: char.feats.map(id => idToItem(id, this.featsDb)),

          classes: char.classes.map(c => {
            return {
              class: idToItem(c.classId, this.classesDb),
              subclass: idToItem(c.subclassId, this.subclassesDb),
              level: c.level,
              spells: c.spells.map(id => idToItem(id, this.spellsDb))
            }
          })
        }

        this.setCharacter(character)
      })
    }
  }
}
</script>

<style>
</style>
