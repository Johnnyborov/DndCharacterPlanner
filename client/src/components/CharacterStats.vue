<template>
  <div>
    <div class="base-values">
      <p>Base Values:</p>
      <ul>
        <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
          {{stat.name}}
          <select :value="characterBaseStats[index].value" @input="updateBaseStatValue(index, $event)">
            <option v-for="(val, idx) in values" :key="idx" :value="val">
              {{val}}
            </option>
          </select>
        </li>
      </ul>
    </div>

    <div class="real-values">
      <p>Real Values:</p>
      <ul>
        <li v-for="(stat, index) in characterBaseStats" :key="index" class="stat">
          {{stat.name}}
          {{realStatValue(index)}}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState, mapGetters} from 'vuex'

export default {
  name: 'DndProfile',

  data() {
    return {
      values: [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
    }
  },

  computed: {
    ...mapState('stats', [
      'characterBaseStats'
    ]),

    ...mapGetters('stats', [
      'realStatValue'
    ])
  },

  methods: {
    updateBaseStatValue(index, event) {
      this.$store.commit('stats/setBaseStatValue', {index: index, value: Number(event.target.value)})
    }
  }
}
</script>

<style>
</style>
