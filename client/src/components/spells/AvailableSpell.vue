<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click="clickHandler" class="spell-slot">
    {{spell.name}}

    <div v-if="spell.id === 1">  
      +1 
      <select @click.stop v-model="selected1">
        <option v-for="(stat, index) in statTypesMinusSelected2" :key="index">
          {{stat}}
        </option>
      </select>
      <br />
      +1
      <select @click.stop v-model="selected2">
        <option v-for="(stat, index) in statTypesMinusSelected1" :key="index">
          {{stat}}
        </option>
      </select>   
    </div>

    <div v-if="spell.id === 2">  
      +2
      <select @click.stop v-model="selected1">
        <option v-for="(stat, index) in statTypes" :key="index">
          {{stat}}
        </option>
      </select>
      <br />
    </div>

    <spell-tooltip v-if="mouseOver" :spell="spell" @enter-child="enterChildHandler" class="spell-tooltip" />
  </li>
</template>

<script>
function attrIndex(val) {
  switch(val) {
    case 'str':
      return 0
    case 'agi':
      return 1
    case 'con':
      return 2
    case 'wis':
      return 3
    case 'int':
      return 4
    case 'cha':
      return 5
  }
}

import spellSlot from '../../mixins/spellSlot.js'

export default {
  name: 'AvailableSpell',
  mixins: [spellSlot],

  data() {
    return {
      statTypes: ['str', 'agi', 'con', 'wis', 'int', 'cha'],
      selected1: 'str',
      selected2: 'agi'
    }
  },

  computed: {
    statTypesMinusSelected1() {
      return this.statTypes.filter(t => t !== this.selected1)
    },

    statTypesMinusSelected2() {
      return this.statTypes.filter(t => t !== this.selected2)
    }
  },

  methods: {
    clickHandler() {
      let spell = this.spell
      if (this.spell.id === 1) {
        spell = JSON.parse(JSON.stringify(this.spell))
        spell.bonusStats = [{index: attrIndex(this.selected1), value: 1}, {index: attrIndex(this.selected2), value: 1}]
      } else if (this.spell.id === 2) {
        spell = JSON.parse(JSON.stringify(this.spell))
        spell.bonusStats = [{index: attrIndex(this.selected1), value: 2}]
      }

      this.$emit('spell-chosen', spell)
    }
  }
}
</script>

<style>
</style>
