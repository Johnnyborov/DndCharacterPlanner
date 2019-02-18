<template>
  <div>
    <div v-if="spellId === stats1x2Id">  
      +1 
      <select @click.stop :value="selected1" @input="selected1Changed($event)">
        <option v-for="(stat, index) in statTypesMinusSelected2" :key="index">
          {{stat}}
        </option>
      </select>
      <br />
      +1
      <select @click.stop :value="selected2" @input="selected2Changed($event)">
        <option v-for="(stat, index) in statTypesMinusSelected1" :key="index">
          {{stat}}
        </option>
      </select>   
    </div>

    <div v-if="spellId === stats2x1Id">  
      +2
      <select @click.stop :value="selected1" @input="selected1Changed($event)">
        <option v-for="(stat, index) in statTypes" :key="index">
          {{stat}}
        </option>
      </select>
      <br />
    </div>
  </div>
</template>

<script>
const stats1x2Id = 10
const stats2x1Id = 60

import {statIndex} from '../../store/modules/stats.js'

function calculateId(id, s1, s2) {
  let i1 = statIndex(s1)
  let i2 = statIndex(s2)

  if (id === stats1x2Id) {
    if (i1 < i2) {
      return id + 10 * i1 + i2
    } else {
      return id + 10 * i2 + i1
    }
  }
  
  if (id === stats2x1Id) return id + 1 + i1

  return id
}

export default {
  name: 'StatChooser',

  props: {
    spellId: Number
  },

  data() {
    return {
      statTypes: ['str', 'agi', 'con', 'wis', 'int', 'cha'],
      selected1: 'str',
      selected2: 'agi',

      stats1x2Id: stats1x2Id,
      stats2x1Id: stats2x1Id
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

  created() {
    this.changeId()
  },

  methods: {
    selected1Changed(event) {
      this.selected1 = event.target.value

      this.changeId()
    },

    selected2Changed(event) {
      this.selected2 = event.target.value

      this.changeId()
    },

    changeId() {
      let newId = calculateId(this.spellId, this.selected1, this.selected2)
  
      this.$emit('id-changed', newId)
    }
  }
}
</script>

<style>
</style>
