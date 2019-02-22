<template>
  <div class="character-spells">
    <slot></slot>
    <ul>
      <chosen-spell v-for="(spellId, index) in chosenSpells" :key="index" :slotId="index" :spell="chosenSpell(spellId)" :currentlyClickedSlotId="currentlyClickedSlotId"
        @clicked-slot="clickedSlotHandler" :moduleName="moduleName" class="chosen-spell" />
    </ul>
    
    <div :style="{'top': avaliableSpellsPosY + 'px', 'position': 'absolute'}">
      <available-spells-list v-show="currentlyClickedSlotId !== -1" ref="available-spells"
        :slotId="currentlyClickedSlotId" :moduleName="moduleName" class="available-spells-list" />
    </div>
  </div>
</template>

<script>
import ChosenSpell from './ChosenSpell.vue'
import AvailableSpellsList from './AvailableSpellsList.vue'


export default {
  name: 'ChosenSpellsList',
  components: {
    'chosen-spell': ChosenSpell,
    'available-spells-list': AvailableSpellsList
  },

  props: {
    moduleName: String,
    spellPressedByModule: String
  },

  data() {
    return {
      currentlyClickedSlotIdData: -1,
      avaliableSpellsPosY: 0
    }
  },

  computed: {
    chosenSpells() {
      return this.$store.state[this.moduleName].chosenSpells
    },

    currentlyClickedSlotId() {
      if (this.spellPressedByModule !== this.moduleName)
        this.currentlyClickedSlotIdData = -1
        
      return this.currentlyClickedSlotIdData
    }
  },

  methods: {
    chosenSpell(id) {
      return this.$store.getters[this.moduleName + '/chosenSpell'](id)
    },

    clickedSlotHandler({slotId, posY}) {
      this.currentlyClickedSlotIdData = slotId
      this.avaliableSpellsPosY = posY

      this.$nextTick(function() { // wait for display change back to visible
        this.$refs['available-spells'].$refs['scrollable-ul'].scrollTop = 0
      })

      this.$emit('spell-pressed', this.moduleName)
    }
  }
}
</script>

<style>
</style>
