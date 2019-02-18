import SpellTooltip from '../components/spells/SpellTooltip.vue'

export default {
  components: {
    'spell-tooltip': SpellTooltip
  },

  data() {
    return {
      mouseOver: false,
    }
  },

  props: {
    spell: Object
  },

  methods: {
    enterHandler() {
      this.mouseOver = true
    },

    leaveHandler() {
      this.mouseOver = false
    },

    enterChildHandler() {
      this.mouseOver = false
    }
  }
}