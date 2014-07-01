App.module("CouchApp", function(CouchApp, App, Backbone, Marionette, $, _){
  CouchApp.Router = Marionette.AppRouter.extend({
    appRoutes: {
      "contacts(/filter/criterion::criterion)": "listContacts",
      "contacts/:id": "showContact",
      "contacts/:id/edit": "editContact"
    }
  });

  var API = {
    listContacts: function(criterion){
      CouchApp.List.Controller.listContacts(criterion);
      App.execute("set:active:header", "contacts");
    },

    showContact: function(id){
      CouchApp.Show.Controller.showContact(id);
      App.execute("set:active:header", "contacts");
    },

    editContact: function(id){
      CouchApp.Edit.Controller.editContact(id);
      App.execute("set:active:header", "contacts");
    }
  };

  App.on("contacts:list", function(){
    App.navigate("contacts");
    API.listContacts();
  });

  App.on("contacts:filter", function(criterion){
    if(criterion){
      App.navigate("contacts/filter/criterion:" + criterion);
    }
    else{
      App.navigate("contacts");
    }
  });

  App.on("contact:show", function(id){
    App.navigate("contacts/" + id);
    API.showContact(id);
  });

  App.on("contact:edit", function(id){
    App.navigate("contacts/" + id + "/edit");
    API.editContact(id);
  });

  App.addInitializer(function(){
    new CouchApp.Router({
      controller: API
    });
  });
});
