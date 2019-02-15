import SpellTooltip from '../components/spells/SpellTooltip.vue'

export default {
  components: {
    'spell-tooltip': SpellTooltip
  },

  data() {
    return {
      mouseOver: false
    }
  },

  props: {
    id: Number,
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
    },

    clickHandler(event) {
      this.mouseOver = false

      event.stopPropagation()

      this.$emit('clicked-spell', this.id)
    },
  }
}