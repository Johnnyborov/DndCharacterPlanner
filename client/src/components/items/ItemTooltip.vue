<template>
  <div @mouseenter="$emit('enter-child')">
    <span v-html="text" />
  </div>
</template>

<script>
export default {
  name: 'ItemTooltip',

  props: {
    moduleType: String,
    item: Object,
    posX: Number
  },

  mounted() {
    if (this.text.length > 800) {
      this.$el.style.width = Math.min(this.text.length / 20, 65) + 'vmin'
      this.$el.style.left = - 1.5 - Math.min(this.text.length / 20, 65) + 'vmin'
    }

    if (this.posX > 0) { // tooltip on right
      let left = this.$el.getBoundingClientRect().left - this.$parent.$el.getBoundingClientRect().left
      let width = this.$el.getBoundingClientRect().width
      this.$el.style.left = left + this.posX + width + 'px'
    }  
  },

  computed: {
    text() {
      let res = this.item.name + '</br>'
      if (this.moduleType === 'cantrips') {
        res = 'Name: ' + res + 'Cantrip</br>'
      } else if (this.moduleType === 'spells' || this.moduleType === 'options' && this.item.level) {
        res = 'Name: ' + res + 'Level: ' + this.item.level + '</br>'
      }

      if (typeof(this.item.classes) !== 'undefined' && this.item.classes !== null) {
        res = res + 'Classes: '
        for (let i = 0; i < this.item.classes.length; i++) {
          res = res + this.item.classes[i]
          if (i !== this.item.classes.length - 1) {
            res = res + ', '
          } else {
            res = res + '<br/>'
          }
        }
      }
    
      if (typeof(this.item.time) !== 'undefined') res = res + '</br>Time: ' + this.item.time
      if (typeof(this.item.range) !== 'undefined') res = res + '</br>Range: ' + this.item.range
      if (typeof(this.item.components) !== 'undefined') res = res + '</br>Components: ' + this.item.components
      if (typeof(this.item.duration) !== 'undefined') res = res + '</br>Duration: ' + this.item.duration

      if (typeof(this.item.description) !== 'undefined') {
        let fontSize = Math.max(Math.min(3000 / this.item.description.length, 1.4), 1.2)
        res = res + '</br></br>Description:<pre style="font-size: ' + fontSize + 'vmin;">' + this.item.description + '</pre>'
      }

      if (this.item.bonusStats) {
        Object.keys(this.item.bonusStats).forEach(statName => {
          let sign = ''
          if (this.item.bonusStats[statName] > 0) sign = '+'

          res = res + '</br>' + sign + this.item.bonusStats[statName] + ' ' + statName
        })
      }

      return res
    }
  }
}
</script>

<style>
</style>
