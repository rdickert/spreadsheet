if (Meteor.isClient) {
  Meteor.startup(function() {
    // Use Meteor.startup to render the component after the page is ready

    // Wait on subscription ready or there is a race condition.
    Meteor.subscribe("sheet", {
      onReady () {
        ReactDOM.render(<App />, document.getElementById("render-target"));
      }
    });
  });
}
