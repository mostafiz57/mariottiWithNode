App.module("CouchApp.Show", function(Show, App, Backbone, Marionette, $, _){
  Show.Controller = {
    showContact: function(id){
      var loadingView = new App.Common.Views.Loading({
        title: "Artificial Loading Delay",
        message: "Data loading is delayed to demonstrate using a loading view."
      });
      App.mainRegion.show(loadingView);

      var fetchingContact = App.request("contact:entity", id);
      $.when(fetchingContact).done(function(contact){
        var contactView;
        if(contact !== undefined){
          contactView = new Show.Contact({
            model: contact
          });

          contactView.on("contact:edit", function(contact){
            App.trigger("contact:edit", contact.get("id"));
          });
        }
        else{
          contactView = new Show.MissingContact();
        }

        App.mainRegion.show(contactView);
      });
    }
  }
});
