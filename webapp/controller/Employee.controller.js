sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/Sorter",
    "sap/m/MessageBox",

], function (Controller, Filter, FilterOperator, Sorter,MessageBox) {
        "use strict";

        return Controller.extend("assignment8.controller.Employee", {
            onInit: function () {
            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
           
            this.version = this.getOwnerComponent().getManifestEntry("/sap.app/applicationVersion/version")
            
        },
            
            
            onVerisonButtonPress :function (oEvent) {
                MessageBox.information("App Version  " + this.version);
                },
    
            

            onLanguageButtonPress: function (oEvent) {
                this._oLangPopover = sap.ui.xmlfragment("assignment8.view.fragments.LanguagesPopover", this);
                this.getView().addDependent(this._oLangPopover);
                this._oLangPopover.openBy(oEvent.getSource());
            },
            
            onEmployeeSearch: function (oEvent) {
                var filters,
                    sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    filters = new Filter({
                        filters: [
                            new Filter("FirstName", FilterOperator.Contains, sQuery),
                            new Filter("Title", FilterOperator.Contains, sQuery)
                        ],
                        and: false
                    });
                }
                this.byId("employeeList").getBinding("items").filter(filters);
            },
            
            handleEmpListItemPress: function (oEvent) {
                var orderList = this.byId("orderBox");
                var title = this.byId("employeeTitle");
                
                orderList.bindElement(oEvent.getParameter("listItem").getBindingContextPath());
                title.bindElement(oEvent.getParameter("listItem").getBindingContextPath());
            },
            
            getEmpCount: function (oEvent) {
                var count = oEvent.getParameter("total");
                this.byId("empTitle").setText("Total Employees (" + count + ")");
            },
            
            handleEmployeeSortButtonPressed: function (oEvent) {
                this.createViewSettingsDialog("assignment8.view.fragments.EmployeeListSortsDialog").open();
            },
            
            onOrderSearch: function (oEvent) {
                var filters,
                    sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    filters = new Filter({
                        filters: [
                        new Filter("OrderID", FilterOperator.EQ, sQuery),
                        new Filter("ShipVia", FilterOperator.EQ, sQuery)
                        
                        ], and: false
                    });
                }
                this.byId("orderList").getBinding("items").filter(filters);
            },
           
            handleOrderSortDialogConfirm: function (oEvent) {
                var oList = this.byId("orderList"),
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
            
            getOrderCount: function (oEvent) {
                var count = oEvent.getParameter("total");
                this.byId("orderTitle").setText("Total Orders (" + count + ")");
            },
            
            handleOrderListItemPress: function (oEvent) {
                this.byId("productDetailsBox").bindElement(oEvent.getParameter("listItem").getBindingContextPath());
            },
            
            handleOrderSortButtonPressed: function (oEvent) {
                this.createViewSettingsDialog("assignment8.view.fragments.OrderListSortsDialog").open();
            },
            
            handleEmployeeSortDialogConfirm: function (oEvent) {
                var oList = this.byId("employeeList"),
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
            
    		onProductDetailsSearch: function (oEvent) {
                var filters,
                    sQuery = oEvent.getSource().getValue();
                if (sQuery && sQuery.length > 0) {
                    filters = new Filter({
                        filters: [
                            new Filter("ProductID", FilterOperator.EQ, sQuery)
                        ]
                    });
                }
                this.byId("productDetailsList").getBinding("items").filter(filters);
            },
            
            getProductDetailsCount: function (oEvent) {
                var count = oEvent.getParameter("total");
                this.byId("productDetailsTitle").setText("Total Products (" + count + ")");
            },
            
            handleProductDetailsSortButtonPressed: function (oEvent) {
                this.createViewSettingsDialog("assignment8.view.fragments.ProductDetailsListSortsDialog").open();
            },
            
            
            onClose: function (oEvent) {
                this._oProductDialog.close();
            },
    
            
            createViewSettingsDialog: function (sFragmentName) {
                this._oDialog = sap.ui.xmlfragment(sFragmentName, this);
                this.getView().addDependent(this._oDialog);
                return this._oDialog;
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
            }

    

        });
    });
