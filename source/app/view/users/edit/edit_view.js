App.module("CouchApp.Edit", function(Edit, App, Backbone, Marionette, $, _){
  Edit.Contact = App.CouchApp.Common.Views.Form.extend({
    initialize: function(){
      this.title = "Edit " + this.model.get("name");
    },

    onRender: function(){
      if(this.options.generateTitle){
        var $title = $('<h3>', { text: this.title });
        this.$el.prepend($title);
      }

      this.$(".js-submit").text("Update contact");
    }
  });
});
