Cells = new Mongo.Collection("cells");

if (Meteor.isServer) {
  if (!Cells.findOne()) {
    for (let row = 0; row < 11; row++) {
      for (let col = 0; col < 9; col++) {
        Cells.insert({row, col, text: ""});
      }
    }
  }
}
