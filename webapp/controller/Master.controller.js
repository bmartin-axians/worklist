sap.ui.define([
	"com/hella/ppm/WorkPackage/controller/BaseController",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel"
], function (Controller, Filter, FilterOperator, JSONModel) {
	"use strict";

	return Controller.extend("com.hella.ppm.WorkPackage.controller.Master", {
		onInit: function () {
			//this.getRouter().getRoute("TargetMaster").attachPatternMatched(this.handleRouteMatched, this);
			this.getView().setModel(sap.ui.getCore().getModel("odata"));
			this.getView().setModel(sap.ui.getCore().getModel("i18n"), "i18n");
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
			var that = this;
			var selectedItem = "";
		},

		onTaskItemPress: function (oEvent, guid) {
			var sPath
			if (guid == undefined) {
				var index = oEvent.getParameter("listItem").getBindingContextPath().substr(1);
				sPath = this.getView().oModels.master.oData[index].TaskGuid
				this.getView().byId("idMasterList").setSelectedItem(this.getView().byId("idMasterList").getItems()[index]);

			} else {
				sPath = guid
			}

			// this.getRouter().navTo("Detail", {
			// 	path: sPath
			// });

		},

		//open popover to set filter
		onFilterButtonPress: function (oEvent) {
			var oPopover = sap.ui.xmlfragment("com.hella.ppm.WorkPackage.view.fragments.PopoverFilter", this);
			this.getView().addDependent(oPopover);
			oPopover.openBy(oEvent.getSource());
		},

		//open popover to set group
		onGroupButtonPress: function (oEvent) {
			var oPopover = sap.ui.xmlfragment("com.hella.ppm.WorkPackage.view.fragments.PopoverGroup", this);
			this.getView().addDependent(oPopover);
			oPopover.openBy(oEvent.getSource());
		},

		//Refresh the Tasklist
		onRefreshPress: function (oEvent) {
			this.handleRouteMatched(oEvent)
		},

		//Set the Searchfilter
		onSearchHandle: function (oEvent) {

		},

		//filteritem press to change filter
		onFilterItemPress: function (oEvent) {
			var oViewModel = this.getView().getModel("view");
			var oLocalModel = this.getView().getModel("local");
			var oSelectedCtx = oEvent.getSource().getSelectedContexts()[0];
			var sSelectedKey = oLocalModel.getProperty("key", oSelectedCtx);

			oViewModel.setProperty("/selectedFilter", sSelectedKey);

		},

		//set groups
		onGroupItemPress: function (oEvent) {
			var oViewModel = this.getView().getModel("view");
			var oLocalModel = this.getView().getModel("local");
			var oSelectedCtx = oEvent.getSource().getSelectedContexts()[0];
			var sSelectedKey = oLocalModel.getProperty("key", oSelectedCtx);

			oViewModel.setProperty("/selectedGroup", sSelectedKey);
		},

		handleRouteMatched: function (oEvent) {
			try {
				this.selectedItem = oEvent.getParameters().arguments.path
			} catch (exception) { }

			try {
				var startupParams = this.getOwnerComponent().getComponentData().startupParameters; // get Startup params from Owner Component
				var oFilterNode = new sap.ui.model.Filter("ProjectGuid", 'EQ', startupParams.pGuid[0]);
			} catch (exception) {
				oFilterNode = new sap.ui.model.Filter("ProjectGuid", 'EQ', "005056b8-656b-1eda-88c6-2be422e18d20");
			}
			var complete_url = window.location.href;
			var pieces = complete_url.split("/");
			if (pieces[11] != "detail" && pieces[11] != "edit") {
				try {
					this.onTaskItemPress(oEvent, startupParams.lGuid[0]);
				} catch (exception) {
					this.onTaskItemPress(oEvent, "005056b8-656b-1eeb-88d1-91d4bd318319");
				}
			}
			var oJsonModel = new JSONModel();
			this.getView().setModel(oJsonModel, "master");


			var aFilters = [oFilterNode];
			var that = this;
			this.getView().getModel().read("/WorkPackageListSet", {
				filters: aFilters,
				success: function (oData) {
					oJsonModel.setData(oData.results)

					if (that.selectedItem != "") {
						var index = oData.results.findIndex(arr => arr.TaskGuid === that.selectedItem)
					} else {
						var index = oData.results.findIndex(arr => arr.TaskGuid === that.getOwnerComponent().getComponentData().startupParameters.lGuid[0])
					}					
					that.getView().byId("idMasterList").setSelectedItem(that.getView().byId("idMasterList").getItems()[index]);
					this.getView().setModel(oJsonModel, "master");
				},
				error: function (oError) { console.log(oError) }
			});	
		},

		//16.06.21:
		onPressBack: function () {
			window.history.go(-2);
			return
		},
		//end 16.06.21 changes
	});
});