// Tracker-based reactivity is run here.
// We let minimongo drive cell recalculations by caching cell
// calculations in the `results` field and querying them in an
// autorun (one per cell) which allows arbitrary relationships between
// cells as specified in user cell code.

// XXX NOT FOR PRODUCTION USE
// User code is `eval`ed. This a risk to the user if they trust someone
// else's code, and the user can probably break the app. On the other
// hand, the JS environment and syntax is all there for free. If we put
// functions in the closure with the eval (e.g. `cell()`), the user
// can access that in their formula, and minimongo queries via `cell()`
// or direclty in the cell formula will be reactive.

Cell = React.createClass({

  propTypes: {
    // cell: React.PropTypes.object.isRequired
  },

  calculate (formula) {
    // Try to run the cell as a js expression, and call it if
    // it evaluates to a function.

    let result = formula || this.props.cell.formula || "";

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
      // XXX manually setting isReactive is brittle. User formulas might
      // access reactive objects, but they wouldn't trigger this & might
      // have mixed reactive behavior (worse that non-reactive).
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
      // must be a function that threw an error, so let's display the formula
      // XXX 2nd order functions would display too. Maybe OK?
      result = formula || this.props.cell.formula;
    }
    this.updateResult(result, ! this.isReactive);
    return result;
  },

  showFormula (event) {
    this.props.setSelection(this.props.cell);
    event.stopPropagation();
  },

  updateFormula (formula) {
    // XXX refactor & move to method
    formula = formula.trim();
    if (formula !== this.props.cell.formula) {
      if (this.props.cell._id){
        console.log(this.props);
        if (formula) {
          let result
          this.computation.stop();
          this.computation = Tracker.autorun( () => {
            result = this.calculate(formula);
          });
          Cells.update(this.props.cell._id, {$set: {
            formula,
            result,
            isNotReactive: ! this.isReactive
          }});
        } else {
          Cells.remove(this.props.cell._id);
        }
      } else {
        let result;
        if (formula) {
          // XXX autorun should move...to this.calculate()?
          this.computation = Tracker.autorun( () => {
            result = this.calculate(formula);
          });
          Cells.insert({
            col: this.props.cell.col,
            row: this.props.cell.row,
            formula,
            result,
            isNotReactive: ! this.isReactive
          });
        }
      }
    }
    this.props.clearSelection();
  },

  updateResult (result, isNotReactive) {
    if (result !== this.props.cell.result) {
      Cells.update(this.props.cell._id, {$set: {result, isNotReactive}});
    }
  },

  componentWillMount () {
    // isNotReactive memoizes when the formula doesn't contain any
    // reactive code - no need to rerun it when we start the app.
    // XXX isNotReactive: premature optimization?
    if (! this.isNotReactive) {
      this.computation = Tracker.autorun( () => {
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
          formula={this.props.cell.formula}
          updateFormula={this.updateFormula}
          clearSelection={this.props.clearSelection}
        />
      : <CellResult
          result={this.props.cell.result}
          showFormula={this.showFormula}
        />;
  }
});
