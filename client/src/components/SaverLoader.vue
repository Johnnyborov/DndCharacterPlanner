<template>
  <div>
    <button @click="saveHandler">Save</button>
    <button @click="loadAllHandler">LoadAll</button>
    <input v-model="loadFrom"/>
    <button @click="loadHandler">Load</button>
  </div>
</template>

<script>
import {mapState, mapMutations, mapActions} from 'vuex'

import api from '../api/planner.js'

export default {
  name: 'SaverLoader',

  data() {
    return {
      loadFrom: 'a0e837c6-8ee7-4edf-7822-08d696cad720'
    }
  },

  computed: {
    ...mapState('stats', {
      getStats: 'characterBaseStats'
    }),

    ...mapState('abilities', {
      getAbilities: 'chosenSpells'
    }),

    ...mapState('feats', {
      getFeats: 'chosenSpells'
    }),
    
    ...mapState('spells', {
      getSpells: 'chosenSpells'
    })
  },

  methods: {
    ...mapMutations({
      setStats: 'stats/setBaseStats',
    }),

    ...mapActions({
      setAbilities: 'abilities/setChosenSpells',
      setFeats: 'feats/setChosenSpells',
      setSpells: 'spells/setChosenSpells',
    }),


    saveHandler() {
      let char = {
        stats: this.getStats,
        abilities: this.getAbilities,
        feats: this.getFeats,
        spells: this.getSpells
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
