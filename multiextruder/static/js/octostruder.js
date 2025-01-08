/*
 * View model for OctoExtruder
 *
 * Author: Samuel Maurice Walker
 * License: AGPLv3
 */
$(function () {
    function ExtruderManagerViewModel(parameters) {
        var self = this;

        // Observable for extruder list
        self.extruders = ko.observableArray([]);

        // Observable for the type of extruder (G-code or GPIO)
        self.newExtruderType = ko.observable();

        // Observable for extruder configuration
        self.newExtruderConfig = ko.observable({
            name: ko.observable(""),
            type: ko.observable(""), // "gpio" or "gcode"
            gpioConfig: {
                stepPin: ko.observable(""),
                directionPin: ko.observable(""),
                enablePin: ko.observable("")
            },
            gcodeConfig: {
                octoToolNumber: ko.observable(""),
                boardToolNumber: ko.observable(""),
                parameters: ko.observableArray([])
            }
        });

        // Action to add a new extruder
        self.addExtruder = function () {
            var config = ko.toJS(self.newExtruderConfig());
            self.extruders.push(config);
            self.resetNewExtruder();
        };

        // Reset new extruder form
        self.resetNewExtruder = function () {
            self.newExtruderConfig({
                name: ko.observable(""),
                type: ko.observable(""),
                gpioConfig: {
                    stepPin: ko.observable(""),
                    directionPin: ko.observable(""),
                    enablePin: ko.observable("")
                },
                gcodeConfig: {
                    command: ko.observable(""),
                    parameters: ko.observableArray([])
                }
            });
        };

        // Remove an extruder
        self.removeExtruder = function (extruder) {
            self.extruders.remove(extruder);
        };

        // Subscribing to changes in the type to auto-clear unnecessary fields
        self.newExtruderType.subscribe(function (type) {
            if (type === "gpio") {
                self.newExtruderConfig().gcodeConfig.command("");
                self.newExtruderConfig().gcodeConfig.parameters([]);
            } else if (type === "gcode") {
                self.newExtruderConfig().gpioConfig.stepPin("");
                self.newExtruderConfig().gpioConfig.directionPin("");
                self.newExtruderConfig().gpioConfig.enablePin("");
            }
        });
    }

    // Register the view model
    OCTOPRINT_VIEWMODELS.push({
        construct: ExtruderManagerViewModel,
        dependencies: [],
        elements: ["#extruder_manager"]
    });
});

