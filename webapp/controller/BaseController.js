sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"../utils/formatter"
], function (Controller, History, Formatter) {
	"use strict";

	return Controller.extend("com.hella.ppm.WorkPackage.controller.BaseController", {

		formatter: Formatter,

		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},

		onNavBack: function (oEvent) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);

			} else {
				this.getRouter().navTo("TargetMaster", {}, true /*no history*/ );
			}
		},

		onDialogClose: function (oEvent) {
			oEvent.getSource().getParent().close();
		}
	});
});