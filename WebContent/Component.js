sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"com/hella/ppm/WorkPackage/model/models"
], function (UIComponent, Device, models) {
	"use strict";

	return UIComponent.extend("com.hella.ppm.WorkPackage.Component", {

		metadata: {
			manifest: "json"
//			routing: {
//				config: {
//					routerClass: "sap.m.routing.Router",
//					viewType: "XML",
//					async: true,
//					viewPath: "com.hella.ppm.WorkPackage.view",
//					controlAggregation: "pages",
//					controlId: "app",
//					clearControlAggregation: false
//				},
//				routes: [{
//					name: "TargetMaster",
//					pattern: "",
//					target: ["TargetMaster", "Detail"]
//				}, {
//					name: "Detail",
//					pattern: "detail/{path}",
//					titleTarget: "",
//					greedy: false,
//					target: ["TargetMaster", "Detail"]
//				}, {
//					name: "Edit",
//					pattern: "edit/{path}",
//					titleTarget: "",
//					greedy: false,
//					target: ["TargetMaster", "Edit"]
//				}],
//				targets: {
//					TargetMaster: {
//						viewType: "XML",
//						transition: "slide",
//						clearControlAggregation: false,
//						viewId: "",
//						viewName: "Master",
//						controlId: "idAppControl",
//						controlAggregation: "masterPages"
//					},
//					Detail: {
//						viewType: "XML",
//						viewName: "Detail",
//						controlAggregation: "detailPages",
//						controlId: "idAppControl"
//					},
//					Empty: {
//						viewType: "XML",
//						viewName: "Empty",
//						controlAggregation: "detailPages",
//						controlId: "idAppControl"
//					},
//					Edit: {
//						viewType: "XML",
//						viewName: "Edit",
//						controlAggregation: "detailPages",
//						controlId: "idAppControl"
//					}
//				}
//			}
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
		},
		
		createContent: function () {
			return new sap.m.SplitApp("idAppControl");
		}
		
	});
});