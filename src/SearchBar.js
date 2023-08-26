import { useState } from "react";
import "./SearchBar.css";

/**SearchBar Component
 *
 * Props:
 * - search()
 * - initialSearchTerm: { term: "" }
 *
 * State:
 * - searchData: { term: "" }
 *
 * JobList -> SearchBar
 * CompanyList -> SearchBar
 */
function SearchBar({ search, initialSearchData }) {
  const [searchData, setSearchData] = useState(initialSearchData);

  function handleSubmit(evt) {
    evt.preventDefault();
    search(searchData);
  }

  function handleChange(evt) {
    const { name, value } = evt.target;
    setSearchData(currData => ({ ...currData, [name]: value }));
  }
  return (
  <form className="SearchBar" onSubmit={handleSubmit}>
      <label htmlFor="term-input"></label>
      <input
        id="term-input"
        type="text"
        name="term"
        value={searchData.term}
        onChange={handleChange}
        placeholder="Enter search term..."/>
      <button className="btn submit">Submit</button>
  </form>
  )
}

export default SearchBar;