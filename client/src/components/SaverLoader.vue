<template>
  <div>
    <button @click="saveHandler">Save</button>
    <button @click="loadAllHandler">LoadAll</button>
    <input v-model="loadFrom"/>
    <button @click="loadHandler">Load</button>
  </div>
</template>

<script>
import {mapGetters, mapMutations} from 'vuex'

import api from '../api/profiler.js'

export default {
  name: 'SaverLoader',

  data() {
    return {
      loadFrom: '22f7f711-22d0-45f6-4505-08d695178789'
    }
  },

  computed: {
    ...mapGetters({
      statsValues: 'stats/baseStatsValues',
      abilitiesIds: 'abilities/chosenSpellsIds',
      featsIds: 'feats/chosenSpellsIds',
      spellsIds: 'spells/chosenSpellsIds'
    })
  },

  methods: {
    ...mapMutations({
      setStats: 'stats/setBaseStats',
      setAbilities: 'abilities/setChosenSpells',
      setFeats: 'feats/setChosenSpells',
      setSpells: 'spells/setChosenSpells',
    }),


    saveHandler() {
      let char = {
        stats: this.statsValues,
        abilities: this.abilitiesIds,
        feats: this.featsIds,
        spells: this.spellsIds
      }

      api.saveCharacter(char, guid => {
        this.loadFrom = guid
      })
    },

    loadHandler() {
      let loadCharacterFunction = char => {
        this.setStats(char.stats)
        this.setAbilities(char.abilities)
        this.setFeats(char.feats)
        this.setSpells(char.spells)

        this.$store.dispatch('stats/calculateBonusValues')
      }

      api.getCharacter(this.loadFrom, loadCharacterFunction)
    },

    loadAllHandler() {
      api.getCharacters()
    }
  }
}
</script>

<style>
</style>
