type RowElement = HTMLTableRowElement
type CellElement = HTMLTableHeaderCellElement | HTMLTableCellElement

export function parseTable(tableElement: HTMLTableElement) {
  let elementList = []

  return createCellMatrix(tableElement).map(row =>
    row.map(cell => {
      let index = elementList.indexOf(cell)
      if (index === -1) {
        index = elementList.length
        elementList.push(cell)
      }
      return parceCell(cell, {
        elementId: index
      })
    })
  )
}

/*
Normalize table structure considering colspan and rowspan.
+---------------+
|       A       |
+-------+-------+
|       |   C   | => [[A, A], [B, C], [B, D]]
|   B   +-------+
|       |   D   |
+-------+-------+
*/
function createCellMatrix(tableElement: HTMLTableElement) {
  const rows = [tableElement.tHead]
    .concat(Array.from(tableElement.tBodies))
    .concat(tableElement.tFoot)
    .reduce((rows, sections) => {
      return sections ? rows.concat(Array.from(sections.rows)) : rows
    }, [])

  // Create array of empty arrays ([[], [], ..., []])
  let cellMatrix = Array(rows.length)
    .fill(null)
    .map(() => [])

  rows.forEach((row: RowElement, rowIndex) => {
    // Fill matrix
    let colOffset = 0

    Array.from(row.cells)
      .reduce((results: CellElement[], cell: CellElement) => {
        const colspan = cell.colSpan || 1
        for (let i = 0; i < colspan; i++) {
          results.push(cell)
        }
        return results
      }, [])
      .forEach((cell, cellIndex) => {
        const rowspan = cell.rowSpan || 1

        while (cellMatrix[rowIndex][cellIndex + colOffset]) {
          colOffset += 1
        }

        for (let rowOffset = 0; rowOffset < rowspan; rowOffset++) {
          cellMatrix[rowIndex + rowOffset][cellIndex + colOffset] = cell
        }
      })
  })

  return cellMatrix
}

function parceCell(cell: CellElement, additionalAttributes: object = {}) {
  const attributes = Array.from(cell.attributes).reduce((result, attr) => {
    result[attr.name] = attr.value
    return result
  }, {})
  return Object.assign(
    {
      tagName: cell.tagName,
      textContent: cell.textContent,
      attributes
    },
    additionalAttributes
  )
}
