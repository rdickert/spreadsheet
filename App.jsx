/*global App:true*/

App = React.createClass({
  render() {
    return (
      <div className="container" onClick={this.clearSelection}>
        <header>
          <h1>Spreadsheet</h1>
        </header>
        <Sheet />
      </div>
    );
  }
});
