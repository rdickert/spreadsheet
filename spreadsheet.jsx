if (Meteor.isClient) {
  Meteor.startup(function() {
    // Use Meteor.startup to render the component after the page is ready

    // XXX setTimeout was to avoid a posited race condition,
    // (but it may not exist). Probably delete this - but could have rendering
    // wait on subscription ready if race condition exists
    Meteor.setTimeout(() => {
      ReactDOM.render(<App />, document.getElementById("render-target"));
    }, 80);
  });
}
