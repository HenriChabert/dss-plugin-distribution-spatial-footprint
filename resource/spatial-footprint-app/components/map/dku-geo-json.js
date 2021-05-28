import { CustomerPane } from "./customer-pane.js";

const ISOCHRONE_OPACITY = 0.65;
const ISOCHRONE_WEIGHT = 6;

const DkuGeoJson = {
    name: "dku-geo-json",
    props: {
        zoneName: String,
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
            const properties = this.iso.geoJson.properties;
            return `
            <div>
                <ul class="iso-popup-list">
                    <li><img src="spatial-footprint-app/img/custom-marker.png" alt="custom marker" /> ${this.zoneName}</li>
                    <li><img src="spatial-footprint-app/img/iso-thumb.png" alt="Iso Thumbnail" /> ${this.iso.name}</li>
                    <hr>
                    <li>Total population: ${properties.total_pop }</li>
                    <li>Total customers: ${this.iso.customers.length}</li>
                    <li>reachfactor: ${properties.reachfactor}</li>
                </ul>
            </div>`
        },
        ...Vuex.mapGetters({
                showCustomers: 'customers/showCustomers',
                getIsoCustomers: 'customers/getIsoCustomers'
            }
        )
    },
    template: `
        <div>
            <l-geo-json
                :geojson="iso.geoJson"
                :optionsStyle="optionsStyle"
                :options="geoJsonOptions"
            ></l-geo-json>
<!--            <customer-pane-->
<!--                :customers="iso.customers"-->
<!--                ></customer-pane>-->
        </div>
        `
};

export {DkuGeoJson}
