# Spreadsheet

This is a simplistic spreadsheet I used to teach myself the basics of React (and a bit of Ramda) and how it works within Meteor. It uses,`eval` so there are security issues that would need to be addressed before it could be used for anything real. The advantage of using `eval`, though, is that you get all the functionality of JavaScript for free. 

Every cell is evaluated as a Javacript expression, and if that expression returns a function, that function gets called. If a cell does not evaluate as valid JS, it's printed as-is in the cell - a simple way to add text cells without adding cell types. `cell(col, row)` is provided to refer to the output of other cells, which are numbered both for rows and columns (starting with zero – this is JavaScript!). So `cell(0, 0)` is like `A1` in Excel, and `cell (1, 3)` is `B4`.

## Points of interest
Cell reactivity is provided with Tracker and Minimongo. It already has a few optimizations to reduce unnecessary recalculations: Cell formula results are cached, and cells also save an `isNotReactive` property to cache the reactivity status (why calculate `"Total"` or `8`?).

It uses a sparse data model that renders blank cells as needed using some functional code.

## Next steps
There are many, if this were to turn into anything real. A few of note: 

* Add users/remove insecure
* Allow multiple sheets
* Add a real selection function, with the ability to select multiple cells (right now, click toggles formula/result)
* Allow cell types (now, all are JS – text is just anything that throws an error when `eval`ed)
* Render more interesting cell contents. What if you could have web content (say a D3 chart or a youtube video) as a cell?
* Add any of an infinite number of additional features a real speadsheet would have.

