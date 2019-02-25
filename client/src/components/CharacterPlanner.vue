<template>
  <div @click="lastModuleToClickItem=''" @mouseleave="lastModuleToClickItem=''">
    <character-config class="character-config" />
    <real-stats class="real-stats" />

    <div class="spell-lists-area">
      <div>
        <choosable-items-list :moduleType="'classAbilities'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Class Abilities</p>
        </choosable-items-list>
        <choosable-items-list :moduleType="'subclassAbilities'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Subclass Abilities</p>
        </choosable-items-list>
      </div>

      <div>
        <choosable-items-list :moduleType="'feats'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Chosen Feats</p>
        </choosable-items-list>
        <choosable-items-list :moduleType="'cantrips'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Chosen Cantrips</p>
        </choosable-items-list>
      </div>

      <choosable-items-list :moduleType="'spells'" class="choosable-items-list"
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
    this.$store.registerModule(['character/classAbilities'], items)
    this.$store.registerModule(['character/subclassAbilities'], items)
    this.$store.registerModule(['character/feats'], items)
    this.$store.registerModule(['character/cantrips'], items)
    this.$store.registerModule(['character/spells'], items)


    this.$store.dispatch('character/initializeModule')
  },

  destroyed() {
    this.$store.unregisterModule('character/classAbilities')
    this.$store.unregisterModule('character/subclassAbilities')
    this.$store.unregisterModule('character/feats')
    this.$store.unregisterModule('character/cantrips')
    this.$store.unregisterModule('character/spells')
  }
}
</script>

<style>
</style>
