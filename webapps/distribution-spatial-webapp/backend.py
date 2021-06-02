# -*- coding: utf-8 -*-

from flask import Flask
from flask_cors import CORS
from distributionspatialfootprint.api import define_endpoints

app = Flask(__name__)
cors = CORS(app)

define_endpoints(app)