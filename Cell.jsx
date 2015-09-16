Cell = React.createClass({
  propTypes: {
    // cell: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      cellText: this.props.text
    };
  },

  evalCell (text) {
    // Try to run the cell as a js expression, and call it if
    // it evaluates to a function.

    // by default, set result as regular text
    let result = text || this.props.text;

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

  setSelection (event) {
    this.props.setSelection(this.props.id);
    event.stopPropagation();
  },

  handleCellInput () {
    const text = React.findDOMNode(this.refs.textInput).value;
    this.setState({cellText: text});
  },

  handleInputKeyUp (event) {
    switch (event.which) {
      case 13:
        this.updateCellText();
        break;
      case 27:
        this.setState({cellText: this.props.text});
        this.props.setSelection("");
        break;
      default:
        break;
    }
  },

  updateCellText () {
    const text = React.findDOMNode(this.refs.textInput).value.trim();
    Cells.update(this.props.id, {$set: {text: text.trim()}});
    this.props.setSelection("");
  },

  componentDidUpdate () {
    this.refs.textInput &&
      React.findDOMNode(this.refs.textInput).focus();
  },

  shouldComponentUpdate (nextProps, nextState) {
    // console.log(this.props.selected, nextProps.selected);
    // console.log(this.props.selected)
    return (
         (this.props.selected !== nextProps.selected)
      || (this.props.text !== nextProps.text)
      || (this.state.cellText !== nextState.cellText)
    );
  },


  renderResult () {
    return (
      <span className="cell" onClick={this.setSelection}>
        {this.evalCell()}
      </span>
    );
  },

  renderFormula () {
    let cellText = this.state.cellText;
    return (
      <span className="cell selected" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="textInput"
          ref="textInput"
          value={cellText}
          onChange={this.handleCellInput}
          onBlur={this.updateCellText}
          onKeyUp={this.handleInputKeyUp}
          />
      </span>
    );
  },

  render() {
    return this.props.selected ? this.renderFormula() : this.renderResult();
  }
});
