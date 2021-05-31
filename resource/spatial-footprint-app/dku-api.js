export const LOCATION_UNIQUE_KEY = "name";
export const CUSTOMER_UNIQUE_KEY = "customer_id";
axios.defaults.baseURL = dataiku.getWebAppBackendUrl('');
axios.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
});

export let APIErrors = [];
export let DKUApi = {
    getFilteredZones: (filters, sampling) => {
        const data = axios.post('filtered-data/location', { filtering: filters, sampling })
        return data
    },
    getFilteredCustomers: (filters, sampling) => {
        const data = axios.post('filtered-data/customer', { filtering: filters, sampling })
        return data
    },
    getAvailableFilteringFeatures: (moduleName) => {
        return axios.get(`available-filtering-features/${moduleName}`)
    },
    getIsochronesTypes: () => {
        return axios.get('available-isochrone-types')
    }

};