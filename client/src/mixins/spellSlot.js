import SpellTooltip from '../components/spells/SpellTooltip.vue'

export default {
  components: {
    'spell-tooltip': SpellTooltip
  },

  props: {
    moduleName: String,
    spell: Object
  },

  data() {
    return {
      mouseOver: false,
      posY: 0
    }
  },

  computed: {
    levelText() {
      if (this.moduleName === 'spells' && typeof(this.spell.level) !== 'undefined') return this.spell.level + ':'
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