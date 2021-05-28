const DkuSwitch = {
    props: {
        name: String,
        label: String,
        value: Boolean,

    },
    template: `
        <div class="custom-control custom-switch">
            <input
                type="checkbox"
                class="custom-control-input"
                :id="name"
                :cheked="value"
                @change="$emit('update:value', $event.target.checked)"
                />
            <label class="custom-control-label" :for="name">{{ label }}</label>
        </div>
    `
}

export { DkuSwitch }