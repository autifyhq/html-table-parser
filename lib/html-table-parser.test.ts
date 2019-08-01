import { parseTable } from "./html-table-parser"

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
        { elementId: 0, tagName: "TH", textContent: "th 1", attributes: {} },
        { elementId: 1, tagName: "TH", textContent: "th 2", attributes: {} }
      ],
      [
        { elementId: 2, tagName: "TD", textContent: "td 1", attributes: {} },
        { elementId: 3, tagName: "TD", textContent: "td 2", attributes: {} }
      ]
    ]
  },
  {
    name: "can parse table with multiple tbodies",
    html: `
    <thead>
      <tr><th>th 1</th><th>th 2</th></tr>
    </thead>
    <tbody>
      <tr><td>td 1</td><td>td 2</td></tr>
    </tbody>
    <tbody>
      <tr><td>td 3</td><td>td 4</td></tr>
    </tbody>
    `,
    expected: [
      [
        { elementId: 0, tagName: "TH", textContent: "th 1", attributes: {} },
        { elementId: 1, tagName: "TH", textContent: "th 2", attributes: {} }
      ],
      [
        { elementId: 2, tagName: "TD", textContent: "td 1", attributes: {} },
        { elementId: 3, tagName: "TD", textContent: "td 2", attributes: {} }
      ],
      [
        { elementId: 4, tagName: "TD", textContent: "td 3", attributes: {} },
        { elementId: 5, tagName: "TD", textContent: "td 4", attributes: {} }
      ]
    ]
  },
  {
    name: "can parse nested table",
    html: `
    <thead>
      <tr><th>th 1</th><th>th 2</th></tr>
    </thead>
    <tbody>
      <tr><td>td 1</td><td>td 2<table><tbody><tr><td>foo</td></tr></tbody></table></td></tr>
    </tbody>
    `,
    expected: [
      [
        { elementId: 0, tagName: "TH", textContent: "th 1", attributes: {} },
        { elementId: 1, tagName: "TH", textContent: "th 2", attributes: {} }
      ],
      [
        { elementId: 2, tagName: "TD", textContent: "td 1", attributes: {} },
        { elementId: 3, tagName: "TD", textContent: "td 2foo", attributes: {} }
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
          attributes: { colspan: "2" }
        },
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          attributes: { colspan: "2" }
        },
        { elementId: 1, tagName: "TD", textContent: "td 2", attributes: {} }
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
          attributes: { rowspan: "2" }
        },
        { elementId: 1, tagName: "TD", textContent: "td 2", attributes: {} }
      ],
      [
        {
          elementId: 0,
          tagName: "TD",
          textContent: "td 1",
          attributes: { rowspan: "2" }
        },
        { elementId: 2, tagName: "TD", textContent: "td 3", attributes: {} }
      ]
    ]
  }
]

describe("parseTable", () => {
  cases.forEach(testCase => {
    it(testCase.name, () => {
      const table = document.createElement("table")
      table.innerHTML = testCase.html

      expect(parseTable(table)).toStrictEqual(testCase.expected)
    })
  })
})
