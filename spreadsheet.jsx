if (Meteor.isClient) {
  Meteor.startup(function() {
    // Use Meteor.startup to render the component after the page is ready

    // XXX setTimeout is to avoid a race condition with subscriptions.
    // improve: wait on subscription ready instead.
    Meteor.setTimeout(() => {
      ReactDOM.render(<App />, document.getElementById("render-target"));
    }, 80);
  });
}
