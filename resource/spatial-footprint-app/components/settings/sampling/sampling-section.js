const SamplingSection = {
    name: "sampling-section",
    props: {
        settingsModule: String
    },
    computed: {
        getSampling() {
            return this.getModuleGetter('settings/getSampling');
        }
    },
    methods: {
        getModuleGetter(getter) {
            return this.$store.getters.getModuleGetter(this.settingsModule, getter);
        },
        setSampling(samplingInput) {
            this.$store.commit(`${this.settingsModule}/settings/setSamplingValue`, samplingInput.target.value)
        }
    },
    template: `
        <div id="sampling-section">
            <h5>Sampling</h5>
            <div class="sampling-form">
                <input type="number"
                    id="sampling-input"
                    :value="getSampling.value"
                    @input="setSampling"
                    class="mr-2"
                    
                    >
                <label for="sampling-input">Rows</label>
            </div>
        </div>`
};

export {SamplingSection}