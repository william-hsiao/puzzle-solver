import { h } from "preact";
import style from "./style";

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];

// const puzzle = [
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null, null],
// ];

// EASY
// const puzzle = [
//   [null, 9, null, 4, null, null, 2, null, null],
//   [null, null, 2, 6, 1, 5, null, null, null],
//   [null, null, 3, null, 7, 9, 4, null, 6],
//   [null, null, null, null, null, 1, 8, 2, null],
//   [2, 6, 1, null, null, null, 7, 3, 4],
//   [null, 8, 5, 3, null, null, null, null, null],
//   [5, null, 8, 9, 2, null, 1, null, null],
//   [null, null, null, 1, 5, 7, 9, null, null],
//   [null, null, 9, null, null, 6, null, 7, null]
// ];

// MEDIUM
const puzzle = [
  [null, 8, 3, 7, null, 9, null, null, null],
  [null, null, null, 3, null, 4, null, 9, null],
  [null, null, null, 8, 1, null, 7, null, null],
  [null, null, 1, null, null, null, null, 6, null],
  [3, null, 2, null, null, null, 9, null, 4],
  [null, 7, null, null, null, null, 8, null, null],
  [null, null, 7, null, 5, 8, null, null, null],
  [null, 3, null, 1, null, 2, null, null, null],
  [null, null, null, 9, null, 7, 2, 8, null]
];

// HARD
// const puzzle = [
//   [null, 5, 8, null, 1, null, null, null, 9],
//   [null, null, null, 5, null, null, null, 8, null],
//   [null, null, null, null, 8, null, 5, null, 2],
//   [null, null, null, 7, null, null, null, 2, 3],
//   [8, null, 1, null, null, null, 7, null, 4],
//   [5, 3, null, null, null, 8, null, null, null],
//   [3, null, 4, null, 9, null, null, null, null],
//   [null, 6, null, null, null, 5, null, null, null],
//   [1, null, null, null, 7, null, 3, 9, null],
// ];

const possibleValues = [
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []],
  [[], [], [], [], [], [], [], [], []]
];

// Getters
const getRow = idx => {
  if (idx < 0 || idx > 8) return [];
  return puzzle[idx];
};
const getCol = idx => {
  if (idx < 0 || idx > 8) return [];
  return puzzle.map(row => row[idx]);
};
const getGrid = (data, i, j) => {
  const rowStart = Math.floor(i / 3) * 3;
  const colStart = Math.floor(j / 3) * 3;

  return data
    .slice(rowStart, rowStart + 3)
    .map(row => row.slice(colStart, colStart + 3))
    .reduce((all, row) => [...all, ...row], []);
};

// Processing algorithms
const searchMissing = numSet => {
  return numbers.reduce((acc, i) => {
    if (!numSet.includes(i)) return [...acc, i];
    return acc;
  }, []);
};

const findUniquePossibilityInGrid = (i, j) => {
  const evaluatedCellIndex = (i % 3) * 3 + (j % 3);

  const gridPossibilites = Array.from(
    new Set(
      getGrid(possibleValues, i, j).reduce((acc, cell, idx) => {
        if (idx === evaluatedCellIndex) return acc;
        return [...acc, ...cell];
      }, [])
    )
  );
  return possibleValues[i][j].filter(val => !gridPossibilites.includes(val));
};

// Processes
const evaluateCell = (i, j) => {
  return searchMissing(
    Array.from(new Set([...getRow(i), ...getCol(j), ...getGrid(puzzle, i, j)]))
  ).sort((a, b) => a - b);
};

const evaluateTable = () => {
  puzzle.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (!puzzle[i][j]) {
        possibleValues[i][j] = evaluateCell(i, j);
      }
    });
  });
};

// Fill table
const fillLonePossibility = () => {
  possibleValues.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell.length === 1) {
        puzzle[i][j] = cell[0];
        cell = [];
      }
    });
  });
};

const fillGridUniquePossibility = () => {
  puzzle.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (!cell) {
        const uniquePossibilities = findUniquePossibilityInGrid(i, j);

        if (uniquePossibilities.length === 1) {
          puzzle[i][j] = uniquePossibilities[0];
          possibleValues[i][j] = [];
        }
      }
    });
  });
};

const fill = () => {
  fillLonePossibility();
  fillGridUniquePossibility();
};

const filled = () => {
  return puzzle.every(row => row.every(cell => cell));
};

const Sudoku = () => {
  let rounds = 0;
  while (!filled()) {
    evaluateTable();
    fill();
    rounds++;
    if (rounds > 30) break;
  }
  console.log(rounds);

  return (
    <div class={style.sudoku}>
      <h1>Sudoku</h1>

      <table>
        {puzzle.map((row, i) => {
          return (
            <tr>
              {row.map((cell, j) => {
                if (cell) return <td>{cell}</td>;
                else
                  return (
                    <td class={style.possible}>
                      {possibleValues[i][j].join(",")}
                    </td>
                  );
              })}
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default Sudoku;
