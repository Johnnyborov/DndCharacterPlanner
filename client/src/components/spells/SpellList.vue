<template>
  <div>
    <ul>
      <li v-for="(spell, index) in otherSpells" :key="index" @click="clickHandler(spell)" class="available-spell">
        {{spell}}
      </li>
    </ul>
  </div> 
</template>

<script>
import {mapState} from 'vuex'

export default {
  name: 'SpellList',

  computed: {
    otherSpells() {
      return this.spellList.filter(spell => {
          return !this.chosenSpells.find(chosenSpell => chosenSpell.name === spell)
        })
    },

    ...mapState('spells', [
      'spellList',
      'chosenSpells'
    ])
  },

  methods: {
    clickHandler(spell) {
      this.$emit('spell-chosen', spell)
    }
  }
}
</script>

<style>
</style>
