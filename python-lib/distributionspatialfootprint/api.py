import traceback

from flask import request, jsonify
from werkzeug.exceptions import HTTPException

# import dataiku
from .data_handler import DataHandler
import sys

data_handler = DataHandler()


def define_endpoints(app):
    @app.errorhandler(Exception)
    def handle_error(e):
        code = 500
        if isinstance(e, HTTPException):
            code = e.code
        return jsonify(error=str(e), trace=traceback.format_exc()), code

    @app.route('/available-filtering-features/<moduleName>', methods=['POST'])
    def get_available_filtering_features(moduleName):
        req_data = request.get_json()
        return jsonify(data_handler.get_available_filtering_features(moduleName, req_data))

    @app.route('/filtered-data/<moduleName>', methods=['POST'])
    def get_filtered_zones(moduleName):
        req_data = request.get_json()
        data = jsonify(data_handler.filter_zones(moduleName, req_data))
        return data

    @app.route('/available-isochrone-types', methods=['GET'])
    def get_available_isochrone_types():
        return jsonify(data_handler.get_available_isochrone_types())

    @app.route('/', methods=['GET'])
    def is_backend_running():
        return jsonify({"msg": "Backend is running !"})
