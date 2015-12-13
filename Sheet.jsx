// XXX probably belongs in a Sheets collection.
const columns = 10;
const rows = 10;

const expandToRows = function (columns, rows, sortedCells) {
  // Expand a sparse array of cells into a (columns x rows) grid,
  // adding empty cells to fill in the gaps.
  // Cells must be sorted by row then column. This allows
  // us to insert the sparse data in one pass.

  const cellList = sortedCells[Symbol.iterator]();
  let nextCell = cellList.next().value;

  const getCell = R.curry((row, col) => {
    let currentCell = nextCell;
    if (currentCell && currentCell.row === row && currentCell.col === col) {
      nextCell = cellList.next().value;
      return currentCell;
    }
    // else return an empty cell
    return {col, row};
  });

  const expandRow = (row) => R.range(0, columns).map(getCell(row));

  return R.range(0, rows).map(expandRow);
};

OriginCell = ({cellCount}) => (
  // This is the cell at the upper left of the grid
  // XXX probably remove cellCount stat later
  <div className="cell head">
    {cellCount} saved cells
  </div>
);

ColumnHeadCell = ({col}) => (
  <div className="cell head" >
    Column {col}
  </div>
);

RowHeadCell = ({rowNumber}) => (
  <div className="cell head">
    Row {rowNumber}
  </div>
);

HeaderRow = ({columns, cells}) => (
  <div className="row head">
    <OriginCell key="origin cell" cellCount={cells.length} />

    {R.range(0, columns)
      .map((col) => <ColumnHeadCell key={`column-${col}`} col={col} />)
    }
  </div>
);

Sheet = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      cells: Cells.find({}, {sort: {row: 1, col: 1}}).fetch()
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

  renderCell (cell) {
    const key = `cell (${cell.col}, ${cell.row})`;
    return (
      <Cell
        key={key}
        cell={cell}
        selected={this.state.selectedCell === key}
        setSelection={this.setSelection}
        clearSelection={this.clearSelection} />
    );
  },

  renderRow (cells, rowNumber) {
    return (
      <div className="row" key={`row-${rowNumber}`}>

        <RowHeadCell
          key={`rowHeadFor-${rowNumber}`}
          rowNumber={rowNumber} />

        {cells.map(this.renderCell)}

      </div> // .row
    );
  },

  render () {
    return (
      <div className="spreadsheet">

        <HeaderRow
          columns={columns}
          cells={this.data.cells} />

        {expandToRows(columns, rows, this.data.cells).map(this.renderRow)}

      </div>
    );
  }
});
