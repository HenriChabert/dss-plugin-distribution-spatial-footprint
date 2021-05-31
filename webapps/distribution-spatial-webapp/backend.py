# -*- coding: utf-8 -*-

from flask import Flask
from distributionspatialfootprint.api import define_endpoints
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app)

define_endpoints(app)
