const CustomerPane = {
    name: "customer-pane",
    props: {
        customers: Array,
        zoom: Number
    },
    data() {
        return {
            customerGroups: []
        }
    },
    components: {
        'l-popup': window.Vue2Leaflet.LPopup,
        'l-marker': window.Vue2Leaflet.LMarker,
        'l-icon': window.Vue2Leaflet.LIcon
    },
    methods: {
        calculateDistance: function(customer1, customer2) {
            return Math.sqrt((customer1.latitude - customer2.latitude)**2 + (customer1.longitude - customer2.longitude)**2)
        },
    },
    template: `
            <l-marker
                v-for="customer in iso.customers"
                :visible="showCustomers"
                :key="customer.customer_id"
                :lat-lng="[customer.latitude, customer.longitude]"
                >
                    <l-icon iconUrl="../../resource/spatial-footprint-app/img/empty-img.png" className="customer-marker-icon"></l-icon>
                    <l-popup>Customer ID: {{ customer.customer_id }}</l-popup>
            </l-marker>
        `
};

export {CustomerPane}
