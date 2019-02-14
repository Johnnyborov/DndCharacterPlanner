<template>
  <li @click="clickHandler($event)">
    {{spell.name}}
    <spell-list v-if="showList" class="spell-list" ref="spell-list" @spell-chosen="spellChosenHandler" />
  </li>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

import SpellList from './SpellList.vue'

export default {
  name: 'ChosenSpell',
  components: {
    'spell-list': SpellList
  },

  props: {
    id: Number,
    spell: Object
  },

  computed: {
    ...mapState('spells', [
      'spellList',
      'chosenSpells'
    ]),

    showList() {
      return this.spell.showList
    }
  },


  methods: {
    ...mapMutations('spells', [
      'setChosenSpell'
    ]),

    clickHandler(event) {
      event.stopPropagation()

      this.$emit('clicked-spell', this.id)
    },

    spellChosenHandler(spell) {
      this.setChosenSpell({ id: this.id, name: spell })
    }
  }
}
</script>

<style>
</style>
