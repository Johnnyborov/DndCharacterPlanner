<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click="clickHandler($event)">
    {{spell.name}}

    <spell-tooltip v-if="mouseOver" :spell="spell" @enter-child="enterChildHandler" class="spell-tooltip" />
    
    <available-spells-list v-if="currentlyClickedId === id" @spell-chosen="spellChosenHandler"
      @enter-child="enterChildHandler" class="available-spells-list" />
  </li>
</template>

<script>
import spell from '../../mixins/spell.js'

import AvailableSpellsList from './AvailableSpellsList.vue'

import {mapMutations} from 'vuex'


export default {
  name: 'ChosenSpell',
  mixins: [spell],

  components: {
    'available-spells-list': AvailableSpellsList
  },

  props: {
    currentlyClickedId: Number
  },

  methods: {
    ...mapMutations('spells', [
      'setChosenSpell'
    ]),

    spellChosenHandler(spell) {
      this.setChosenSpell({ id: this.id, spell: spell })
    }
  }
}
</script>

<style>
</style>
