<template>
  <div>
    Class
    <select :value="selectedClass" @input="classChanged($event)">
      <option v-for="cls in classes" :key="cls">
        {{cls}}
      </option>
    </select>

    Level
    <select :value="selectedLevel" @input="levelChanged($event)">
      <option v-for="lvl in levels" :key="lvl">
        {{lvl}}
      </option>
    </select>
  </div>
</template>

<script>
export default {
  name: 'ClassControl',

  data() {
    return {
      classes: ['Fighter', 'Sorcerer'],
      selectedClass: 'Sorcerer',

      levels: [1,2,3,4,5],
      selectedLevel: 5
    }
  },

  created() {
    this.setAmounts()
  },

  methods: {
    classChanged(event) {
      this.selectedClass = event.target.value

      this.setAmounts()
    },

    levelChanged(event) {
      this.selectedLevel = event.target.value

      this.setAmounts()
    },

    setAmounts() {
      if (this.selectedClass === 'Fighter') {
        this.$store.dispatch('abilities/setChosenSpellsAmount', 4)
        this.$store.dispatch('feats/setChosenSpellsAmount', 5)
        this.$store.dispatch('spells/setChosenSpellsAmount', 0)
      } else if (this.selectedClass === 'Sorcerer') {
        this.$store.dispatch('abilities/setChosenSpellsAmount', 3)
        this.$store.dispatch('feats/setChosenSpellsAmount', 4)
        this.$store.dispatch('spells/setChosenSpellsAmount', 5)
      }

      this.$store.dispatch('stats/initializeModule') // reset stats state
    }
  }
}
</script>

<style>
</style>
