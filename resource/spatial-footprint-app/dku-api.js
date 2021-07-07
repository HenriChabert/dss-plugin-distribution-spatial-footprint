axios.defaults.baseURL = dataiku.getWebAppBackendUrl('')
axios.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    if (!error.response) {
        error.response = {
            statusText: "Backend not running",
            data: {
                error: "The backend is not running. Please start it and try again"
            }

        }
    }
    APIErrors.push(error.response);
    return Promise.reject(error);
});

export let APIErrors = [];
export let DKUApi = {
    getFilteredLocations: (filters, sampling) => {
        return axios.post('filtered-data/location', {filtering: filters, sampling});
    },
    getFilteredCustomers: (filters, sampling) => {
        return axios.post('filtered-data/customer', {filtering: filters, sampling});
    },
    getAvailableFilteringFeatures: (moduleName, preFilters) => {
        return axios.post(`available-filtering-features/${moduleName}`, { pre_filters: preFilters});
    },
    getAvailableIdentifiers: (moduleName, preFilters) => {
        return axios.post(`available-identifiers/${moduleName}`, { pre_filters: preFilters});
    },
    getIsochronesTypes: () => {
        return axios.get('available-isochrone-types');
    },
    getProjectVariables: () => {
        return axios.get('project-variables');
    }
};