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

  let item = array.find(el => el.id == id)

  return item
}

function nameToItem(name, array) {
  let item = array.find(el => el.name === name)

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
      'character'
    ]),

    ...mapState('database', [
      'database'
    ])
  },

  methods: {
    ...mapActions({
      setCharacter: 'character/setCharacter',
    }),


    saveHandler() {
      let options = {}
      Object.keys(this.character.options).forEach(abilityName => {
        let abilityId = nameToItem(abilityName, this.database.abilities).id
        options[abilityId] = this.character.options[abilityName].map(option => option.id)
      })

      let char = {
        raceId: this.character.race.id,
        stats: this.character.stats,
        feats: this.character.feats.map(feat => feat.id),
        options: options,

        classes: this.character.classes.map(c => {
          return {
            classId: c.class.id,
            subclassId: c.subclass.id,
            level: c.level,
            cantrips: c.cantrips.map(cantrip => cantrip.id),
            spells: c.spells.map(spell => spell.id)
          }
        })
      }

      api.saveCharacter(char)
      .then(id => {
        this.characterId = id
      })
    },

    loadHandler() {
      api.getCharacter(this.characterId)
      .then(char => {
          let options = {}
          Object.keys(char.options).forEach(abilityId => {
            let abilityName = idToItem(abilityId, this.database.abilities).name
            options[abilityName] = char.options[abilityId].map(optionId => idToItem(optionId, this.database.options[abilityName]))
          })

          let character = {
          race: idToItem(char.raceId, this.database.races),
          stats: char.stats,
          feats: char.feats.map(id => idToItem(id, this.database.feats)),
          options: options,

          classes: char.classes.map(c => {
            return {
              class: idToItem(c.classId, this.database.classes),
              subclass: idToItem(c.subclassId, this.database.subclasses),
              level: c.level,
              cantrips: c.cantrips.map(id => idToItem(id, this.database.cantrips)),
              spells: c.spells.map(id => idToItem(id, this.database.spells))
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
