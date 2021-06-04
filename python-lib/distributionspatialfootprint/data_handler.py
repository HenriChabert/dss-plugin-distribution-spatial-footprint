import json
import pandas as pd
import ast

import dataiku

import distributionspatialfootprint.dku_constants as constants


class DataHandler:
    isochrone_dataset: pd.DataFrame

    def __init__(self):
        self.load_data()

    def load_data(self):
        self.isochrones_df = dataiku.Dataset(constants.ISOCHRONES_DATASET_NAME).get_dataframe().applymap(str)
        self.customers_df = self.preprocess_customers_df(dataiku.Dataset(constants.CUSTOMERS_DATASET_NAME).get_dataframe())\
            .applymap(str)
        self.locations_df = dataiku.Dataset(constants.LOCATIONS_DATASET_NAME).get_dataframe().applymap(str)
        self.project_variables = dataiku.api_client().get_default_project().get_variables()

    def preprocess_customers_df(self, customers_df):
        return customers_df.loc[
                    customers_df
                    .groupby(['location_id', 'included_customer_id'])
                    .isochrone_amplitude.idxmin()
                ]

    def get_project_variables(self):
        return self.project_variables

    def get_available_filtering_features(self, moduleName, settings):
        available_filtering_features = {}
        if moduleName == 'customer':
            df_to_handle = self.customers_df
            no_filtering_columns = constants.CUSTOMERS_NO_FILTERING_COLUMNS
        else:
            df_to_handle = self.locations_df
            no_filtering_columns = constants.LOCATIONS_NO_FILTERING_COLUMNS

        if 'pre_filters' in settings:
            df_to_handle = self.apply_filtering(df_to_handle, settings["pre_filters"])

        for column in set(df_to_handle.columns).difference(no_filtering_columns):
            available_filtering_features[column] = df_to_handle[column].unique().tolist()
        return available_filtering_features

    def apply_filtering(self, df_to_filter, settings):
        filtering_query = True
        for (feature_column, feature_values) in settings.items():
            if len(feature_values) > 0:
                feature_values = list(map(str, feature_values))
                filtering_query = filtering_query & df_to_filter[feature_column].isin(feature_values)
        if filtering_query is True:
            return pd.DataFrame()  # Return nothing if no filters have been set
        return df_to_filter[filtering_query]

    def apply_sampling(self, moduleName, df_to_sample, settings):
        if df_to_sample.empty:
            return df_to_sample
        if settings["type"] == "nRows":
            if not settings["value"] or settings["value"] < 0:
                settings["value"] = 0
            sampling_val = int(settings["value"])
            if moduleName == "location":
                if sampling_val > len(df_to_sample):
                    return df_to_sample
                return df_to_sample.sample(int(settings["value"]))
            else:
                return df_to_sample.groupby('location_id').apply(
                    lambda x: x.sample(n=min(len(x), sampling_val))
                )
        elif settings["type"] == "noSampling":
            return df_to_sample

    def prepare_for_sending(self, moduleName, df_to_send):
        if moduleName == 'customer':
            filtering_columns = set(df_to_send.columns).difference(constants.CUSTOMERS_NO_FILTERING_COLUMNS)
            columns_to_send = set(df_to_send.columns).intersection(constants.CUSTOMER_COLUMNS_TO_SEND)
        else:
            filtering_columns = set(df_to_send.columns).difference(constants.LOCATIONS_NO_FILTERING_COLUMNS)
            columns_to_send = set(df_to_send.columns).intersection(constants.LOCATION_COLUMNS_TO_SEND)

        filtering_features = df_to_send[list(filtering_columns)].to_dict(orient="records")
        dict_to_send = df_to_send[list(columns_to_send)].to_dict(orient="records")
        for i, rec in enumerate(dict_to_send):
            rec["filteringFeatures"] = filtering_features[i]

        if moduleName == 'location':
            self.add_isochrones_to_locations(dict_to_send)

        return dict_to_send

    def add_isochrones_to_locations(self, locations):
        for location in locations:
            locations_isochrones = self.isochrones_df[self.isochrones_df["location_id"] == location["location_id"]] \
                .to_dict(orient="records")
            for iso in locations_isochrones:
                iso["isochrone_data"] = json.loads(iso["isochrone_data"])
            location["isochrones"] = locations_isochrones

    def filter_zones(self, moduleName, settings):
        df_to_handle = self.customers_df if moduleName == "customer" else self.locations_df
        filtered_df = self.apply_filtering(df_to_handle, settings["filtering"])
        sampled_df = self.apply_sampling(moduleName, filtered_df, settings["sampling"])
        return self.prepare_for_sending(moduleName, sampled_df)

    def get_available_isochrone_types(self):
        isochrones_df_unique = self.isochrones_df.drop_duplicates(subset=["isochrone_amplitude"])
        available_isochrones = [{
            'label': f"{isochrone['isochrone_amplitude']} min",
            'value': {
                'isochrone_type': isochrone['isochrone_type'],
                'isochrone_amplitude': int(isochrone['isochrone_amplitude'])
            }
        } for isochrone in isochrones_df_unique.to_dict(orient='records')]
        return available_isochrones


if __name__ == "__main__":
    import pdb

    settings = {"filtering": {"location_id": ["0"]}, "sampling": {"type": "nRows", "value": 100}}

    data_handler = DataHandler()
    isos = data_handler.filter_zones("customer", settings)
    print(isos)
    print(len(isos))
