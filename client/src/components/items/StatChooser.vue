<template>
  <div class="stat-chooser">
    <div v-if="stats1x2Ids.includes(item.id)">
      <div style="display:flex;direction:row;">
        <p>+1</p>
        <select @click.stop :value="selected1" @change="selected1Changed($event)">
          <option v-for="stat in statTypesMinusSelected2" :key="stat" :value="stat">
            {{stat}}
          </option>
        </select>
      </div>
      <div style="display:flex;direction:row;">
        <p>+1</p>
        <select @click.stop :value="selected2" @change="selected2Changed($event)">
          <option v-for="stat in statTypesMinusSelected1" :key="stat" :value="stat">
            {{stat}}
          </option>
        </select>
      </div>
    </div>

    <div v-if="stats2x1Ids.includes(item.id)">
      <div style="display:flex;direction:row;">
        <p>+2</p>
        <select @click.stop :value="selected1" @change="selected1Changed($event)">
          <option v-for="stat in statTypes" :key="stat" :value="stat">
            {{stat}}
          </option>
        </select>
        <br />
      </div>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'

const stats1x2Ids = [110,5400]
const stats2x1Ids = [160]


function makeNewItem(item, s1, s2) {
  let newItem = JSON.parse(JSON.stringify(item))

  if (stats1x2Ids.includes(item.id)) {
    newItem.bonusStats = {[s1]:1,[s2]:1}
  } else if (stats2x1Ids.includes(item.id)) {
    newItem.bonusStats = {[s1]:2}
  }

  return newItem
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

      stats1x2Ids: stats1x2Ids,
      stats2x1Ids: stats2x1Ids
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
    this.changeItem()
  },

  methods: {
    selected1Changed(event) {
      this.selected1 = event.target.value

      this.changeItem()
    },

    selected2Changed(event) {
      this.selected2 = event.target.value

      this.changeItem()
    },

    changeItem() {
      if (stats1x2Ids.includes(this.item.id) || stats2x1Ids.includes(this.item.id)) {
        let newItem = makeNewItem(this.item, this.selected1, this.selected2)

        this.$emit('item-changed', newItem)
      }
    }
  }
}
</script>

<style>
</style>
