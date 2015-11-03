// The sheet scaffolds all the cells and manages cell selection state,
// but is otherwise ignorant of cell-level goings-on

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
      Cells.findOne({}, {sort: {row: -1}, limit: 1}).row + 1;
    const totalColumns =
      Cells.findOne({}, {sort: {col: -1}, limit: 1}).col + 1;
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
      .map((x, col) => {
        return (
          <div
            className="cell header"
            key={`col-${col}`} >
              Column {col}
          </div>
        );
      }));
  },

  renderCells(row) {
    // console.log(row)
    return Array.from({length: this.data.totalColumns})
      .map((x, col) => {
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
    return (Array.from({length: this.data.totalRows})
      .map((x, row) => {
        return (
          <div className="row" key={`row-${row}`}>
            <div className="cell header" key={`rowHeadFor-${row}`}>
              Row {row}
            </div>
            {this.renderCells(row)}
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
