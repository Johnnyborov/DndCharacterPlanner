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
import {mapState, mapMutations, mapActions} from 'vuex'

import api from '../api/planner.js'

export default {
  name: 'SaverLoader',

  data() {
    return {
      characterId: 1
    }
  },

  computed: {
    ...mapState('classConfig', {
      getClass: 'class',
      getSubclass: 'subclass',
      getLevel: 'level',
    }),

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
      setClass: 'classConfig/setClass',
      setSubclass: 'classConfig/setSubclass',
      setLevel: 'classConfig/setLevel',
      setStats: 'stats/setBaseStats',
    }),

    ...mapActions({
      setAbilities: 'abilities/setChosenSpells',
      setFeats: 'feats/setChosenSpells',
      setSpells: 'spells/setChosenSpells',
    }),


    saveHandler() {
      let char = {
        class: this.getClass,
        subclass: this.getSubclass,
        level: this.getLevel,

        stats: this.getStats,
        abilities: this.getAbilities,
        feats: this.getFeats,
        spells: this.getSpells
      }

      api.saveCharacter(char, id => {
        this.characterId = id
      })
    },

    loadHandler() {
      let loadCharacterFunction = char => {
        this.setClass(char.class)
        this.setSubclass(char.subclass)
        this.setLevel(char.level)

        this.setStats(char.stats)
        this.setAbilities(char.abilities)
        this.setFeats(char.feats)
        this.setSpells(char.spells)
      }

      api.getCharacter(this.characterId, loadCharacterFunction)
    }
  }
}
</script>

<style>
</style>
