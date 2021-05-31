import json
import os
import pandas as pd

import dataiku

import distributionspatialfootprint.dku_constants as constants


class DataHandler:
    isochrone_dataset: pd.DataFrame

    def __init__(self):
        self.load_data()

    def load_data(self):
        self.isochrones_df = dataiku.Dataset(constants.ISOCHRONES_DATASET_NAME).get_dataframe()
        self.customers_df = dataiku.Dataset(constants.CUSTOMERS_DATASET_NAME).get_dataframe()
        self.locations_df = dataiku.Dataset(constants.LOCATIONS_DATASET_NAME).get_dataframe()

    def get_available_filtering_features(self, moduleName):
        available_filtering_features = {}
        if moduleName == 'customer':
            for column in set(self.customers_df.columns).difference(constants.CUSTOMERS_NO_FILTERING_COLUMNS):
                available_filtering_features[column] = self.customers_df[column].unique().tolist()
        elif moduleName == 'location':
            for column in set(self.locations_df.columns).difference(constants.LOCATIONS_NO_FILTERING_COLUMNS):
                available_filtering_features[column] = self.locations_df[column].unique().tolist()
        return available_filtering_features

    def apply_filtering(self, df_to_filter, settings):
        filtering_query = True
        for (featureColumn, featureValues) in settings.items():
            if len(featureValues) > 0:
                filtering_query = filtering_query & df_to_filter[featureColumn].isin(featureValues)
        if filtering_query is True:
            return pd.DataFrame()  # Return nothing if no filters have been set
        return df_to_filter[filtering_query]

    def apply_sampling(self, moduleName, df_to_sample, settings):
        if df_to_sample.empty:
            return df_to_sample
        if settings["type"] == "nRows":
            if moduleName == "location":
                return df_to_sample.sample(int(settings["value"]), replace=True).drop_duplicates()
            else:
                return df_to_sample.groupby("location_id").sample(int(settings["value"]), replace=True).drop_duplicates()

    def prepare_for_sending(self, moduleName, df_to_send):
        if moduleName == 'customer':
            filtering_columns = set(df_to_send.columns).difference(constants.CUSTOMERS_NO_FILTERING_COLUMNS)
            columns_to_send = set(df_to_send.columns).intersection(constants.CUSTOMER_COLUMNS_TO_SEND)
        else:
            filtering_columns = set(df_to_send.columns).difference(constants.LOCATIONS_NO_FILTERING_COLUMNS)
            columns_to_send = set(df_to_send.columns).intersection(constants.LOCATION_COLUMNS_TO_SEND)
        filtering_features = df_to_send[filtering_columns].to_dict(orient="records")
        dict_to_send = df_to_send[columns_to_send].to_dict(orient="records")
        for i, rec in enumerate(dict_to_send):
            rec["filteringFeatures"] = filtering_features[i]

        if moduleName == 'location':
            self.add_isochrones_to_locations(dict_to_send)
        return dict_to_send

    def add_isochrones_to_locations(self, locations):
        for location in locations:
            locations_isochrones = self.isochrones_df[self.isochrones_df["location_id"] == location["location_id"]]\
                .to_dict(orient="records")
            for iso in locations_isochrones:
                iso["isochrone_data"] = json.loads(iso["isochrone_data"].replace("'", "\""))
            location["isochrones"] = locations_isochrones

    def filter_zones(self, moduleName, settings):
        df_to_handle = self.customers_df if moduleName == "customer" else self.locations_df
        filtered_df = self.apply_filtering(df_to_handle, settings["filtering"])
        sampled_df = self.apply_sampling(moduleName, filtered_df, settings["sampling"])
        return self.prepare_for_sending(moduleName, sampled_df)

    def get_available_isochrone_types(self):
        isochrones_df_unique = self.isochrones_df.drop_duplicates(subset=["isochrone_amplitude"])
        available_isochrones = [{
            'label': isochrone['isochrone_label'],
            'value': str(isochrone['isochrone_type'])
        } for isochrone in isochrones_df_unique.to_dict(orient='records')]
        return available_isochrones


if __name__ == "__main__":
    import pdb

    settings = {"filtering":{"city":["Bains-les-Bains"]},"sampling":{"type":"nRows","value":100}}

    data_handler = DataHandler()
    isos = data_handler.filter_zones("location", settings)
    print(isos)
