<template>
  <div>
    <div>
      <p>Base Stat Scores:</p>
      <ul>
        <li v-for="(statName, index) in Object.keys(character.stats)" :key="index" class="stat">
          {{statName}}
          <select :value="character.stats[statName]" @change="changeStatValue(statName, $event)">
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

    changeStatValue(statName, event) {
      this.setStat({statName: statName, value: Number(event.target.value)})
    }
  }
}
</script>

<style>
</style>
