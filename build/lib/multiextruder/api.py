from flask import jsonify, request
from octoprint_extra_extruders.gpio_control import GPIOController


class ExtraExtrudersAPI:
    def __init__(self):
        self.tools = {}

    def add_tool(self, tool_id, step_pin, dir_pin, enable_pin):
        if tool_id in self.tools:
            return jsonify({"error": "Tool already exists"}), 400
        self.tools[tool_id] = GPIOController(step_pin, dir_pin, enable_pin)
        return jsonify({"success": True}), 200

    def remove_tool(self, tool_id):
        if tool_id not in self.tools:
            return jsonify({"error": "Tool not found"}), 404
        self.tools[tool_id].disable()
        del self.tools[tool_id]
        return jsonify({"success": True}), 200
