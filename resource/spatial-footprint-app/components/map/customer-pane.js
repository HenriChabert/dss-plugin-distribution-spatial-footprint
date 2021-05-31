import {MarkerCluster} from "./marker-cluster.js";
import { InfoPopup } from './info-popup.js'
import { CUSTOMER_UNIQUE_KEY } from "../../dku-api.js";

const CustomerPane = {
    name: "customer-pane",
    props: {
        customers: Array,
        activeIsochrones: Array
    },
    data() {
        return {
            customerGroups: [],
            customerUniqueKey: CUSTOMER_UNIQUE_KEY
        }
    },
    methods: {
        isCustomerActive(customer) {
            return this.activeIsochrones.map((iso) => `isochrone_${iso.value}`).includes(customer.isochrone_type)
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
                        v-for="customer in customers"
                        v-if="isCustomerActive(customer)"
                        :key="customer.customer_id"
                        :lat-lng="[customer.latitude, customer.longitude]"
                >
                    <l-icon iconUrl="../../resource/spatial-footprint-app/img/empty-img.png"
                            :iconAnchor="[6, 12]"
                            :iconSize="[12, 12]"
                            className="customer-marker-icon"></l-icon>
                    <info-popup
                        :keyName="customerUniqueKey"
                        :keyValue="customer[customerUniqueKey].toString()"
                        :filteringFeatures="customer.filteringFeatures">
                    </info-popup>
                </l-marker>
            </marker-cluster>
        </div>
        `
};

export {CustomerPane}
