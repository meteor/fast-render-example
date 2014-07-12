Messages = new Meteor.Collection("messages");

if (Meteor.isClient) {
  Template.messages.myMessages = function () {
    return Messages.find().fetch();
  };

  Template.sendMessage.events({
    "click #send": function () {
      Meteor.call("sendMessage", $("#email").val(), $("#message").val(), function (err) {
        if (err) {
          console.log(err);
        } else {
          $("input").val("");
        }
      });
    }
  });

  Meteor.subscribe("messages");
}

Meteor.methods({
  sendMessage: function (recipient, message) {
    if (! this.userId) throw new Meteor.Error(403);

    Messages.insert({
      recipient: Meteor.isServer ?
        Meteor.users.findOne({ 'emails.address': recipient })._id : null,
      message: message,
      sender: Meteor.user().emails[0].address
    });
  }
});

if (Meteor.isServer) {
  Meteor.publish("messages", function () {
    return Messages.find({recipient: this.userId});
  });

  FastRender.route("/", function (params) {
    this.subscribe("messages");
  });
}
