<template>
  <div @mouseenter="$emit('enter-child')">
    <span v-html="text" />
  </div>
</template>

<script>
import {statName} from '../../store/modules/stats.js'

export default {
  name: 'SpellTooltip',

  props: {
    spell: Object
  },

  computed: {
    text() {
      let res = this.spell.name + '</br>Description Description</br>Description Description</br>Description Description'
    
      if (typeof(this.spell.bonusStats) !== 'undefined') {
        this.spell.bonusStats.forEach(bonusStat => {
          let sign = ''
          if (bonusStat.value > 0) sign = '+'

          res = res + '</br>' + sign + bonusStat.value + ' ' + statName(bonusStat.index)
        })
      }
      
      return res
    }
  }
}
</script>

<style>
</style>
