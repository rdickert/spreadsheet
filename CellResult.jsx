CellResult = React.createClass({
  render () {
    // Convert result toString() because react doesn't like objects here,
    // but store as json so it evals correctly in cell references
    // (e.g., false renders as "false" but evaluates to boolean false)
    let result = this.props.result;
    if (result === null || result === undefined) {
      result = "";
    } else {
      result = result.toString();
    }
    return (
      <span className="cell" onClick={this.props.showFormula}>
        {result}
      </span>
    );
  }
});
