CellFormula = React.createClass({
  getInitialState () {
    return {
      cellFormula: this.props.formula
    };
  },

  handleCellInput () {
    const text = ReactDOM.findDOMNode(this.refs.textInput).value;
    this.setState({cellFormula: text});
  },

  handleInputKeyUp (event) {
    switch (event.which) {
      case 13:
        this.submitFormula();
        break;
      case 27:
        this.props.clearSelection();
        break;
      default:
        break;
    }
  },

  submitFormula () {
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    this.props.updateFormula(text);
  },

  componentDidMount () {
    this.refs.textInput &&
      ReactDOM.findDOMNode(this.refs.textInput).focus();
      // XXX need to get cursor to place correctly ($.setSelection?())
  },

  render() {
    return (
      <span className="cell selected" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="textInput"
          ref="textInput"
          value={this.state.cellFormula}
          onChange={this.handleCellInput}
          onBlur={this.submitFormula}
          onKeyUp={this.handleInputKeyUp}
          />
      </span>
    );
  }
});
