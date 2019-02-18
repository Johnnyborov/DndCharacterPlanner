<template>
  <div class="character-spells">
    <slot></slot>
    <ul>
      <chosen-spell v-for="(spellId, index) in chosenSpells" :key="index" :slotId="index" :spell="chosenSpell(spellId)" :currentlyClickedSlotId="currentlyClickedSlotId"
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
    moduleName: String,
    focusedModule: String
  },

  data() {
    return {
      currentlyClickedSlotIdData: -1
    }
  },

  computed: {
    chosenSpells() {
      return this.$store.state[this.moduleName].chosenSpells
    },

    currentlyClickedSlotId() {
      if (this.focusedModule !== this.moduleName)
        this.currentlyClickedSlotIdData = -1
        
      return this.currentlyClickedSlotIdData
    }
  },

  methods: {
    chosenSpell(id) {
      return this.$store.getters[this.moduleName + '/chosenSpell'](id)
    },

    clickedSlotHandler(slotId) {
      this.currentlyClickedSlotIdData = slotId

      this.$emit('got-focus', this.moduleName)
    }
  }
}
</script>

<style>
</style>
