sap.ui.define([
	"com/hella/ppm/WorkPackage/controller/BaseController",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("com.hella.ppm.WorkPackage.controller.Detail", {

		onInit: function () {
			var oRouter = this.getRouter();
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.attachRoutePatternMatched(this.handleRouteMatched, this);
			//oRouter.getRoute("Detail").attachPatternMatched(this.handleRouteMatched, this);
			var selectedItem = "";
			var that = this;
		},

		handleRouteMatched: function (oEvent) {
			try {
				this.selectedItem = oEvent.getParameters().arguments.path
			} catch (exception) { }

			if (this.selectedItem == undefined) {
				try {
					this.selectedItem = this.getOwnerComponent().getComponentData().startupParameters.lGuid[0]; // get Startup params from Owner Component
				}
				catch (exception) {
					this.selectedItem = "005056b8-656b-1eeb-88d1-91d4bd318319";
				}
			}

			var detailModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(detailModel, "detail");
			var oModel = this.getView().getModel()

			oModel.read("/WorkPackageDetailSet(guid'" + this.selectedItem + "')", {
				success: function (oData) {
					detailModel.setData(oData)
				},
				error: function (oError) { console.log(oError) }
			});

			var noteModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(noteModel, "note");
			var oFilter = new sap.ui.model.Filter("TaskGuid", 'EQ', this.selectedItem);
			var aFilters = [oFilter];

			oModel.read("/NoteSet", {
				filters: aFilters,
				success: function (oData) {
					noteModel.setData(oData)
				},
				error: function (oError) { console.log(oError) }
			});

			var outputModel = new sap.ui.model.json.JSONModel();
			this.getView().setModel(outputModel, "output");

			oModel.read("/OutputSet", {
				filters: aFilters,
				success: function (oData) {
					outputModel.setData(oData)
				},
				error: function (oError) { console.log(oError) }
			});
		},

		//Change to Editmode
		onEditButtonPress: function (oEvent) {
			var complete_url = window.location.href;
			var pieces = complete_url.split("/");

			this.getRouter().navTo("Edit", {
				path: pieces[5]
			});
		},

		onSendMailButtonPress: function (oEvent) {
		},

		//Post a new Note
		onNotePostButtonPress: function (oEvent) {
			var that = this;
			var etag = 'W/"' + this.getView().getModel("detail").oData.Timestamp + 'm"';

			var oEntry = {};
			oEntry.NoteText = this.getView().byId("inputNote").getValue();
			oEntry.TaskGuid = this.selectedItem;

			var oModel = this.getView().getModel();

			var sPath = oModel.createKey("/NoteSet", {
				TaskGuid: this.selectedItem
			});

			oModel.update(sPath, oEntry, {
				sETag: etag,
				success: function () {
					that.handleRouteMatched()
				},
				error: function (oError) {
					console.log(oError)
				}
			});
		},
		//16.06.21:

		//end 16.06.21 changes - deleted

		onDocAddButton: function (oEvent) {
			var oDialog = sap.ui.xmlfragment("com.hella.ppm.WorkPackage.view.fragments.DialogAddDoc", this);
			this.getView().addDependent(oDialog);
			oDialog.open();
		}
	});

});