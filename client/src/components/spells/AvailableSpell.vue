<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click.stop="clickHandler" class="spell-slot">
    {{spell.name}}

    <stat-chooser :spellId="spell.id" @id-changed="idChangedHandler" />

    <div :style="{'top': posY + 'px', 'position': 'absolute'}">
      <spell-tooltip v-if="mouseOver" :spell="spell" class="spell-tooltip" />
    </div>
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
