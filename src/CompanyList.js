import { useState, useEffect } from "react";
import JoblyApi from "./api";
import SearchBar from "./SearchBar";
import CompanyCard from "./CompanyCard";
import Error from "./Error";

/** CompanyList Component
 * 
 * Props:
 * - currentUser {}
 * 
 * State:
 * - isLoadingCompanyList: boolean
 * - companies: []
 * - errors: null or []
 * - searchTerm: ""
 * 
 * Routes -> CompanyList -> SearchBar
 *                       -> CompanyCard
 */
function CompanyList({ currentUser }) {
  const [isLoadingCompanyList, setIsLoadingCompanyList] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [errors, setErrors] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(function () {
    async function getCompanies() {
      try {
        let companies = await JoblyApi.getCompanies(searchTerm);
        setCompanies(companies);
        setIsLoadingCompanyList(false);
      } catch (err) {
        setErrors(err);
      }
    }
    getCompanies();
  }, [searchTerm]);

  function search(searchTerm) {
    setIsLoadingCompanyList(true);
    setSearchTerm(searchTerm);
  }

  if (isLoadingCompanyList) {
    return (
      <h2>Loading</h2>
    )
  }

  return (
    <div className="CompanyList">
      <div className="row">
        <div className="col-1 col-md-2"></div>
        <div className="col-10 col-md-8">
          {errors && errors.map(e => <Error error={e} />)}
          <SearchBar search={search} initialSearchTerm={searchTerm} />
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
