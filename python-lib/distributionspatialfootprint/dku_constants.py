ISOCHRONES_DATASET_NAME = "locations_isochrones"
LOCATIONS_DATASET_NAME = "locations_isochrones_denormalized"
CUSTOMERS_DATASET_NAME = "locations_customers"


CUSTOMERS_NO_FILTERING_COLUMNS = [
    'location_identifier',
    'location_id',
    'isochrone_type',
    'distance_customer_location',
    'isochrone_id',
    'isochrone_amplitude',
    'isochrone_label',
    'isochrone_data',
    'customer_id_denormalized',
    'latitude',
    'longitude',
    'geo_point',
    'city',
    'department',
    'region',
    'country_iso'
]

CUSTOMER_COLUMNS_TO_SEND = [
    "customer_id_denormalized",
    "longitude",
    "latitude",
    "filteringFeatures",
]

LOCATIONS_NO_FILTERING_COLUMNS = [
    'address',
    'latitude',
    'longitude',
    'geo_point',
    'isochrone_5_min',
    'isochrone_5_min_total_pop',
    'isochrone_5_min_area',
    'isochrone_5_min_reachfactor',
    'isochrone_10_min',
    'isochrone_10_min_total_pop',
    'isochrone_10_min_area',
    'isochrone_10_min_reachfactor',
    'isochrone_15_min',
    'isochrone_15_min_total_pop',
    'isochrone_15_min_area',
    'isochrone_15_min_reachfactor',
    'isochrone_30_min',
    'isochrone_30_min_total_pop',
    'isochrone_30_min_area',
    'isochrone_30_min_reachfactor',
    'isochrone_45_min',
    'isochrone_45_min_total_pop',
    'isochrone_45_min_area',
    'isochrone_45_min_reachfactor',
    'isochrone_60_min',
    'isochrone_60_min_total_pop',
    'isochrone_60_min_area',
    'isochrone_60_min_reachfactor',
    'webapp_location_id',
    'location_id'
]

LOCATION_COLUMNS_TO_SEND = [
    "location_id",
    "longitude",
    "latitude",
    "filteringFeatures",
    "address",
    "isochrones"
]