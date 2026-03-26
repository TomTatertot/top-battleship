function createPlayerBoard(size) {
  const table = document.createElement("table");
  const header = document.createElement("thead");
  const body = document.createElement("tbody");
  const headerRow = document.createElement("tr");

  for (let i = 0; i <= size; i++) {
    const headerLetter = `${String.fromCharCode(64 + i)}`;
    const columnHeader = document.createElement("th");
    columnHeader.scope = "col";
    if (i > 0) {
      columnHeader.textContent = headerLetter;
    }

    console.log(columnHeader);
    headerRow.append(columnHeader);
  }
  console.log(headerRow);

  for (let i = 0; i < size; i++) {
    const row = document.createElement("tr");
    const rowHeader = document.createElement("th");
    rowHeader.scope = "row";
    rowHeader.textContent = `${i}`;
    row.append(rowHeader);
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("td");
      cell.dataset.dataY = i;
      cell.dataset.dataJ = j;
      row.append(cell);
    }
    body.append(row);
  }

  header.append(headerRow);
  table.append(header, body);
  return table;
}

export { createPlayerBoard };
