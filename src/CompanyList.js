import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import JoblyApi from "./api";
import SearchBar from "./SearchBar";
import CompanyCard from "./CompanyCard";
import Error from "./Error";

const initialSearchFormData = {
  term: ""
};

/** CompanyList Component
 *
 * Props:
 * - currentUser {}
 *
 * State:
 * - isLoadingCompanyList: boolean
 * - companies: []
 * - errors: []
 * - searchData: { term: "" }
 *
 * Routes -> CompanyList -> SearchBar
 *                       -> CompanyCard
 */
function CompanyList({ currentUser }) {
  const [isLoadingCompanyList, setIsLoadingCompanyList] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState([]);
  const [searchData, setSearchData] = useState(initialSearchFormData);

  useEffect(function () {
    async function getCompanies() {
      try {
        let companies = await JoblyApi.getCompanies(searchData.term);
        setCompanies(companies);
        setIsLoadingCompanyList(false);
      } catch (err) {
        setErrors(errs => [...errs, err]);
        setIsLoadingCompanyList(false);
      }
    }
    getCompanies();
  }, [searchData]);

  /** search
   *
   * Takes in search term and updates loading and searchTerm states to trigger
   * a re-render. Returns undefined.
   *
   * @param {string} searchTerm
   */
  function search(searchTerm) {
    setIsLoadingCompanyList(true);
    setSearchData(currData => (
      {
        ...currData,
        term: searchTerm.term
      }
    ));
  }

  if (isLoadingCompanyList) {
    return (
      <h2>Loading</h2>
    );
  }

  //TODO: make new component for not-found element to replace below link
  if (errors.length > 0) {
    return (
      <div>
        {errors.map((e, idx) => <Error key={idx} error={e} />)}
        <Link to={`/`} style={{ textDecoration: "none" }}>
          <h2 style={{ color: "grey" }}>Back to Home</h2>
        </Link>
      </div>
    );
  }

  return (
    <div className="CompanyList">
      <div className="row">
        <div className="col-1 col-md-2"></div>
        <div className="col-10 col-md-8">
          <SearchBar search={search} initialSearchData={searchData} />
          <div className="CompanyList-list">
            {companies.length > 0
              ? companies.map(company =>
                <CompanyCard company={company}
                  currentUser={currentUser}
                  key={company.handle} />)
              : <p>No results found.</p>}
          </div>
          <div className="col-1 col-md-2"></div>
        </div>
      </div>
    </div>
  );
}

export default CompanyList;
