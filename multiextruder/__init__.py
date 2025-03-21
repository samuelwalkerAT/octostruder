# coding=utf-8
from __future__ import absolute_import
import re
import json

import octoprint.plugin

class GCodeProcessor:
    def __init__(self, comport):
        self.comport = comport

    def process_gcode(self, gcode_line):
        if "T" in gcode_line:
            tool_number = int(re.search(r'T(\d+)', gcode_line).group(1))
            self.send_to_comport(gcode_line)

    def send_to_comport(self, gcode_line):
        # Implement COM port communication logic here
        print(f"Sending G-code to COM port: {gcode_line}")

class OctostruderPlugin(octoprint.plugin.SettingsPlugin,
                        octoprint.plugin.AssetPlugin,
                        octoprint.plugin.TemplatePlugin,
                        octoprint.plugin.SimpleApiPlugin):

    # ~~ SettingsPlugin mixin

    def get_template_configs(self):
        return [
            {
                "type": "settings",
                "name": "Extruder Manager",
                "template": "my_plugin_settings.jinja2"
            }
        ]

    def get_settings_defaults(self):
        return {
            "extruders": []
        }

    # ~~ AssetPlugin mixin

    def get_assets(self):
        return {
            "js": ["js/octostruder.js"],
            "css": ["css/octostruder.css"],
            "less": ["less/octostruder.less"]
        }

    # ~~ SimpleApiPlugin mixin

    def get_api_commands(self):
        return dict(
            save_settings=["extruders"]
        )

    def on_api_command(self, command, data):
        if command == "save_settings":
            self._settings.set(["extruders"], data["extruders"])
            self._settings.save()
            return flask.jsonify(success=True)

    # ~~ Softwareupdate hook

    def get_update_information(self):
        return {
            "octostruder": {
                "displayName": "Octostruder Plugin",
                "displayVersion": self._plugin_version,
                "type": "github_release",
                "user": "samuelwalkerAT",
                "repo": "OctoExtruder",
                "current": self._plugin_version,
                "pip": "https://github.com/samuelwalkerAT/OctoExtruder/archive/{target_version}.zip",
            }
        }

__plugin_name__ = "Octostruder Plugin"
__plugin_pythoncompat__ = ">=3,<4"

def __plugin_load__():
    global __plugin_implementation__
    __plugin_implementation__ = OctostruderPlugin()

    global __plugin_hooks__
    __plugin_hooks__ = {
        "octoprint.plugin.softwareupdate.check_config": __plugin_implementation__.get_update_information
    }

