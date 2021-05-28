import EXAMPLE_ZONES from './assets/exampleZones.js'

export const UNIQUE_KEY = "name";
// axios.defaults.baseURL = dataiku.getWebAppBackendUrl('');
axios.interceptors.response.use((response) => {
    return response.data;
}, (error) => {
    APIErrors.push(error.response);
    return Promise.reject(error);
});

export let APIErrors = [];
export let DKUApi = {
    getFilteredZones: (filters, sampling) => {
        let hasFilters = false;
        for (const [key, value] of Object.entries(filters)) {
            if (value.length) {
                hasFilters = true;
                break;
            }
        }
        if (!hasFilters) {
            return []
        }
        const filteredZones = EXAMPLE_ZONES.filter((zone) => {
            let isValid = true;
            for (const [featureName, items] of Object.entries(filters)) {
                if (featureName === UNIQUE_KEY) {
                    isValid = !items.length || items.includes(zone[UNIQUE_KEY]);
                    if (!isValid) break;
                } else {
                    isValid = !items.length || items.includes(zone.filteringFeatures[featureName]);
                    if (!isValid) break;
                }
            }
            return isValid;
        });
        return _.sampleSize(filteredZones, sampling.value)
        // axios.post('getSettingsChoices', settings)
    },
    getAvailableFilteringFeatures: (moduleName) => {
        const filterFeatures = {}
        if (moduleName === 'customer') {
            return filterFeatures
        } else {
            EXAMPLE_ZONES.forEach((zone) => {
                filterFeatures.name = filterFeatures.name ? [...filterFeatures.name, zone.name] : [zone.name]
                for (const [featureName, featureValue] of Object.entries(zone.filteringFeatures)) {
                    if (filterFeatures[featureName] && !filterFeatures[featureName].includes(featureValue)) {
                        filterFeatures[featureName].push(featureValue)
                    } else {
                        filterFeatures[featureName] = [featureValue]
                    }
                }
            })
            return filterFeatures;
        }
    },
    getIsochronesTypes: () => {
        return [
            {
                label: "5 min",
                value: "5_min"
            },
            {
                label: "15 min",
                value: "15_min"
            },
            {
                label: "30 min",
                value: "30_min"
            }
        ]
    }

};