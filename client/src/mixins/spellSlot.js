import SpellTooltip from '../components/spells/SpellTooltip.vue'

export default {
  components: {
    'spell-tooltip': SpellTooltip
  },

  data() {
    return {
      mouseOver: false,
      posY: 0
    }
  },

  props: {
    spell: Object
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