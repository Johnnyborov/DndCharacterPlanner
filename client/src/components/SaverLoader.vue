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
import {mapState, mapGetters, mapActions} from 'vuex'

import api from '../api/planner.js'

export default {
  name: 'SaverLoader',

  data() {
    return {
      characterId: ''
    }
  },

  computed: {
    ...mapGetters('character/race', {
      getRace: 'firstItem'
    }),

    ...mapGetters('character/class', {
      getClass: 'firstItem'
    }),

    ...mapGetters('character/subclass', {
      getSubclass: 'firstItem'
    }),

    ...mapState('character', {
      getLevel: 'level'
    }),


     ...mapState('character/stats', {
      getStats: 'baseStats'
    }),
    

    ...mapState('character/classAbilities', {
      getClassAbilities: 'choosableItems'
    }),

    ...mapState('character/subclassAbilities', {
      getSubclassAbilities: 'choosableItems'
    }),

    ...mapState('character/feats', {
      getFeats: 'choosableItems'
    }),

    ...mapState('character/cantrips', {
      getCantrips: 'choosableItems'
    }),
    
    ...mapState('character/spells', {
      getSpells: 'choosableItems'
    })
  },

  methods: {
    ...mapActions({
      setCharacter: 'character/setCharacter',
    }),


    saveHandler() {
      let char = {
        race: this.getRace.id,
        class: this.getClass.id,
        subclass: this.getSubclass.id,
        level: this.getLevel,

        stats: this.getStats,
        
        classAbilities: this.getClassAbilities,
        subclassAbilities: this.getSubclassAbilities,
        feats: this.getFeats,
        cantrips: this.getCantrips,
        spells: this.getSpells
      }

      api.saveCharacter(char)
      .then(id => {
        this.characterId = id
      })
    },

    loadHandler() {
      api.getCharacter(this.characterId)
      .then(char => this.setCharacter(char))
    }
  }
}
</script>

<style>
</style>
