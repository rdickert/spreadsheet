CellFormula = React.createClass({
  getInitialState () {
    return {
      cellText: this.props.text
    };
  },

  handleCellInput () {
    const text = React.findDOMNode(this.refs.textInput).value;
    this.setState({cellText: text});
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
    const text = React.findDOMNode(this.refs.textInput).value.trim();
    this.props.updateFormula(text);
  },

  componentDidMount () {
    this.refs.textInput &&
      React.findDOMNode(this.refs.textInput).focus();
      // XXX need to get cursor to place correctly ($.setSelection?())
  },

  render() {
    return (
      <span className="cell selected" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="textInput"
          ref="textInput"
          value={this.state.cellText}
          onChange={this.handleCellInput}
          onBlur={this.submitFormula}
          onKeyUp={this.handleInputKeyUp}
          />
      </span>
    );
  }
});
