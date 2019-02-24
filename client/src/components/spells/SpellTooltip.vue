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
    moduleName: String,
    spell: Object
  },

  mounted() {
    if (this.text.length > 800) {
      this.$el.style.width = Math.min(this.text.length / 20, 70) + 'vw'
      this.$el.style.left = - 1.5 - Math.min(this.text.length / 20, 70) + 'vw'
    }
  },

  computed: {
    text() {
      let res = this.spell.name + '</br>'
      if (this.moduleName === 'spells') {
        res = 'Name: ' + res + 'Level: ' + this.spell.level + '</br>'
      }

      if (typeof(this.spell.classes) !== 'undefined' && this.spell.classes !== null) {
        res = res + 'Classes: '
        for (let i = 0; i < this.spell.classes.length; i++) {
          res = res + this.spell.classes[i]
          if (i !== this.spell.classes.length - 1) {
            res = res + ', '
          } else {
            res = res + '<br/>'
          }
        }
      }
    
      if (typeof(this.spell.time) !== 'undefined') res = res + '</br>Time: ' + this.spell.time
      if (typeof(this.spell.range) !== 'undefined') res = res + '</br>Range: ' + this.spell.range
      if (typeof(this.spell.components) !== 'undefined') res = res + '</br>Components: ' + this.spell.components
      if (typeof(this.spell.duration) !== 'undefined') res = res + '</br>Duration: ' + this.spell.duration

      if (typeof(this.spell.description) !== 'undefined') {
        let fontSize = Math.max(Math.min(3000 / this.spell.description.length, 1.8), 1.2)
        res = res + '</br></br>Description:<pre style="font-size: ' + fontSize + 'vh;">' + this.spell.description + '</pre>'
      }

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
