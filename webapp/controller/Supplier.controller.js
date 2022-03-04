sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/routing/History"



], function (Controller,  Filter, FilterOperator, Sorter,  MessageBox, JSONModel, History) {
        "use strict";

        return Controller.extend("assignment8.controller.Supplier", {
            onInit: function () {
                this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           
                this.version = this.getOwnerComponent().getManifestEntry("/sap.app/applicationVersion/version");
                var oModel = new JSONModel({
                    "Suppliers": []
                });
                this.getView().setModel(oModel, "selectedModel");
            
                
            },
            // To Show Version Information
            
            onVerisonButtonPress :function (oEvent) {
                MessageBox.information("App Version  " + this.version);
            },

            // Language Popover
            onLanguageButtonPress: function (oEvent) {
                this._oLangPopover = sap.ui.xmlfragment("assignment8.view.fragments.LanguagesPopover", this);
                this.getView().addDependent(this._oLangPopover);
                this._oLangPopover.openBy(oEvent.getSource());
            },
            
            openSupplierDialog: function (oEvent) {
                this._oProductDialog = sap.ui.xmlfragment("assignment8.view.fragments.SuppliersSelectionTableDialog", this);
                this.getView().addDependent(this._oProductDialog);
                this._oProductDialog.open();
                
                // openBy(oEvent.getSource());
                
                
    
            },
            
            onDelete: function (oEvent) {
                var selectedSuppliersData = this.getView().getModel("selectedModel").getData();
                selectedSuppliersData.Suppliers.splice(parseInt(oEvent.getParameter("listItem").getBindingContextPath().split("/").pop(), 10), 1);
                // delete selectedSuppliersData.Suppliers[parseInt(oEvent.getParameter("listItem").getBindingContextPath().split("/").pop(), 10)];
                this.getView().getModel("selectedModel").setData(selectedSuppliersData);
            },
                    
            
            
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
            
            handleSearch: function (oEvent) {
                var sValue = oEvent.getParameter("value");
                var oFilter = new Filter("CompanyName", sap.ui.model.FilterOperator.Contains, sValue);
                var oBinding = oEvent.getSource().getBinding("items");
                oBinding.filter([oFilter]);
            },
            
            
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
            
            handleEmployee : function(oEvent){
                this._oRouter.navTo("RouteEmployee");
            },
            
            
            handleCustomer : function(oEvent){
                    this._oRouter.navTo("RouteCustomer");
            },
            
            handleProduct : function(oEvent){
                        this._oRouter.navTo("RouteProduct");
            },
            
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
