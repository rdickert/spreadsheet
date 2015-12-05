CellFormula = React.createClass({
  getInitialState () {
    return {
      cellFormula: this.props.formula
    };
  },

  handleCellInput () {
    const text = this.formulaInput.value;
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
    const text = this.formulaInput.value.trim();
    this.props.updateFormula(text);
  },

  componentDidMount () {
    this.formulaInput.select();
  },

  render() {
    return (
      <span className="cell selected" onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          className="textInput"
          ref={(c) => this.formulaInput = c}
          value={this.state.cellFormula}
          onChange={this.handleCellInput}
          onBlur={this.submitFormula}
          onKeyUp={this.handleInputKeyUp}
          />
      </span>
    );
  }
});
