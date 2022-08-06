import React, { useState } from "react";
import { useForm } from "react-hook-form";

import "./CrosswordInputs.css";
import Results from "./Results";

import { getResults, getSearchStrings } from "./utils";

const CELL_SIZE = 50;

const CrosswordInputs = ({ rows, columns, words }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted, isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      words: [...new Array(words)].fill("")
    }
  });

  const [results, setResults] = useState(null);

  const cwCellOptions = { required: true, maxLength: 1 };

  const onSubmit = ({ cwinputs, words }) => {
    const mappedMatrix = cwinputs.map((row) =>
      row.map((column) => column.value)
    );

    const mappedWords = words.map((word) => word.value);

    const results = getResults(mappedWords, mappedMatrix, rows, columns);

    setResults(results);
  };

  const onError = (errors) => {
    console.log("Errors", errors);
  };

  const renderColumnHeaders = () =>
    [...new Array(columns + 1)].map((__, index) => (
      <div key={`column-header-${index}`} className="crossword-inputs__cell">
        {index || ""}
      </div>
    ));

  const renderRows = () =>
    [...new Array(rows)].map((__, rowIndex) => (
      <React.Fragment key={`row-${rowIndex}`}>
        <div className="crossword-inputs__cell">{rowIndex + 1}</div>
        {[...new Array(columns)].map((__, columnIndex) => (
          <div
            key={`cwinputs-${rowIndex}-${columnIndex}`}
            className="crossword-inputs__cell"
          >
            <input
              type="text"
              className="form-control"
              {...register(
                `cwinputs.${rowIndex}.${columnIndex}.value`,
                cwCellOptions
              )}
              maxLength={1}
              disabled={isSubmitSuccessful}
              required
            />
          </div>
        ))}
      </React.Fragment>
    ));

  const renderSvgResults = () => (
    <svg
      className="crowssword-inputs__graphics"
      style={{ width: `${50 * columns}px`, height: `${50 * rows}px` }}
    >
      {results.map(
        ({ start, end }) =>
          start && ( // Lines start at the middle of the cell.
            <line
              x1={start.x * CELL_SIZE + CELL_SIZE / 2}
              x2={end.x * CELL_SIZE + CELL_SIZE / 2}
              y1={start.y * CELL_SIZE + CELL_SIZE / 2}
              y2={end.y * CELL_SIZE + CELL_SIZE / 2}
            />
          )
      )}
    </svg>
  );

  return (
    <div>
      <form
        className={`crossword-inputs ${isSubmitted ? "was-validated" : ""}`}
        onSubmit={handleSubmit(onSubmit, onError)}
        noValidate
      >
        <div
          className="crossword-inputs__grid"
          style={{
            gridTemplateRows: `repeat(${rows + 1}, 50px)`,
            gridTemplateColumns: `repeat(${columns + 1}, 50px)`
          }}
        >
          {renderColumnHeaders()}
          {renderRows()}
          {results && renderSvgResults()}
        </div>
        <div className="crossword-inputs__words">
          <div className="crossword-inputs__words-title">Words</div>
          {[...new Array(words)].map((__, index) => (
            <div key={`word-${index}`} className="crossword-inputs__word-group">
              <input
                type="text"
                className="form-control"
                {...register(`words.${index}.value`, {
                  required: true,
                  minLength: 2
                })}
                minLength={2}
                required
              />
            </div>
          ))}
          <div className="crossword-inputs__word-group">
            <input
              type="submit"
              name="cwinputs-submit"
              className="btn btn-primary"
              value="Process"
            />
          </div>
        </div>
      </form>
      {results && <Results results={results} />}
    </div>
  );
};

export default CrosswordInputs;
