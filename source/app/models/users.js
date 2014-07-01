App.module("Entities", function(Entities, App, Backbone, Marionette, $, _) {
    Entities.Contact = Backbone.Model.extend({
        urlRoot: "contacts",
        defaults: {
            name: "",
            email: "",
            city: "",
            zipCode: ""
        },
        validate: function(attrs, options) {
            var errors = {}
            if (!attrs.name) {
                errors.name = "can't be blank";
            }
            if (!attrs.email) {
                errors.email = "can't be blank";
            }
            if (!attrs.city) {
                errors.city = "can't be blank";
            }

            if (attrs.zipCode.length < 2) {
                errors.zipCode = "is too short";
            }

            if (attrs.zipCode.length > 8) {
                errors.zipCode = "is too large";
            }

            if (!_.isEmpty(errors)) {
                return errors;
            }
        }
    });

    Entities.configureStorage(Entities.Contact);

    Entities.ContactCollection = Backbone.Collection.extend({
        url: "contacts",
        model: Entities.Contact,
        comparator: "name"
    });

    Entities.configureStorage(Entities.ContactCollection);

    var initializeContacts = function() {
        contacts = new Entities.ContactCollection([
            {id: 1, name: "Alice", email: "alice@gmail.com", city: "Boston", zipCode: "333-09"},
            {id: 2, name: "Bob", email: "bob@yahoo.com", city: "Nework", zipCode: "333-09"},
            {id: 3, name: "Charlie", email: "charlie@hotmail.com", city: "Campbell", zipCode: "333-09"}
        ]);
        contacts.forEach(function(contact) {
            contact.save();
        });
        return contacts.models;
    };

    var API = {
        getContactEntities: function() {
            var contacts = new Entities.ContactCollection();
            var defer = $.Deferred();
            contacts.fetch({
                success: function(data) {
                    defer.resolve(data);
                }
            });
            var promise = defer.promise();
            $.when(promise).done(function(contacts) {
                if (contacts.length === 0) {
                    // if we don't have any contacts yet, create some for convenience
                    var models = initializeContacts();
                    contacts.reset(models);
                }
            });
            return promise;
        },
        getContactEntity: function(contactId) {
            var contact = new Entities.Contact({id: contactId});
            var defer = $.Deferred();
            setTimeout(function() {
                contact.fetch({
                    success: function(data) {
                        defer.resolve(data);
                    },
                    error: function(data) {
                        defer.resolve(undefined);
                    }
                });
            }, 2000);
            return defer.promise();
        }
    };

    App.reqres.setHandler("contact:entities", function() {
        return API.getContactEntities();
    });

    App.reqres.setHandler("contact:entity", function(id) {
        return API.getContactEntity(id);
    });
});
