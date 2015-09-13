Cell = React.createClass({
  propTypes: {
    cell: React.PropTypes.object.isRequired
  },

  getInitialState () {
    return {
      cellText: this.props.cell.text
    };
  },

  evalCell (text) {
    // These expressions cause infinite recursion
    const top = "top";
    const window = "window";

    // create cell() to reference cells in the spreadsheet
    const cell = (row, col) => {
      const cellData = Cells.findOne({row, col});
      return cellData && this.evalCell(cellData.text);
    };

    // by default, set result as regular text
    let result = text || this.props.cell.text;
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
      result = <span>&nbsp;</span>;
    }
    if (typeof result === "function" ) {
      // function must have thrown an error, so let's display the text
      result = text || this.props.cell.text;
    }
    return result;
  },

  setSelection (event) {
    this.props.setSelection(this.props.cell._id);
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
      default:
        break;
    }
  },

  updateCellText () {
    const text = React.findDOMNode(this.refs.textInput).value.trim();
    Cells.update(this.props.cell._id, {$set: {text: text.trim()}});
    this.props.setSelection("");
  },

  componentDidUpdate () {
    this.refs.textInput &&
      React.findDOMNode(this.refs.textInput).focus();
  },

  renderOutput () {
    return (
      <span className="cell" onClick={this.setSelection}>
        {this.evalCell()}
      </span>
    );
  },

  renderInput () {
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
    return this.props.selected ? this.renderInput() : this.renderOutput();
  }
});
