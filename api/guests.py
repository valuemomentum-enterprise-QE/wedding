import os
import sys

sys.path.insert(0, os.path.dirname(__file__))

from lib.defaults import default_guests
from lib.planner_route import make_planner_handler

handler = make_planner_handler("guests", seed_if_empty=default_guests)
