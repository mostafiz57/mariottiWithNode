App.module("CouchApp.List", function(List, App, Backbone, Marionette, $, _) {
    List.Controller = {
        listContacts: function(criterion) {
            var loadingView = new App.Common.Views.Loading();
            App.mainRegion.show(loadingView);

            var fetchingContacts = App.request("contact:entities");

            var contactsListLayout = new List.Layout();
            var contactsListPanel = new List.Panel();

            $.when(fetchingContacts).done(function(contacts) {
                var filteredContacts = App.Entities.FilteredCollection({
                    collection: contacts,
                    filterFunction: function(filterCriterion) {
                        var criterion = filterCriterion.toLowerCase();
                        return function(contact) {
                            if (contact.get("name").toLowerCase().indexOf(criterion) !== -1
                                    || contact.get("email").toLowerCase().indexOf(criterion) !== -1
                                    || contact.get("city").toLowerCase().indexOf(criterion) !== -1
                                    || contact.get("zipCode").toLowerCase().indexOf(criterion) !== -1) {
                                return contact;
                            }
                        };
                    }
                });

                if (criterion) {
                    filteredContacts.filter(criterion);
                    contactsListPanel.once("show", function() {
                        contactsListPanel.triggerMethod("set:filter:criterion", criterion);
                    });
                }

                var contactsListView = new List.Contacts({
                    collection: filteredContacts
                });

                contactsListPanel.on("contacts:filter", function(filterCriterion) {
                    filteredContacts.filter(filterCriterion);
                    App.trigger("contacts:filter", filterCriterion);
                });

                contactsListLayout.on("show", function() {
                    contactsListLayout.panelRegion.show(contactsListPanel);
                    contactsListLayout.contactsRegion.show(contactsListView);
                });

                contactsListPanel.on("contact:new", function() {
                    var newContact = new App.Entities.Contact();

                    var view = new App.CouchApp.New.Contact({ model: newContact });

                    view.on("form:submit", function(data) {
                        if (contacts.length > 0) {
                            var highestId = contacts.max(function(c) {
                                return c.id;
                            }).get("id");
                            data.id = highestId + 1;
                        }
                        else {
                            data.id = 1;
                        }
                        if (newContact.save(data)) {
                            contacts.add(newContact);
                            view.trigger("dialog:close");
                            var newContactView = contactsListView.children.findByModel(newContact);
                            
                            if (newContactView) {
                                newContactView.flash("success");
                            }
                        }
                        else {
                            view.triggerMethod("form:data:invalid", newContact.validationError);
                        }
                    });

                    App.dialogRegion.show(view);
                });

                contactsListView.on("itemview:contact:show", function(childView, args) {
                    App.trigger("contact:show", args.model.get("id"));
                });

                contactsListView.on("itemview:contact:edit", function(childView, args) {
                    var model = args.model;
                    var view = new App.CouchApp.Edit.Contact({
                        model: model
                    });

                    view.on("form:submit", function(data) {
                        if (model.save(data)) {
                            childView.render();
                            view.trigger("dialog:close");
                            childView.flash("success");
                        }
                        else {
                            view.triggerMethod("form:data:invalid", model.validationError);
                        }
                    });

                    App.dialogRegion.show(view);
                });

                contactsListView.on("itemview:contact:delete", function(childView, args) {
                    args.model.destroy();
                });

                App.mainRegion.show(contactsListLayout);
            });
        }
    }
});
