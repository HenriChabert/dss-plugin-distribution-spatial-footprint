const DkuSelect = {
    props: {
        name: String,
        label: String,
        choices: Array,
        value: String,
        placeholder: String
    },
    template: `
        <div class="form-group">
            <label class="form-check-label" :for="name">{{ label }}</label>
            <select
                class="form-control"
                :id="name"
                :name="name"
                :value="value || 'none'"
                @change="$emit('update:value', $event.target.value)"
                >
                <option disabled selected value="none">{{ placeholder }}</option>
                <option v-for="choice in choices" :value="choice.value">{{choice.label}}</option>
            </select>
        </div>
    `
}

export { DkuSelect }