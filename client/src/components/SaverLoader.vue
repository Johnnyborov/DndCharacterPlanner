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
      characterId: ''
    }
  },

  computed: {
    ...mapState('characterConfig', {
      getRace: 'race',
      getClass: 'class',
      getSubclass: 'subclass',
      getLevel: 'level',
    }),

    ...mapState('stats', {
      getStats: 'baseStats'
    }),

    ...mapState('classAbilities', {
      getClassAbilities: 'choosableItems'
    }),

    ...mapState('subclassAbilities', {
      getSubclassAbilities: 'choosableItems'
    }),

    ...mapState('feats', {
      getFeats: 'choosableItems'
    }),

    ...mapState('cantrips', {
      getCantrips: 'choosableItems'
    }),
    
    ...mapState('spells', {
      getSpells: 'choosableItems'
    })
  },

  methods: {
    ...mapMutations({
      setRace: 'characterConfig/setRace',
      setClass: 'characterConfig/setClass',
      setSubclass: 'characterConfig/setSubclass',
      setLevel: 'characterConfig/setLevel',
      setStats: 'stats/setBaseStats',
    }),

    ...mapActions({
      setClassAbilities: 'classAbilities/setChoosableItems',
      setSubclassAbilities: 'subclassAbilities/setChoosableItems',
      setFeats: 'feats/setChoosableItems',
      setCantrips: 'cantrips/setChoosableItems',
      setSpells: 'spells/setChoosableItems',
    }),


    saveHandler() {
      let char = {
        race: this.getRace,
        class: this.getClass,
        subclass: this.getSubclass,
        level: this.getLevel,

        stats: this.getStats,
        
        classAbilities: this.getClassAbilities,
        subclassAbilities: this.getSubclassAbilities,
        feats: this.getFeats,
        cantrips: this.getCantrips,
        spells: this.getSpells
      }

      api.saveCharacter(char, id => {
        this.characterId = id
      })
    },

    loadHandler() {
      let loadCharacterFunction = char => {
        this.setStats(char.stats)

        this.setClassAbilities(char.classAbilities)
        this.setSubclassAbilities(char.subclassAbilities)
        this.setFeats(char.feats)
        this.setCantrips(char.cantrips)
        this.setSpells(char.spells)


        this.setRace(char.race)
        this.setClass(char.class)
        this.$nextTick(() => this.setSubclass(char.subclass))
        this.setLevel(char.level)
      }

      api.getCharacter(this.characterId, loadCharacterFunction)
    }
  }
}
</script>

<style>
</style>
