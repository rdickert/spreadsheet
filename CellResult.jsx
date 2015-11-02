CellResult = React.createClass({
  render () {
    return (
      <span className="cell" onClick={this.props.showFormula}>
        {this.props.result}
      </span>
    );
  }
});
