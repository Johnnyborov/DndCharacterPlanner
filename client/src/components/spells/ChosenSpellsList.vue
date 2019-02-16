<template>
  <div @click="clickedEslewhereHandler" @mouseleave="clickedEslewhereHandler" class="character-spells">
    <slot></slot>
    <ul>
      <chosen-spell v-for="(spell, index) in chosenSpellsList" :key="index" :slotId="index" :spell="spell" :currentlyClickedSlotId="currentlyClickedSlotId"
        @clicked-slot="clickedSlotHandler" :moduleName="moduleName" class="chosen-spell" />
    </ul>
  </div>
</template>

<script>
import ChosenSpell from './ChosenSpell.vue'

export default {
  name: 'ChosenSpellsList',
  components: {
    'chosen-spell': ChosenSpell
  },

  props: {
    moduleName: String
  },

  data() {
    return {
      currentlyClickedSlotId: -1
    }
  },

  computed: {
    chosenSpellsList() {
      return this.$store.state[this.moduleName].chosenSpellsList
    }
  },

  methods: {
    clickedSlotHandler(slotId) {
      this.currentlyClickedSlotId = slotId
    },

    clickedEslewhereHandler() {
      this.currentlyClickedSlotId = -1
    }
  }
}
</script>

<style>
</style>
