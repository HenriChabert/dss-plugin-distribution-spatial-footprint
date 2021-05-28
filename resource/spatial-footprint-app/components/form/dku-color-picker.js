const DkuColorPicker = {
    props: {
        name: String,
        label: String,
        value: String
    },
    template: `
        <div class="form-check">
            <input
                v-bind:id="name"
                type="color"
                class="form-check-input"
                :name="name"
                :value="value"
                @change="$emit('update:value', $event.target.value)"/>
            <label class="form-check-label" v-bind:for="name">{{ label }}</label>
        </div>
    `
}

export { DkuColorPicker }