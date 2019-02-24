import ItemTooltip from '../components/items/ItemTooltip.vue'

export default {
  components: {
    'item-tooltip': ItemTooltip
  },

  props: {
    moduleName: String,
    item: Object
  },

  data() {
    return {
      mouseOver: false,
      posY: 0
    }
  },

  computed: {
    levelText() {
      if (this.moduleName === 'spells' && typeof(this.item.level) !== 'undefined') return this.item.level + ':'
      else return ''
    }
  },

  methods: {
    enterHandler() {
      this.mouseOver = true
      this.posY = this.$el.getBoundingClientRect().top - this.$parent.$el.getBoundingClientRect().top
    },

    leaveHandler() {
      this.mouseOver = false
    }
  }
}