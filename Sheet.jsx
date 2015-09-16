Sheet = React.createClass({
  mixins: [ReactMeteorData],

  getMeteorData() {
    const totalRows =
      Cells.findOne({}, {sort: {row: -1}, limit: 1}).row + 1 || 0;
    const maxColumns =
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
  propTypes: {
    // row: React.PropTypes.array.isRequired
  },

  getInitialState() {
    return {
      selectedCell: ""
    };
  },

  setSelection (id) {
    this.setState({selectedCell: id});
  },

  clearSelection () {
    this.setState({selectedCell: ""});
  },

  renderColumnHeads() {
    // generate numbered column heads
    return (Array.from({length: this.data.maxColumns}).map((x, i) => {
      return <div className="cell header" key={`Col ${i}`}>Column {i}</div>;
    }));
  },


  renderCells (row) {
    // console.log(row)
    return row.map((cell) =>
        <Cell
          key={cell._id}
          id={cell._id}
          row={cell.row}
          col={cell.col}
          text={cell.text}
          selected={this.state.selectedCell === cell._id}
          setSelection={this.setSelection} />
    );
  },


  renderRows() {
    return this.data.rows.map(({row, rowNumber}) => {
      return (
        <div className="row">
          <div className="cell header" ref={`Row ${rowNumber}`}>
            Row {rowNumber}
          </div>
          {this.renderCells(row)}
        </div>
      );
    });
  },

  render() {
    return (
      <div className="Spreadsheet">
        <div className="row header">
          <div className="cell header" ref="origin cell">&nbsp;</div>
          {this.renderColumnHeads()}
        </div>
        {this.renderRows()}
      </div>
    );
  }
});
