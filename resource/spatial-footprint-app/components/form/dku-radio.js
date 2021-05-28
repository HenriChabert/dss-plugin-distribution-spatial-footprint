const DkuRadio = {
    props: {
        name: String,
        label: String,
        choices: Array,
        inlineChoices: Boolean,
        value: String
    },
    template: `
        <div class="dku-radio">
            <legend class="col-form-label">{{ label }}</legend>
            <div v-bind:class="{'form-check': true, 'form-check-inline': inlineChoices}" v-for="choice in choices">
                <input
                    type="radio"
                    class="form-check-input"
                    :id="choice.name"
                    :name="name"
                    :value="choice.value"
                    :checked="choice.value === value"
                    @change="$emit('update:value', $event.target.value)"
                    />
                <label class="form-check-label" :for="choice.name">{{ choice.label }}</label>
            </div>
        </div>
    `
}

export { DkuRadio }