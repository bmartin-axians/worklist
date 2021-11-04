jQuery.sap.require("sap.ca.ui.model.format.NumberFormat");
jQuery.sap.require("sap.ca.ui.model.format.AmountFormat");
jQuery.sap.require("sap.ca.ui.model.format.FileSizeFormat");
jQuery.sap.require("sap.ca.ui.model.format.DateFormat");
jQuery.sap.require("sap.ca.ui.model.format.FormattingLibrary");
jQuery.sap.declare("mylop.util.Formatter");
mylop.util.Formatter = {
	formatterCreatedAt : function(d) {
		if (!d)
			return;
		// return d.substring(6, 8) + "." + d.substring(4, 6) + "."
		// + d.substring(0, 4);
		return d.substring(6, 8) + "." + d.substring(4, 6) + "."
				+ d.substring(0, 4) + " " + d.substring(8, 10) + ":"
				+ d.substring(10, 12) + ":" + d.substring(12, 14);
	},

	unformatCreatedAt : function(d) {
		if (!d)
			return;
		return d.substring(6, 10) + d.substring(3, 5) + d.substring(0, 2);
	}
};