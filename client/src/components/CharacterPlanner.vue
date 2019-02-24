<template>
  <div @click="lastModuleToClickItem=''" @mouseleave="lastModuleToClickItem=''">
    <character-config class="character-config" />
    <real-stats class="real-stats" />

    <div class="spell-lists-area">
      <div>
        <choosable-items-list :moduleName="'classAbilities'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Class Abilities</p>
        </choosable-items-list>
        <choosable-items-list :moduleName="'subclassAbilities'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Subclass Abilities</p>
        </choosable-items-list>
      </div>

      <div>
        <choosable-items-list :moduleName="'feats'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Chosen Feats</p>
        </choosable-items-list>
        <choosable-items-list :moduleName="'cantrips'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Chosen Cantrips</p>
        </choosable-items-list>
      </div>

      <choosable-items-list :moduleName="'spells'" class="choosable-items-list"
        :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
        <p>Chosen Spells</p>
      </choosable-items-list>
    </div>

    <saver-loader class="saver-loader">Saving/Loading</saver-loader>
  </div>
</template>

<script>
import SaverLoader from './SaverLoader.vue'

import CharacterConfig from './CharacterConfig.vue'
import RealStats from './RealStats.vue'

import ChoosableItemsList from './items/ChoosableItemsList.vue'
import items from '../store/modules/items.js'


export default {
  name: 'CharacterPlanner',
  components: {
    'saver-loader': SaverLoader,
    'character-config': CharacterConfig,
    'real-stats': RealStats,
    'choosable-items-list': ChoosableItemsList
  },

  data() {
    return {
      lastModuleToClickItem: ''
    }
  },


  created() {
    this.$store.registerModule('classAbilities', items)
    this.$store.dispatch('classAbilities/initializeModule', 'classAbilities')

    this.$store.registerModule('subclassAbilities', items)
    this.$store.dispatch('subclassAbilities/initializeModule', 'subclassAbilities')


    this.$store.registerModule('feats', items)
    this.$store.dispatch('feats/initializeModule', 'feats')


    this.$store.registerModule('cantrips', items)
    this.$store.dispatch('cantrips/initializeModule', 'cantrips')

    this.$store.registerModule('spells', items)
    this.$store.dispatch('spells/initializeModule', 'spells')



    this.$store.dispatch('characterConfig/initializeModule', this)
    this.$store.dispatch('stats/initializeModule')
  },

  destroyed() {
    this.$store.unregisterModule('classAbilities')
    this.$store.unregisterModule('subclassAbilities')
    this.$store.unregisterModule('feats')
    this.$store.unregisterModule('cantrips')
    this.$store.unregisterModule('spells')
  }
}
</script>

<style>
</style>
