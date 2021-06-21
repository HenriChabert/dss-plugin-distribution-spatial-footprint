import {MarkerCluster} from "./marker-cluster.js";
import { InfoPopup } from './info-popup.js'

const CustomerPane = {
    name: "customer-pane",
    props: {
        customers: Array,
        activeIsochrones: Array
    },
    data() {
        return {
            customerGroups: []
        }
    },
    computed: {
        activeCustomers() {
            return this.customers.filter(this.isCustomerActive);
        }
    },
    methods: {
        isCustomerActive(customer) {
            return parseInt(customer.isochrone_amplitude) <= Math.max(
                ...this.activeIsochrones.map((iso) => parseInt(iso.value.isochrone_amplitude))
            )
        }
    },
    components: {
        'l-marker': window.Vue2Leaflet.LMarker,
        'l-icon': window.Vue2Leaflet.LIcon,
        'info-popup': InfoPopup,
        'marker-cluster': MarkerCluster
    },
    template: `
        <div>
            <marker-cluster>
                <l-marker
                        v-for="customer in activeCustomers"
                        :key="customer.customer_id"
                        :lat-lng="[customer.latitude, customer.longitude]"
                >
                    <l-icon iconUrl="../../resource/spatial-footprint-app/img/empty-img.png"
                            :iconAnchor="[6, 12]"
                            :iconSize="[12, 12]"
                            className="customer-marker-icon"></l-icon>
                    <info-popup
                        :id="customer.id"
                        :filteringFeatures="customer.filteringFeatures">
                    </info-popup>
                </l-marker>
            </marker-cluster>
        </div>
        `
};

export {CustomerPane}
