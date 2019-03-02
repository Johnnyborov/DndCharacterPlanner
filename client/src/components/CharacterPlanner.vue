<template>
  <div @click="lastModuleToClickItem=''" @mouseleave="lastModuleToClickItem=''">
    <character-config class="character-config" :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event" />
    <real-stats class="real-stats" />

    <div class="spell-lists-area">
      <div>
        <div v-for="(cls, classIndex) in classes" :key="classIndex" class="choosable-items-list">
          <p>{{smartClassName(cls, classIndex)}} Abilities</p>
          <ul>
            <static-ability v-for="item in filteredAbilities(classIndex)" :key="item.id" :item="item" :moduleType="'abilities'" :classListIndex="classIndex"
              :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event" />
          </ul>
        </div>
      </div>

      <div>
        <choosable-items-list :moduleType="'feats'" class="choosable-items-list"
          :lastModuleToClickItem="lastModuleToClickItem" @item-clicked="lastModuleToClickItem=$event">
          <p>Feats</p>
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
import StaticAbility from './items/StaticAbility.vue'
import CharacterConfig from './CharacterConfig.vue'
import RealStats from './RealStats.vue'
import SaverLoader from './SaverLoader.vue'

import {mapState, mapGetters} from 'vuex'

export default {
  name: 'CharacterPlanner',
  components: {
    'saver-loader': SaverLoader,
    'character-config': CharacterConfig,
    'real-stats': RealStats,
    'choosable-items-list': ChoosableItemsList,
    'static-ability': StaticAbility
  },

  data() {
    return {
      lastModuleToClickItem: ''
    }
  },

  computed: {
    ...mapState('character', [
      'classes'
    ]),

    ...mapGetters('database', [
      'filteredAbilities'
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
