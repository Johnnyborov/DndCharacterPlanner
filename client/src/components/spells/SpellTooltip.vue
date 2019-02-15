<template>
  <div @mouseenter="$emit('enter-child')">
    <span v-html="text" />
  </div>
</template>

<script>
export default {
  name: 'SpellTooltip',

  props: {
    spell: Object
  },

  computed: {
    text() {
      if (this.spell.name === '') {
        return ''
      } else {
        return this.spell.name + '</br>Description Description</br>Description Description</br>Description Description</br>'
      }
    }
  }
}
</script>

<style>
</style>
