/*
 * View model for OctoExtruder
 *
 * Author: Samuel Maurice Walker
 * License: AGPLv3
 */
$(function () {
    function OctostruderViewModel(parameters) {
        var self = this;

        self.extruders = ko.observableArray([]);
        self.newExtruderConfig = ko.observable({
            name: ko.observable(""),
            toolNumber: ko.observable(""),
            type: ko.observable(""),
            gcodeConfig: {
                flavor: ko.observable(""),
                comPort: ko.observable("")
            }
        });
        self.newExtruderType = ko.observable("");

        self.addExtruder = function () {
            self.extruders.push(ko.toJS(self.newExtruderConfig));
            self.newExtruderConfig().name("");
            self.newExtruderConfig().toolNumber("");
            self.newExtruderType("");
            self.newExtruderConfig().gcodeConfig.flavor("");
            self.newExtruderConfig().gcodeConfig.comPort("");
        };

        self.removeExtruder = function (extruder) {
            self.extruders.remove(extruder);
        };

        self.saveSettings = function () {
            var data = {
                extruders: ko.toJS(self.extruders)
            };
            $.ajax({
                url: API_BASEURL + "plugin/octostruder",
                type: "POST",
                dataType: "json",
                data: JSON.stringify(data),
                contentType: "application/json; charset=UTF-8",
                success: function (response) {
                    console.log("Settings saved successfully");
                }
            });
        };
    }

    OCTOPRINT_VIEWMODELS.push({
        construct: OctostruderViewModel,
        dependencies: [],
        elements: ["#extruder_manager"]
    });
});

< !--Container for the Extruder Manager-- >
    <div id="extruder_manager" data-bind="visible: loginState.isAdmin">
        <h2>Extruder Manager</h2>

        <!-- List of existing extruders -->
        <div>
            <h3>Existing Extruders</h3>
            <ul data-bind="foreach: extruders">
                <li>
                    <strong data-bind="text: name"></strong> - Type: <span data-bind="text: type"></span>
                    <button data-bind="click: $parent.removeExtruder">Remove</button>
                </li>
            </ul>
        </div>

        <!-- Form to add a new extruder -->
        <div>
            <h3>Add a New Extruder</h3>
            <button id="add_extruder_button">+</button>
            <div id="add_extruder_form" style="display: none;">
                <label>Name: <input type="text" data-bind="value: newExtruderConfig().name" /></label><br />
                <label>Tool Number: <input type="number" data-bind="value: newExtruderConfig().toolNumber" /></label><br />
                <label>Type:
                    <select data-bind="value: newExtruderType">
                        <option value="">-- Select Type --</option>
                        <option value="gcode">G-code</option>
                    </select>
                </label><br />

                <!-- G-code Configuration -->
                <div data-bind="if: newExtruderType() === 'gcode'">
                    <h4>G-code Configuration</h4>
                    <label>G-code Flavor:
                        <select data-bind="value: newExtruderConfig().gcodeConfig.flavor">
                            <option value="">-- Select Flavor --</option>
                            <option value="marlin">Marlin</option>
                            <option value="repetier">Repetier</option>
                            <option value="smoothie">Smoothie</option>
                            <option value="grbl">GRBL</option>
                        </select>
                    </label><br />
                    <label>COM Port: <input type="number" data-bind="value: newExtruderConfig().gcodeConfig.comPort" /></label><br />
                </div>

                <button data-bind="click: addExtruder">Add Extruder</button>
            </div>
        </div>

        <button data-bind="click: saveSettings">Save Settings</button>

        <script>
            document.getElementById('add_extruder_button').addEventListener('click', function() {
            var form = document.getElementById('add_extruder_form');
            if (form.style.display === 'none') {
                form.style.display = 'block';
            } else {
                form.style.display = 'none';
            }
        });
        </script>
    </div>

