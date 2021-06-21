import { CustomerPane } from "./customer-pane.js";

const ISOCHRONE_OPACITY = 0.65;
const ISOCHRONE_WEIGHT = 6;

const DkuGeoJson = {
    name: "dku-geo-json",
    props: {
        locationName: String,
        iso: Object,
        color: String
    },
    data() {
        return {
            geoJsonOptions: {
                onEachFeature: (feature, layer) => {layer.bindPopup(this.popupContent);}
            }
        }
    },
    components: {
        'l-geo-json': window.Vue2Leaflet.LGeoJson,
        'customer-pane': CustomerPane
    },
    computed: {
        optionsStyle() {
            return {
                color: this.color,
                weight: ISOCHRONE_WEIGHT,
                opacity: ISOCHRONE_OPACITY
            }
        },
        popupContent() {
            const properties = this.iso.isochrone_data.properties;
            return `
            <div>
                <ul class="popup-list">
                    <li><img src="../../resource/spatial-footprint-app/img/custom-marker.png" alt="custom marker" /> ${this.locationName}</li>
                    <li><img src="../../resource/spatial-footprint-app/img/iso-thumb.png" alt="Iso Thumbnail" /> Isochrone ${this.iso.isochrone_amplitude} min</li>
                </ul>
            </div>`
        },
        ...Vuex.mapGetters({
                showCustomers: 'customers/showCustomers',
            }
        ),
    },
    template: `
        <l-geo-json :geojson="iso.isochrone_data" :optionsStyle="optionsStyle" :options="geoJsonOptions"/>
        `
};

export {DkuGeoJson}
