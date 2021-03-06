const SamplingSection = {
    name: "sampling-section",
    props: {
        settingsModule: String
    },
    computed: {
        getSampling() {
            return this.getModuleGetter('settings/getSampling');
        },
        samplingLabel() {
            return this.settingsModule === "customer" ? "samples/location" : "samples";
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
            <div class="sampling-form">
                <span>Show </span>
                <input type="number"
                    id="sampling-input"
                    min="0"
                    :value="getSampling.value"
                    @input="setSampling"
                    class="me-2"
                    >
                <label for="sampling-input">{{ samplingLabel }}</label>
            </div>
        </div>`
};

export {SamplingSection}