const DkuCheckbox = {
    props: {
        name: String,
        label: String,
        choices: Array,
        inlined: Boolean,
        value: null
    },
    methods: {
        emitAllValues() {
            const newValues = [];
            const checkboxes = this.$refs[this.name].getElementsByTagName("input");
            for (let checkbox of checkboxes) {
                if (checkbox.checked) {
                    newValues.push(checkbox.value)
                }
            }
            this.$emit('update:value', newValues);
        }
    },
    template: `
        <div class="dku-checkbox" :ref="name">
            <div v-bind:class="{'form-check': true, 'form-check-inline': inlined}" v-for="choice in choices">
                <input
                    type="checkbox"
                    class="form-check-input"
                    :id="choice.name"
                    :name="name"
                    :value="choice.value"
                    :checked="value?.includes(choice.name)"
                    @change="emitAllValues()"
                    />
                <label class="form-check-label" :for="choice.name">{{ choice.label }}</label>
            </div>
        </div>
    `

}

export { DkuCheckbox }