const EMPTY_CELL = <span>&nbsp;</span>;

Cell = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return Cells.findOne(
      {col: this.props.col, row: this.props.row}
    );
  },

  propTypes: {
    // cell: React.PropTypes.object.isRequired
  },

  calculate (text) {
    // Try to run the cell as a js expression, and call it if
    // it evaluates to a function.

    let result = text || this.data.text || "";

    // Exit if cell is empty
    if (result.trim() === "") return EMPTY_CELL;

    // These expressions cause infinite recursion
    const top = "top";
    const window = "window";

    // create cell() to reference cells in the spreadsheet
    const cell = (row, col) => {
      if (row===this.data.row && col === this.data.col){
        throw Meteor.Error("cell can't refer to itself.");
      }
      // Querying the cell data will link Tracker for reactive updates.
      // Limit to the result field to `result` to keep Tracker invalidations
      // from  reacting to formula changing.
      const cellData = Cells.findOne({row, col}, {fields: {'result':1}});
      return cellData && cellData.result;
    };

    try {
      // eval expression & replace result if no error
      result = eval(`(${result})`);
      try {
        // if expression evals to a function, call it
        result = typeof result === "function" ? result() : result;
      } catch (e) {
        // console.log("fn error")
      }
    } catch (e) {
      // console.log("eval error")
    }
    // if the cell is empty, put in a space so it formats correctly
    if (result === undefined ||
        result === null ||
        result === "") {
      result = EMPTY_CELL;
    }
    if (typeof result === "function" ) {
      // must be a function that threw an error, so let's display the text
      result = text || this.data.text;
    }
    this.updateResult(result);
    return result;
  },

  showFormula (event) {
    this.props.setSelection(this.data);
    event.stopPropagation();
  },

  updateFormula (text) {
    // move to method
    if (text !== this.data.text) {
      Cells.update(this.data._id, {$set: {text}});
      this.computation.invalidate();
    }
    this.props.clearSelection();
  },

  updateResult (result) {
    Cells.update(this.data._id, {$set: {result}});
  },

  componentWillMount () {
    this.computation = Tracker.autorun( (computation) => {
      this.calculate();
    });
  },

  componentWillUnmount () {
    this.computation.stop();
  },

  shouldComponentUpdate (nextProps, nextState) {
    return ! (
      this.props.selected === nextProps.selected &&
      this.state === nextState
    );
  },

  render() {
    // if (this.data.isInvalid) this.calculate();
    return this.props.selected
      ? <CellFormula
          text={this.data.text}
          updateFormula={this.updateFormula}
          clearSelection={this.props.clearSelection}
        />
      : <CellResult
          text={this.data.text}
          result={this.data.result || EMPTY_CELL}
          showFormula={this.showFormula}
        />;
  }
});
