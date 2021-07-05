const VToggle = {
    props: {
        value: {
            type: Boolean,
            required: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        title: String
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
                :class="['toggle-wrapper', { disabled }]"
                role="checkbox"
                :aria-checked="value.toString()"
                tabindex="0"
                @click="toggle"
                @keydown.space.prevent="toggle"
                :title="title">
                <span
                    class="toggle-background"
                    :class="backgroundStyles"/>
                <span
                    class="toggle-indicator"
                    :style="indicatorStyles"/>
            </span>
        </div>
    `
}

export { VToggle }