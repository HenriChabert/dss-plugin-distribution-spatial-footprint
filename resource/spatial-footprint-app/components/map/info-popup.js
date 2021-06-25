const InfoPopup = {
    name: "info-popup",
    props: {
        id: String,
        filteringFeatures: Object,
        isCustomer: Boolean
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
    },
    computed: {
        iconPath() {
            return `../../resource/spatial-footprint-app/img/${this.isCustomer ? "user" : "custom-marker"}.png`
        }

    },
    template: `
        <l-popup>
            <h5 class="mb-3 d-flex align-items-center">
                <img :src="iconPath" alt="custom marker" class="me-2"/>
                <b>{{ id }}</b>
            </h5>
            <ul class="popup-list">
                <li v-for="(featureValue, featureName) in filteringFeatures" :key="featureName">
                    <span><b>{{ featureName }}</b>: {{ featureValue }}</span>
                </li>
            </ul>
        </l-popup>
        `
};

export {InfoPopup}
