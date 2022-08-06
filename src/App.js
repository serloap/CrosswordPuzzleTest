import React from "react";
import { useForm } from "react-hook-form";
import CrosswordInputs from "./CrosswordInputs";

import "bootstrap/dist/css/bootstrap.min.css";

import "./styles.css";

// Add max size or words as 10 to keep UI clean. This is optional.
const MAX_SIZE_AND_WORDS = 10;

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitSuccessful }
  } = useForm({
    defaultValues: {
      rows: 5,
      columns: 5,
      words: 5
    }
  });

  const {
    rows: rowsString,
    columns: columnsString,
    words: wordsString
  } = watch();
  const [rows, columns, words] = [
    Number(rowsString),
    Number(columnsString),
    Number(wordsString)
  ];

  const sizeInputOptions = { required: true, max: MAX_SIZE_AND_WORDS };

  const onSubmit = () => {};

  const onSubmitError = (error) => {
    console.log(error);
  };

  return (
    <div className="App">
      <h1>Crossword Puzzle</h1>
      <form
        className="size-form"
        onSubmit={handleSubmit(onSubmit, onSubmitError)}
      >
        {isSubmitSuccessful ? (
          <input
            type="button"
            name="size-reset"
            className="btn btn-secondary"
            value="Reset"
            onClick={() => reset()}
          />
        ) : (
          <>
            <label htmlFor="rows" className="form-label">
              Rows
            </label>
            <input
              type="number"
              name="rows"
              className="form-control"
              max={MAX_SIZE_AND_WORDS}
              {...register("rows", sizeInputOptions)}
              required
            />
            <label htmlFor="rows" className="form-label">
              Columns
            </label>
            <input
              type="number"
              name="columns"
              className="form-control"
              max={MAX_SIZE_AND_WORDS}
              {...register("columns", sizeInputOptions)}
              required
            />
            <label htmlFor="rows" className="form-label">
              Words
            </label>
            <input
              type="number"
              name="words"
              className="form-control"
              max={MAX_SIZE_AND_WORDS}
              {...register("words", sizeInputOptions)}
              required
            />
            <input
              type="submit"
              name="size-submit"
              className="btn btn-primary size-form__submit"
              value="Generate"
            />
          </>
        )}
      </form>
      {isSubmitSuccessful && <CrosswordInputs {...{ rows, columns, words }} />}
    </div>
  );
}
