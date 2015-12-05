// XXX probably belongs in a Sheets collection.
const columns = 10;
const rows = 10;

const expandCells = function (columns, rows, sortedCells) {
  // Expand a sparse array of cells into a columns x rows grid,
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

  render() {
    return (
      <div className="spreadsheet">

        {/* Render column headers */}
        <div className="row header">
          <div className="cell header" ref="originCell">
            {/* This is the "cell" at the upper left of the grid */}
            {/* XXX probably remove this stat later */}
            {this.data.cells.length} saved cells
          </div>
          {R.range(0, columns).map((col) => {
              return (
                <div
                  className="cell header"
                  key={`col-${col}`} >
                    Column {col}
                </div>
              );
            })
          }
        </div>

        {/* Render rows */}
        {expandCells(columns, rows, this.data.cells)
          .map((row, rowIndex) => {
            return (
              <div className="row" key={`row-${rowIndex}`}>
                <div className="cell header" key={`rowHeadFor-${row}`}>
                  Row {rowIndex}
                </div>

                {/* Render cells for this row */}
                {row.map((cell) => {
                  const key = `cell (${cell.col}, ${cell.row})`;
                  return (
                    <Cell
                      key={key}
                      cell={cell}
                      selected={this.state.selectedCell === key}
                      setSelection={this.setSelection}
                      clearSelection={this.clearSelection} />
                  );
                })}

              </div> // .row
            );
          })
        }

      </div> // .spreadsheet
    );
  }
});
