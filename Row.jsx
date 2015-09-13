Row = React.createClass({
  propTypes: {
    row: React.PropTypes.array.isRequired
  },

  renderCells () {
    return (this.props.row.map((cell) => {
      return (<Cell
        key={cell._id}
        cell={cell}
        selected={this.props.currentSelection === cell._id}
        setSelection={this.props.setSelection} />);
    }));
  },

  render() {
    return (
      <div className="row">
        <div className="cell header">Row {this.props.rowNumber}</div>
        {this.renderCells()}
      </div>
    );
  }
});
