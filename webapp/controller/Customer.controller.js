sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/core/routing/History"

], function (Controller,  Filter, FilterOperator, Sorter,  MessageBox,History) {
        "use strict";

        return Controller.extend("assignment8.controller.Customer", {
            onInit: function () {
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           
                this.version = this.getOwnerComponent().getManifestEntry("/sap.app/applicationVersion/version")            
            },
            // App version
                
            onVerisonButtonPress :function (oEvent) {
                MessageBox.information("App Version  " + this.version);
                },

            // Language Popover
                onLanguageButtonPress: function (oEvent) {
                    this._oLangPopover = sap.ui.xmlfragment("assignment8.view.fragments.LanguagesPopover", this);
                    this.getView().addDependent(this._oLangPopover);
                    this._oLangPopover.openBy(oEvent.getSource());
                },

            //Total Customer Count Function
                getCustomerCount: function (oEvent) {
                    var count = oEvent.getParameter("total");
                    this.byId("customerTableTitle").setText("Total Customers (" + count + ")");
                    
                },

            // Customer Select Event
                onCustomerSelectionChange: function (oEvent) {
                    this.byId("customerHeaderId").bindElement(oEvent.getParameter("listItems")[0].getBindingContextPath());   

                var title = this.byId("customerTitle");
                title.bindElement(oEvent.getParameter("listItem").getBindingContextPath());
                },
            // Customer Sorting popover
                handleCustomersSortButtonPressed: function (oEvent) {
                    this.createViewSettingsDialog("assignment8.view.fragments.CustomersTableSortsDialog").open();
                },
            

                createViewSettingsDialog: function (sFragmentName) {
                    this._oDialog = sap.ui.xmlfragment(sFragmentName, this);
                    this.getView().addDependent(this._oDialog);
                    return this._oDialog;
                },
            // Customer Sorting Function
                handleCustomersSortDialogConfirm: function (oEvent) {
                    var oTable = this.byId("customersTable"),
                        mParams = oEvent.getParameters(),
                        oBinding = oTable.getBinding("items"),
                        sPath,
                        bDescending,
                        aSorters = [];

                    sPath = mParams.sortItem.getKey();
                    bDescending = mParams.sortDescending;
                    aSorters.push(new Sorter(sPath, bDescending));

            // apply the selected sort and group settings
                    oBinding.sort(aSorters);
                },

                // Product sorting Function
                
                handleProductDetailsSortDialogConfirm: function (oEvent) {
                    var oList = this.byId("productDetailsList"),
                    mParams = oEvent.getParameters(),
                    oBinding = oList.getBinding("items"),
                    sPath,
                    bDescending,
                    aSorters = [];
                    
                    sPath = mParams.sortItem.getKey();
                    bDescending = mParams.sortDescending;
                    aSorters.push(new Sorter(sPath, bDescending));
                    
                    // apply the selected sort and group settings
                    oBinding.sort(aSorters);
                },
                // Search Function
                handleSearch: function (oEvent) {
                    var sValue = oEvent.getParameter("value");
                    var oFilter = new Filter("CompanyName", sap.ui.model.FilterOperator.Contains, sValue);
                    var oBinding = oEvent.getSource().getBinding("items");
                    oBinding.filter([oFilter]);
                },
                // Close Funtion
                handleClose: function (oEvent) {
                    this.selectedSuppliersData = this.getView().getModel("selectedModel").getData();
                    this.aContexts = oEvent.getParameter("selectedContexts");
                    if (this.aContexts && this.aContexts.length) {
                        this.aContexts.forEach(function (c) {
                            this.selectedSuppliersData.Suppliers = this.selectedSuppliersData.Suppliers.filter(function (supplier) {
                                if (supplier.SupplierID != c.getObject().SupplierID) {
                                    return supplier;
                                }
                            }.bind(this));
                            this.selectedSuppliersData.Suppliers.push(c.getObject());
                        }.bind(this));
                    }
                    this.getView().getModel("selectedModel").setData(this.selectedSuppliersData);
                    
                },
                // Route To Employee
                handleEmployee : function(oEvent){
                    this._oRouter.navTo("RouteEmployee");
                },
                //Route to Customer
                
                handleCustomer : function(oEvent){
                        this._oRouter.navTo("RouteCustomer");
                },
                // Route to Product
                handleProduct : function(oEvent){
                            this._oRouter.navTo("RouteProduct");
                },
                // Route to Supplier
                handleSupplier : function(oEvent){
                    this._oRouter.navTo("RouteSupplier");
                },
                
                handleBack: function(oEvent){
                    var oHistory = History.getInstance(),
                    sPreviousHash = oHistory.getPreviousHash();
                   if (sPreviousHash !== undefined) {
                       window.history.go(-1);
                   } else {
                       this._oRouter.navTo("RouteEmployee");
                   }
                }
                    
                
    

        });
    });
