App.module("CouchApp.New", function(New, App, Backbone, Marionette, $, _){
  New.Contact = App.CouchApp.Common.Views.Form.extend({
    title: "New Contact",

    onRender: function(){
      this.$(".js-submit").text("Create contact");
    }
  });
});
