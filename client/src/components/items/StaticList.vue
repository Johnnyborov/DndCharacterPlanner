<template>
  <div>
    <slot></slot>
    <ul>
      <static-ability v-for="(item, itemIndex) in source" :key="itemIndex" :item="item" :moduleType="'abilities'"
        :lastModuleToClickItem="lastModuleToClickItem" @slot-clicked="$emit('slot-clicked', $event)" />
    </ul>
  </div>
</template>

<script>
import StaticAbility from './StaticAbility.vue'

export default {
  name: 'StaticList',
  components: {
    'static-ability': StaticAbility
  },

  props: {
    lastModuleToClickItem: String,
    source: Array,
  }
}
</script>

<style>
</style>
