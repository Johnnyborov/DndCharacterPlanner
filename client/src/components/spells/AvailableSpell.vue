<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click="clickHandler" class="spell-slot">
    {{spell.name}}

    <stat-chooser :spell="spell" @id-changed="idChangedHandler" />

    <spell-tooltip v-if="mouseOver" :spell="spell" @enter-child="enterChildHandler" class="spell-tooltip" />
  </li>
</template>

<script>
import StatChooser from './StatChooser.vue'

import spellSlot from '../../mixins/spellSlot.js'

export default {
  name: 'AvailableSpell',
  mixins: [spellSlot],
  components: {
    'stat-chooser': StatChooser
  },

  data() {
    return {
      realSpellId: this.spell.id
    }
  },

  methods: {
    clickHandler() {
      this.$emit('spell-chosen', this.realSpellId)
    },

    idChangedHandler(id) {
      this.realSpellId = id
    }
  }
}
</script>

<style>
</style>
