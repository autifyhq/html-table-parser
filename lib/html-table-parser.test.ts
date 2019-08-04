import {
  parseTable,
  getElementPositionInCellMatrix,
  createCellMatrix
} from "./html-table-parser"

const cases = [
  {
    name: "can parse simple clean table",
    html: `
    <thead>
      <tr><th>th 1</th><th>th 2</th></tr>
    </thead>
    <tbody>
      <tr><td>td 1</td><td>td 2</td></tr>
    </tbody>
  `,
    expected: [
      [
        {
          elementId: 0,
          tagName: "TH",
          textContent: "th 1",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          attributes: {}
        },
        {
          elementId: 1,
          tagName: "TH",
          textContent: "th 2",
          left: 1,
          top: 0,
          right: 1,
          bottom: 0,
          attributes: {}
        }
      ],
      [
        {
          elementId: 2,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 1,
          right: 0,
          bottom: 1,
          attributes: {}
        },
        {
          elementId: 3,
          tagName: "TD",
          textContent: "td 2",
          left: 1,
          top: 1,
          right: 1,
          bottom: 1,
          attributes: {}
        }
      ]
    ]
  },
  {
    name: "can parse table with multiple tbodies",
    html: `
    <thead>
      <tr><th>th 1</th></tr>
    </thead>
    <tbody>
      <tr><td>td 1</td></tr>
    </tbody>
    <tbody>
    <tr><td>td 2</td></tr>
    </tbody>
    <tfoot>
    <tr><td>td 3</td></tr>
    </tfoot>
    `,
    expected: [
      [
        {
          elementId: 0,
          tagName: "TH",
          textContent: "th 1",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          attributes: {}
        }
      ],
      [
        {
          elementId: 1,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 1,
          right: 0,
          bottom: 1,
          attributes: {}
        }
      ],
      [
        {
          elementId: 2,
          tagName: "TD",
          textContent: "td 2",
          left: 0,
          top: 2,
          right: 0,
          bottom: 2,
          attributes: {}
        }
      ],
      [
        {
          elementId: 3,
          tagName: "TD",
          textContent: "td 3",
          left: 0,
          top: 3,
          right: 0,
          bottom: 3,
          attributes: {}
        }
      ]
    ]
  },
  {
    name: "can parse nested table",
    html: `
    <thead>
      <tr><th>th 1</th></tr>
    </thead>
    <tbody>
      <tr><td>td 1<table><tbody><tr><td>foo</td></tr></tbody></table></td></tr>
    </tbody>
    `,
    expected: [
      [
        {
          elementId: 0,
          tagName: "TH",
          textContent: "th 1",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          attributes: {}
        }
      ],
      [
        {
          elementId: 1,
          tagName: "TD",
          textContent: "td 1foo",
          left: 0,
          top: 1,
          right: 0,
          bottom: 1,
          attributes: {}
        }
      ]
    ]
  },
  {
    name: "can parse table with colspan",
    html: `
    <tr><td colspan="2">td 1</td><td>td 2</td></tr>
    `,
    expected: [
      [
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 0,
          right: 1,
          bottom: 0,
          attributes: { colspan: "2" }
        },
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 0,
          right: 1,
          bottom: 0,
          attributes: { colspan: "2" }
        },
        {
          elementId: 1,
          tagName: "TD",
          textContent: "td 2",
          left: 2,
          top: 0,
          right: 2,
          bottom: 0,
          attributes: {}
        }
      ]
    ]
  },
  {
    name: "can parse table with rowpan",
    html: `
    <tr><td rowspan="2">td 1</td><td>td 2</td></tr>
    <tr><td>td 3</td></tr>
    `,
    expected: [
      [
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 0,
          right: 0,
          bottom: 1,
          attributes: { rowspan: "2" }
        },
        {
          elementId: 1,
          tagName: "TD",
          textContent: "td 2",
          left: 1,
          top: 0,
          right: 1,
          bottom: 0,
          attributes: {}
        }
      ],
      [
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          left: 0,
          top: 0,
          right: 0,
          bottom: 1,
          attributes: { rowspan: "2" }
        },
        {
          elementId: 2,
          tagName: "TD",
          textContent: "td 3",
          left: 1,
          top: 1,
          right: 1,
          bottom: 1,
          attributes: {}
        }
      ]
    ]
  }
]

describe("parseTable", () => {
  cases.forEach(testCase => {
    it(testCase.name, () => {
      const table = createTable(testCase.html)
      expect(parseTable(table)).toStrictEqual(testCase.expected)
    })
  })
})

describe("getElementPositionInTable", () => {
  it("return x and y in matrix", () => {
    const table = createTable(`
    <tr><td>1</td><td>2</tr>
    <tr><td>3</td><td>4</tr>
    `)
    const cell = table.querySelectorAll("td")[3]
    const matrix = createCellMatrix(table)
    expect(getElementPositionInCellMatrix(matrix, cell)).toStrictEqual({
      x: 1,
      y: 1
    })
  })
})

function createTable(innerHTML: string) {
  const table = document.createElement("table")
  table.innerHTML = innerHTML
  return table
}
