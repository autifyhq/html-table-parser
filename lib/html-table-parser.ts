type RowElement = HTMLTableRowElement
type CellElement = HTMLTableHeaderCellElement | HTMLTableCellElement

export type CellAdditionalAttributes = {
  elementId: number
  left: number
  top: number
  right: number
  bottom: number
}

export type CellInfo = {
  tagName: string
  textContent: string | null
  attributes: Record<string, string>
} & CellAdditionalAttributes

export function parseTable(tableElement: HTMLTableElement): CellInfo[][] {
  return parseCellMatrix(createCellMatrix(tableElement))
}

export function parseCellMatrix(cellMatrix: CellElement[][]): CellInfo[][] {
  const elementList: CellElement[] = []
  const parsedInfoList: CellInfo[] = []

  return cellMatrix.map((row, rowIndex) =>
    row.map((cell, colIndex) => {
      let index = elementList.indexOf(cell)
      if (index === -1) {
        index = elementList.length
        elementList.push(cell)
        parsedInfoList.push(
          parceCell(cell, {
            elementId: index,
            left: colIndex,
            top: rowIndex,
            right: colIndex,
            bottom: rowIndex,
          })
        )
      } else {
        parsedInfoList[index].right = colIndex
        parsedInfoList[index].bottom = rowIndex
      }

      return parsedInfoList[index]
    })
  )
}

export function getElementPositionInCellMatrix(
  cellMatrix: CellElement[][],
  cellElement: CellElement
): { x: number; y: number } | null {
  for (let y = 0; y < cellMatrix.length; y++) {
    const row = cellMatrix[y]
    for (let x = 0; x < row.length; x++) {
      if (row[x] === cellElement) {
        return { x, y }
      }
    }
  }

  return null
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
export function createCellMatrix(
  tableElement: HTMLTableElement
): CellElement[][] {
  const rows = [tableElement.tHead]
    .concat(Array.from(tableElement.tBodies))
    .concat(tableElement.tFoot)
    .reduce((rows, sections) => {
      return sections ? rows.concat(Array.from(sections.rows)) : rows
    }, [] as RowElement[])

  // Create array of empty arrays ([[], [], ..., []])
  const cellMatrix: CellElement[][] = Array(rows.length)
    .fill(null)
    .map(() => [])

  rows.forEach((row, rowIndex) => {
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

function parceCell(
  cell: CellElement,
  additionalAttributes: CellAdditionalAttributes
): CellInfo {
  const attributes = Array.from(cell.attributes).reduce((result, attr) => {
    result[attr.name] = attr.value
    return result
  }, {} as Record<string, string>)
  return Object.assign(
    {
      tagName: cell.tagName,
      textContent: cell.textContent,
      attributes,
    },
    additionalAttributes
  )
}
