import {MarkerCluster} from "./marker-cluster.js";

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
    methods: {
        isCustomerActive(customer) {
            return this.activeIsochrones.map((iso) => `isochrone_${iso.value}`).includes(customer.isochrone_type)
        }
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
        'l-marker': window.Vue2Leaflet.LMarker,
        'l-icon': window.Vue2Leaflet.LIcon,
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
                    <l-popup>Customer ID: {{ customer.customer_id }}</l-popup>
                </l-marker>
            </marker-cluster>
        </div>
        `
};

export {CustomerPane}
