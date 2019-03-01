<template>
  <div @click="lastModuleToClickItem=''" @mouseleave="lastModuleToClickItem=''">
    <character-config class="character-config" :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event" />
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

        <choosable-items-list v-for="(cls, index) in classes" :key="index" :classListIndex="index" :moduleType="'cantrips'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>{{smartClassName(cls, index)}} Cantrips:</p>
        </choosable-items-list>
      </div>

      <div>
        <choosable-items-list v-for="(cls, index) in classes" :key="index" :classListIndex="index" :moduleType="'spells'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>{{smartClassName(cls, index)}} Spells:</p>
        </choosable-items-list>
      </div>
    </div>

    <saver-loader class="saver-loader">Saving/Loading</saver-loader>
  </div>
</template>

<script>
import ChoosableItemsList from './items/ChoosableItemsList.vue'
import CharacterConfig from './CharacterConfig.vue'
import RealStats from './RealStats.vue'
import SaverLoader from './SaverLoader.vue'

import {mapState} from 'vuex'

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

  computed: {
    ...mapState('character', [
      'classes'
    ])
  },

  methods: {
    smartClassName(cls, index) {
      return cls.class.id === -1 ? 'Class' + (index + 1) : cls.class.name
    }
  },

  created() {
    this.$store.dispatch('database/load')
  }
}
</script>

<style>
</style>
