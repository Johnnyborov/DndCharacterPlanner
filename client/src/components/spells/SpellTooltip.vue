<template>
  <div @mouseenter="$emit('enter-child')">
    <span v-html="text" />
  </div>
</template>

<script>
function attrName(index) {
  switch(index) {
    case 0:
      return 'str'
    case 1:
      return 'agi'
    case 2:
      return 'con'
    case 3:
      return 'wis'
    case 4:
      return 'int'
    case 5:
      return 'cha'
  }
}

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

          res = res + '</br>' + sign + bonusStat.value + ' ' + attrName(bonusStat.index)
        })
      }
      
      return res
    }
  }
}
</script>

<style>
</style>
