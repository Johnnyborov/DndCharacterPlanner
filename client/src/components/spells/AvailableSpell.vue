<template>
  <li @mouseenter="enterHandler" @mouseleave="leaveHandler" @click="clickHandler($event)">
    {{spell.name}}
    
    <spell-tooltip v-if="mouseOver" :spell="spell" @enter-child="enterChildHandler" class="spell-tooltip" />
  </li>
</template>

<script>
import spell from '../../mixins/spell.js'

export default {
  name: 'AvailableSpell',
  mixins: [spell]
}
</script>

<style>
</style>
