Cell = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return Cells.findOne({col: this.props.col, row: this.props.row});
  },

  propTypes: {
    // cell: React.PropTypes.object.isRequired
  },

  showFormula (event) {
    this.props.setSelection(this.data);
    event.stopPropagation();
  },

  updateFormula (text) {
    // move to method
    if (text !== this.data.text) {
      Cells.update(this.data._id, {$set: {text}});
    }
    this.props.clearSelection();
  },

  shouldComponentUpdate (nextProps, nextState) {
    return ! (
      this.props.selected === nextProps.selected &&
      this.state === nextState
    );
  },

  render() {
    return this.props.selected
      ? <CellFormula
          text={this.data.text}
          updateFormula={this.updateFormula}
          clearSelection={this.props.clearSelection}
        />
      : <CellResult
          text={this.data.text}
          showFormula={this.showFormula}
        />;
  }
});
