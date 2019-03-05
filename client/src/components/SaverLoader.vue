<template>
  <div style="display: flex; flex-direction: column;">
    <slot></slot>
    <button @click="saveHandler">Save</button>
    <br />
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
  if (!array) return {id: -1}

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
      let raceOptions = {}
      Object.keys(this.character.raceOptions).forEach(abilityName => {
        let abilityId = nameToItem(abilityName, this.character.race.abilities).id
        raceOptions[abilityId] = this.character.raceOptions[abilityName].map(o => o.id)
      })

      let char = {
        raceId: this.character.race.id,
        stats: this.character.stats,
        feats: this.character.feats.map(feat => feat.id),
        raceOptions: raceOptions,

        classes: this.character.classes.map(c => {
          let options = {}
          Object.keys(c.options).forEach(abilityName => {
            let abilityId = nameToItem(abilityName, c.class.abilities).id
            options[abilityId] = c.options[abilityName].map(o => o.id)
          })

          return {
            classId: c.class.id,
            subclassId: c.subclass.id,
            level: c.level,
            cantrips: c.cantrips.map(cantrip => cantrip.id),
            spells: c.spells.map(spell => spell.id),
            options: options
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
          let character = {
          race: idToItem(char.raceId, this.database.races),
          stats: char.stats,
          feats: char.feats.map(id => idToItem(id, this.database.feats)),

          classes: char.classes.map(c => {
            let cls = {
              class: idToItem(c.classId, this.database.classes),
              level: c.level,
              cantrips: c.cantrips.map(id => idToItem(id, this.database.cantrips)),
              spells: c.spells.map(id => idToItem(id, this.database.spells))
            }

            cls.subclass = idToItem(c.subclassId, cls.class.subclasses)


            let options = {}
            Object.keys(c.options).forEach(abilityId => {
              let ability = idToItem(abilityId, cls.class.abilities)
              options[ability.name] = c.options[abilityId].map(optionId => {
                return idToItem(optionId, ability.options)
              })
            })

            cls.options = options


            return cls
          })
        }

        let raceOptions = {}
        Object.keys(char.raceOptions).forEach(abilityId => {
          let ability = idToItem(abilityId, character.race.abilities)
          raceOptions[ability.name] = char.raceOptions[abilityId].map(optionId => {
            return idToItem(optionId, ability.options)
          })
        })

        character.raceOptions = raceOptions


        this.setCharacter(character)
      })
    }
  }
}
</script>

<style>
</style>
