// The cell is responsible for its own data and communicates directly
// with minimongo. All Tracker-based reactivity is housed here.
// We let minimongo drive cell recalculations by caching cell
// calculations in the `results` field and querying them in an
// autorun (one per cell) which allows arbitrary relationships between
// cells as specified in user cell code.

// User code is eval'd. This a risk to the user if they trust someone
// else's code, and the user can probably break the app. On the other
// hand, the JS environment and syntax is all there for free. This
// seems like a great place to try a membrane with ES2015's proxy.

Cell = React.createClass({

  propTypes: {
    // cell: React.PropTypes.object.isRequired
  },

  calculate (text) {
    // Try to run the cell as a js expression, and call it if
    // it evaluates to a function.

    let result = text || this.props.cell.text || "";

    // Exit if cell is empty
    if (result.trim() === "") {
      this.updateResult(null);
      return;
    }

    // These expressions cause infinite recursion
    const top = "top";
    const window = "window";

    // create cell() to reference cells in the spreadsheet
    const cell = (col, row) => {
      if (row===this.props.cell.row && col === this.props.cell.col){
        throw Meteor.Error("cell can't refer to itself.");
      }
      // Querying the cell data will link Tracker for reactive updates.
      // Limit to the result field to `result` to keep Tracker invalidations
      // from  reacting to formula changing.
      const cellData = Cells.findOne({row, col}, {fields: {"result": 1}});
      this.isReactive = true;
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
    if (typeof result === "function" ) {
      // must be a function that threw an error, so let's display the text
      result = text || this.props.cell.text;
    }
    this.updateResult(result, ! this.isReactive);
    return result;
  },

  showFormula (event) {
    this.props.setSelection(this.props.cell);
    event.stopPropagation();
  },

  updateFormula (text) {
    // XXX move to method
    text = text.trim();
    if (text !== this.props.cell.text) {
      if (this.props.cell._id){
        if (text) {
          Cells.update(this.props.cell._id, {$set: {text}});
          this.computation.invalidate();
        } else {
          Cells.remove(this.props.cell._id);
        }
      } else {
        let result;
        if (text) {
          // XXX autorun should move...to this.calculate()?
          this.computation = Tracker.autorun( () => {
            result = this.calculate(text);
          });
          Cells.insert({
            col: this.props.cell.col,
            row: this.props.cell.row,
            text: text,
            result: result,
            isNotReactive: ! this.isReactive
          });
        }
      }
    }
    this.props.clearSelection();
  },

  updateResult (result, isNotReactive) {
    // Don't update the result if it hasn't changed. Besides
    // being obvious, failure to do this creates a race condition
    // with the data mixin on load, especially refresh.
    if (result !== this.props.cell.result) {
      Cells.update(this.props.cell._id, {$set: {result, isNotReactive}});
    }
  },

  componentWillMount () {
    // isNotReactive memoizes when the formula doesn't contain any
    // reactive code - skip to execute faster.
    if (! this.isNotReactive) {
      this.computation = Tracker.autorun( () => {
        // avoid calculate if cell was previously eval'd & found no reactivity
        this.calculate();
      });
    }
  },

  componentWillUnmount () {
    this.computation && this.computation.stop();
  },

  shouldComponentUpdate (nextProps, nextState) {
    return ! (
      this.props.selected === nextProps.selected &&
      this.props.cell.result === nextProps.cell.result &&
      this.props.cell._id === nextProps.cell._id &&
      this.state === nextState
    );
  },

  render() {
    return this.props.selected
      ? <CellFormula
          text={this.props.cell.text}
          updateFormula={this.updateFormula}
          clearSelection={this.props.clearSelection}
        />
      : <CellResult
          result={this.props.cell.result}
          showFormula={this.showFormula}
        />;
  }
});
