sap.ui.define([
	"com/hella/ppm/WorkPackage/controller/BaseController"
], function (Controller) {
	"use strict";

	return Controller.extend("com.hella.ppm.WorkPackage.controller.Edit", {

		onInit: function () {
			var oRouter = this.getRouter();
			oRouter.getRoute("Edit").attachPatternMatched(this.handleRouteMatched, this);
			var editBasicController = this;
			var selectedItem = "";
		},

		handleRouteMatched: function (oEvent) {
			try {
				this.selectedItem = oEvent.getParameters().arguments.path
			} catch (exception) {}			
			
			var that = this;
//			this.selectedItem = oEvent.getParameters().arguments.path

			var detailModel= new sap.ui.model.json.JSONModel();
			this.getView().setModel(detailModel, "edit");
			var oModel = this.getView().getModel()
			
			oModel.read("/WorkPackageDetailSet(guid'"+ this.selectedItem +"')", {
	    		success: function(oData) {
	    			detailModel.setData(oData)
	    		},
	    		error: function(oError) { console.log(oError) }
	    	});
						
			var oSelect, oBinding, aFilters;
			
			oSelect = this.getView().byId("selectResult"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (this.selectedItem){
			  aFilters.push( new sap.ui.model.Filter("TaskGuid", 'EQ', this.selectedItem) );
			  aFilters.push( new sap.ui.model.Filter("FieldName", 'EQ', "Result") );
			}
			oBinding.filter(aFilters, sap.ui.model.FilterType.Application);  //apply the filter
			
			oSelect = this.getView().byId("selectStatus"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (this.selectedItem){
			  aFilters.push( new sap.ui.model.Filter("TaskGuid", 'EQ', this.selectedItem) );
			  aFilters.push( new sap.ui.model.Filter("FieldName", 'EQ', "Status") );
			}
			oBinding.filter(aFilters, sap.ui.model.FilterType.Application);  //apply the filter
			
			oSelect = this.getView().byId("selectSeverity"); //get the reference to your Select control
			oBinding = oSelect.getBinding("items");
			aFilters = [];
			
			if (this.selectedItem){
			  aFilters.push( new sap.ui.model.Filter("TaskGuid", 'EQ', this.selectedItem) );
			  aFilters.push( new sap.ui.model.Filter("FieldName", 'EQ', "Severity") );
			}
			oBinding.filter(aFilters, sap.ui.model.FilterType.Application);  //apply the filter
		},
		
		removeItemOnce: function(arr, value) { 
		    var index = arr.indexOf(value);
		    if (index > -1) {
		        arr.splice(index, 1);
		    }
		    return arr;
		},
		
		onSaveButtonPress: function (oEvent) {
			var that = this;
			
			var oEntry = {};
			oEntry.TaskGuid = this.selectedItem;
			oEntry.Severity = this.getView().byId("selectSeverity").getSelectedKey();
			if (this.getView().byId("selectStatus").getValue() === "") {
				oEntry.StatusText = this.getView().getModel("edit").getProperty("/StatusText")
			} else {
				oEntry.StatusText = this.getView().byId("selectStatus").getValue();
			}
			
			oEntry.ResultText = this.getView().byId("selectResult").getSelectedKey();
			oEntry.ActualFinish = this.getView().byId("actualFinish").getDateValue();
//			oEntry.PlanFinish.setMinutes(oEntry.PlanFinish.getMinutes() - oEntry.PlanFinish.getTimezoneOffset());
			
			var oModel = this.getView().getModel();
			oModel.update("/WorkPackageDetailSet(guid'"+ this.selectedItem +"')", oEntry, {
				success : function() {
					if (that.getView().byId("noteInput").getValue() != "") {
						
						var etag = 'W/"' + that.getView().getModel("edit").oData.Timestamp + 'm"';
						
						var oNoteEntry = {};
						oNoteEntry.NoteText = that.getView().byId("noteInput").getValue();
						oNoteEntry.TaskGuid = that.selectedItem;
						
						var oModel = that.getView().getModel();
					
						var sPath = oModel.createKey("/NoteSet", {
							TaskGuid: that.selectedItem
						});
						
						oModel.update(sPath, oNoteEntry, {
							sETag : etag,
							success : function() {
								that.onCancelButtonPress
							},
							error : function(oError) {
								console.log(oError)
							}
						});
					}					
					
					that.onCancelButtonPress();
				},
				error : function(oError) {
					console.log(oError)
				}
			});
			
			
			
			
		},

		//cancel the editmode
		//TODO: reset all changes
		onCancelButtonPress: function (oEvent) {
			var complete_url = window.location.href;
			var pieces = complete_url.split("/");			
			//17.06.2021 changes begin here
			window.history.go(-1);
			//17.06 changes end here
//			this.getRouter().navTo("Detail", {
//				path: pieces[12]
//			});//this line was commented on 17.06 to test the above statement
		}

	});

});