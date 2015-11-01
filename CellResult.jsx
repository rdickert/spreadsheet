CellResult = React.createClass({
  evalCell (text) {
    // Try to run the cell as a js expression, and call it if
    // it evaluates to a function.

    let result = text || this.props.text || "";

    // Exit if cell is empty
    const EMPTY_CELL = <span>&nbsp;</span>;
    if (result.trim() === "") return EMPTY_CELL;

    // These expressions cause infinite recursion
    const top = "top";
    const window = "window";

    // create cell() to reference cells in the spreadsheet
    const cell = (row, col) => {
      const cellData = Cells.findOne({row, col});
      return cellData && this.evalCell(cellData.text);
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
      // function must have thrown an error, so let's display the text
      result = text || this.props.text;
    }
    return result;
  },

  render () {
    return (
      <span className="cell" onClick={this.props.showFormula}>
        {this.evalCell()}
      </span>
    );
  }
});
