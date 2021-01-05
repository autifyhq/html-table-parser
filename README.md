# html-table-parser
table to json by :checkered_flag: [@moriyak]

## Installation

```
npm install html-table-parser
```

## Usage

```js
import { parseTable } from "html-table-parser"

// Table element look like this:
// <table>
//   <thead>
//     <tr><th>th 1</th><th>th 2</th></tr>
//   </thead>
//   <tbody>
//     <tr><td>td 1</td><td>td 2</td></tr>
//   </tbody>
// </table>

const parsed = parseTable(table)

// `parsed` will be:
// [
//   [
//     {
//       elementId: 0,
//       tagName: "TH",
//       textContent: "th 1",
//       left: 0,
//       top: 0,
//       right: 0,
//       bottom: 0,
//       attributes: {}
//     },
//     {
//       elementId: 1,
//       tagName: "TH",
//       textContent: "th 2",
//       left: 1,
//       top: 0,
//       right: 1,
//       bottom: 0,
//       attributes: {}
//     }
//   ],
//   [
//     {
//       elementId: 2,
//       tagName: "TD",
//       textContent: "td 1",
//       left: 0,
//       top: 1,
//       right: 0,
//       bottom: 1,
//       attributes: {}
//     },
//     {
//       elementId: 3,
//       tagName: "TD",
//       textContent: "td 2",
//       left: 1,
//       top: 1,
//       right: 1,
//       bottom: 1,
//       attributes: {}
//     }
//   ]
// ]
```

See more example at https://github.com/autifyhq/html-table-parser/blob/master/lib/html-table-parser.test.ts
