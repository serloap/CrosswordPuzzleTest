/** Returns all the strings available in the puzzle (columns, rows and diagonals)
 * for diagonals it also returns the start position of the string (x and y)
 */
export const getSearchStrings = (mappedMatrix, rows, columns) => {
  const maxWordSize = Math.min(rows, columns);

  const rowsAsStrings = mappedMatrix.map((row) =>
    row.reduce((word, cell) => word + cell, "")
  );
  const columnsAsStrings = [...new Array(columns)].map((__, columnIndex) =>
    mappedMatrix.reduce((word, row) => word + row[columnIndex], "")
  );

  /* Using FORs for diagonals because they're easier to read (in this specific case) */

  // Find complete diagonals, from top to bottom, left to right.
  const diagonalsTBAsStrings = [];

  // From left to right, starting from the first row, ignore last "alone" cell.
  for (let j = 0; j < columns - 1; j += 1) {
    let word = "";

    for (let i = 0; i < maxWordSize; i += 1) {
      const row = mappedMatrix[i];

      if (!row) break;

      word += row[i + j] || "";
    }

    diagonalsTBAsStrings.push({ word, x: j, y: 0 });
  }

  // From top to bottom, starting from the first column,
  // ignore first diagonal that's already added and last "alone" cell.
  for (let i = 1; i < rows - 1; i += 1) {
    let word = "";

    for (let j = 0; j < maxWordSize; j += 1) {
      const row = mappedMatrix[i + j];

      if (!row) break;

      word += row[j] || "";
    }

    diagonalsTBAsStrings.push({ word, x: 0, y: i });
  }

  // Find complete diagonals, from bottom to top, left to right.
  const diagonalsBTAsStrings = [];

  // From left to right, starting from last row, ignore last "alone" cell.
  for (let j = 0; j < columns - 1; j += 1) {
    let word = "";

    for (let i = 0; i < maxWordSize; i += 1) {
      const row = mappedMatrix[rows - 1 - i];

      if (!row) break;

      word += row[i + j] || "";
    }

    diagonalsBTAsStrings.push({ word, x: j, y: rows - 1 });
  }

  // From bottom to top, starting from the last column,
  // ignore first diagonal that's already added and last "alone" cell.
  for (let i = rows - 2; i > 0; i -= 1) {
    let word = "";

    for (let j = 0; j < maxWordSize; j += 1) {
      const row = mappedMatrix[i - j];

      if (!row) break;

      word += row[j] || "";
    }

    diagonalsBTAsStrings.push({ word, x: 0, y: i });
  }

  return {
    rowsAsStrings,
    columnsAsStrings,
    diagonalsTBAsStrings,
    diagonalsBTAsStrings
  };
};

export const getResults = (mappedWords, mappedMatrix, rows, columns) => {
  const {
    rowsAsStrings,
    columnsAsStrings,
    diagonalsTBAsStrings,
    diagonalsBTAsStrings
  } = getSearchStrings(mappedMatrix, rows, columns);

  // eslint-disable-next-line no console
  console.log(
    "Search strings",
    rowsAsStrings,
    columnsAsStrings,
    diagonalsTBAsStrings,
    diagonalsBTAsStrings
  );

  return mappedWords.map((word) => {
    let start = null;
    let end = null;

    const getReversedPosition = (searchString, _word, _reversedPosition) =>
      searchString.length - 1 - _reversedPosition - (word.length - 1);

    // TODO: This code needs some refactoring to avoid repeating stuff and be more performant, couldn't do because of time.
    rowsAsStrings.forEach((row, _rowIndex) => {
      let position = row.indexOf(word);
      const reversedPosition = row.split("").reverse().join("").indexOf(word);

      if (position === -1 && reversedPosition !== -1) {
        // Take last character as first, then swap start and end points before returning
        position = getReversedPosition(row, word, reversedPosition);
      }

      if (position !== -1) {
        start = {
          x: position,
          y: _rowIndex
        };

        end = {
          x: position + word.length - 1,
          y: _rowIndex
        };

        // Swap start and end points for reversed words
        if (reversedPosition !== -1) {
          [start, end] = [end, start];
        }
      }
    });

    columnsAsStrings.forEach((column, _columnIndex) => {
      let position = column.indexOf(word);
      const reversedPosition = column
        .split("")
        .reverse()
        .join("")
        .indexOf(word);

      if (position === -1 && reversedPosition !== -1) {
        // Take last character as first, then swap start and end points before returning
        position = getReversedPosition(column, word, reversedPosition);
      }

      if (position !== -1) {
        start = {
          x: _columnIndex,
          y: position
        };

        end = {
          x: _columnIndex,
          y: position + word.length - 1
        };

        // Swap start and end points for reversed words
        if (reversedPosition !== -1) {
          [start, end] = [end, start];
        }
      }
    });

    diagonalsTBAsStrings.forEach(({ word: diagonalString, x, y }) => {
      let position = diagonalString.indexOf(word);
      const reversedPosition = diagonalString
        .split("")
        .reverse()
        .join("")
        .indexOf(word);

      if (position === -1 && reversedPosition !== -1) {
        // Take last character as first, then swap start and end points before returning
        position = getReversedPosition(diagonalString, word, reversedPosition);
      }

      if (position !== -1) {
        start = {
          x: x + position,
          y: y + position
        };

        end = {
          x: x + position + word.length - 1,
          y: y + position + word.length - 1
        };

        // Swap start and end points for reversed words
        if (reversedPosition !== -1) {
          [start, end] = [end, start];
        }
      }
    });

    diagonalsBTAsStrings.forEach(({ word: diagonalString, x, y }) => {
      let position = diagonalString.indexOf(word);
      const reversedPosition = diagonalString
        .split("")
        .reverse()
        .join("")
        .indexOf(word);

      if (position === -1 && reversedPosition !== -1) {
        // Take last character as first, then swap start and end points before returning
        position = getReversedPosition(diagonalString, word, reversedPosition);
      }

      if (position !== -1) {
        start = {
          x: x + position,
          y: y - position
        };

        end = {
          x: x + position + (word.length - 1),
          y: y - position - (word.length - 1)
        };

        // Swap start and end points for reversed words
        if (reversedPosition !== -1) {
          [start, end] = [end, start];
        }
      }
    });

    return {
      word,
      start,
      end
    };
  });
};
