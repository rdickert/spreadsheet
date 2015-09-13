/*global App:true*/

App = React.createClass({
  mixins: [ReactMeteorData],

  getInitialState() {
    return {
      selectedCell: ""
    };
  },

  getMeteorData() {
    const totalRows = Cells.findOne() &&
      Cells.findOne({}, {sort: {row: -1}, limit: 1}).row + 1 || 0;
    const maxColumns = Cells.findOne() &&
      Cells.findOne({}, {sort: {col: -1}, limit: 1}).col + 1 || 0;
    const getRow = (rowNumber) => Cells.find({row: rowNumber}).fetch();
    const rows = () => {
      let result = [];
      for (let rowNumber = 0; rowNumber < totalRows; rowNumber++) {
        result.push({
          row: getRow(rowNumber),
          rowNumber
        });
      }
      return result;
    };

    return {
      rows: rows(),
      maxColumns
    };
  },

  setSelection (id) {
    this.setState({selectedCell: id});
  },

  clearSelection () {
    this.setState({selectedCell: ""});
  },

  renderColumnHeads() {
    return (Array.from({length: this.data.maxColumns}).map((x, i) => {
      return <div className="cell header">Column {i}</div>;
    }));
  },

  renderRows() {
    // Get tasks from this.data.tasks
    return this.data.rows.map(({row, rowNumber}) => {
      return <Row
        key={"Row " + rowNumber}
        row={row}
        rowNumber={rowNumber}
        currentSelection={this.state.selectedCell}
        setSelection={this.setSelection} />;
    });
  },

  render() {
    return (
      <div className="container" onClick={this.clearSelection}>
        <header>
          <h1>Spreadsheet</h1>
        </header>
        <div className="Spreadsheet">
          <div className="row header">
            <div className="cell header">&nbsp;</div>
            {this.renderColumnHeads()}
          </div>
          {this.renderRows()}
        </div>
      </div>
    );
  }

});