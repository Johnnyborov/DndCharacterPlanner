<template>
  <div>
    <div v-if="item.id === stats1x2Id">
      +1 
      <select @click.stop :value="selected1" @change="selected1Changed($event)">
        <option v-for="stat in statTypesMinusSelected2" :key="stat" :value="stat">
          {{stat}}
        </option>
      </select>
      <br />
      +1
      <select @click.stop :value="selected2" @change="selected2Changed($event)">
        <option v-for="stat in statTypesMinusSelected1" :key="stat" :value="stat">
          {{stat}}
        </option>
      </select>   
    </div>

    <div v-if="item.id === stats2x1Id">
      +2
      <select @click.stop :value="selected1" @change="selected1Changed($event)">
        <option v-for="stat in statTypes" :key="stat" :value="stat">
          {{stat}}
        </option>
      </select>
      <br />
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

const stats1x2Id = 110
const stats2x1Id = 160

function statIndex(name) {
  switch(name) {
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
    item: Object
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
    ...mapState('database', [
      'database'
    ]),

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
      let newId = calculateId(this.item.id, this.selected1, this.selected2)
  
      if (newId !== this.item.id) {
        let newItem = this.database.feats.find(f => f.id === newId)
        this.$emit('id-changed', newItem)
      }
    }
  }
}
</script>

<style>
</style>
