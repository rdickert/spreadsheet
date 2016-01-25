if (Meteor.isClient) {
  Meteor.startup(function() {
    // Wait on subscription ready or there is a race condition.
    Meteor.subscribe("sheet", {
      onReady () {
        ReactDOM.render(<App />, document.getElementById("render-target"));
      }
    });
  });
}
