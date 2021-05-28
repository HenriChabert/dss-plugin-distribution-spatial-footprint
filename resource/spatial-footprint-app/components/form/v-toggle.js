const VToggle = {
    props: {
        value:{
            type: Boolean,
            required: true
        }
    },
    computed: {
        backgroundStyles() {
            return {
                'toggle-on': this.value,
                'toggle-off': !this.value
            };
        },
        indicatorStyles() {
            return { transform: this.value ? 'translateX(14px)' : 'translateX(0)' };
        }
    },
    methods: {
        toggle() {
            this.$emit('input', !this.value);
        }
    },
    template: `
        <div>
            <span
                class="toggle-wrapper"
                role="checkbox"
                :aria-checked="value.toString()"
                tabindex="0"
                @click="toggle"
                @keydown.space.prevent="toggle"
            >
            <span
                class="toggle-background"
                :class="backgroundStyles"
            />
            <span
                class="toggle-indicator"
                :style="indicatorStyles" 
            />
            </span>
        </div>
    `
}

export { VToggle }