import "./Results.css";

const Results = ({ results }) => (
  <div className="results">
    <h2>Results</h2>
    <div>
      These are the results, in (x,y) coordinates, where x is the column number
      and y is the row number
    </div>
    <div className="results__grid">
      {results.map(({ word, start, end }, index) => (
        <div key={`${word}-${index}`} className="results__result">
          <b>{word}</b>
          <div>
            {start != null
              ? `Start: (${start.x + 1}, ${start.y + 1})`
              : "Not found"}
          </div>
          <div>{start != null && `End: (${end.x + 1}, ${end.y + 1})`}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Results;
