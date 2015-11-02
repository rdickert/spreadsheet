Sheet = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    if (! Cells.findOne()){
      return {
        totalColumns: 20,
        totalRows: 20
      }
    }
    const totalRows =
      Cells.findOne({}, {sort: {row: -1}, limit: 1}).row + 1 || 0;
    const totalColumns =
      Cells.findOne({}, {sort: {col: -1}, limit: 1}).col + 1 || 0;
    return {
      totalColumns,
      totalRows
    };
  },
  propTypes: {
    // row: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      selectedCell: ""
    };
  },

  setSelection (cell) {
    const key = `cell (${cell.col}, ${cell.row})`;
    this.setState({selectedCell: key});
  },

  clearSelection () {
    this.setState({selectedCell: ""});
  },

  renderColumnHeads() {
    // generate numbered column heads
    return (Array.from({length: this.data.totalColumns})
      .map((x, columnNumber) => {
        return (
          <div
            className="cell header"
            key={`col-${columnNumber}`} >
              Column {columnNumber}
          </div>
        );
      }));
  },

  renderCells(row) {
    // console.log(row)
    return Array.from({length: this.data.totalColumns}).map((x, col) => {
      // const coordinates = {col, row};
      const key = `cell (${col}, ${row})`;
      return (
        <Cell
          key={key}
          row={row}
          col={col}
          selected={this.state.selectedCell === key}
          setSelection={this.setSelection}
          clearSelection={this.clearSelection} />
      );
    });
  },


  renderRows() {
    return (Array.from({length: this.data.totalRows}).map((x, rowNumber) => {
      return (
        <div className="row" key={`row-${rowNumber}`}>
          <div className="cell header" key={`rowHeadFor-${rowNumber}`}>
            Row {rowNumber}
          </div>
          {this.renderCells(rowNumber)}
        </div>
      );
    }));
  },

  render() {
    return (
      <div className="Spreadsheet">
        <div className="row header">
          <div className="cell header" ref="originCell">&nbsp;</div>
          {this.renderColumnHeads()}
        </div>
        {this.renderRows()}
      </div>
    );
  }
});
