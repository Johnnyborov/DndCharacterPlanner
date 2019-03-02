<template>
  <div>
    <div>
      <p>Base Stat Scores:</p>
      <ul>
        <li v-for="(stat, index) in character.stats" :key="index" class="stat">
          {{statName(index)}}
          <select :value="character.stats[index]" @change="changeStatValue(index, $event)">
            <option v-for="val in values" :key="val" :value="val">
              {{val}}
            </option>
          </select>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  name: 'BaseStats',

  data() {
    return {
      values: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    }
  },

  computed: {
    ...mapState('character', [
      'character'
    ])
  },

  methods: {
    ...mapMutations('character', [
      'setStat'
    ]),

    statName(index) {
      switch(index) {
        case 0:
          return 'str'
        case 1:
          return 'agi'
        case 2:
          return 'con'
        case 3:
          return 'wis'
        case 4:
          return 'int'
        case 5:
          return 'cha'
      }
    },

    changeStatValue(index, event) {
      this.setStat({index: index, value: Number(event.target.value)})
    }
  }
}
</script>

<style>
</style>
