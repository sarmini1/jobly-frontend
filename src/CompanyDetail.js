import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import JoblyApi from "./api";
import JobCard from "./JobCard";
import Error from "./Error";
import "./CompanyDetail.css";

/** CompanyDetail
 *
 * Props:
 * - currentUser: {}
 * - addJobApp()
 *
 * State:
 * - company: {}
 * - isLoadingCompany: boolean
 * - errors: []
 *
 * Routes --> CompanyDetail
 */

function CompanyDetail({ currentUser, addJobApp }) {

  const [company, setCompany] = useState({});
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [errors, setErrors] = useState([]);

  const { handle } = useParams();

  // effect runs after mount and when handle changes in URL params
  useEffect(function setCompanyOrError() {
    async function fetchCompany() {
      try {
        let company = await JoblyApi.getCompany(handle);
        setCompany(company);
        setIsLoadingCompany(false);
      } catch (err) {
        setErrors(errs => [...errs, err]);
        setIsLoadingCompany(false);
      }
    }
    fetchCompany();
  }, [handle]);

  if (isLoadingCompany) {
    return (
      <h2>Loading</h2>
    );
  }

  //TODO: make new component for not-found element to replace below link
  if (errors.length > 0) {
    return (
      <div>
        {errors.map((e, idx) => <Error key={idx} error={e} />)}
        <Link to={`/companies`} style={{ textDecoration: "none" }}>
          <h2 style={{color: "grey"}}>Back to Companies</h2>
        </Link>
      </div>
    );
  }

  return (
    <div className="CompanyDetail">
      <div className="row">
        <div className="col-1 col-xl-3"></div>
        <div className="col-10 col-xl-6">
          <h3>{company.name}</h3>
          <p>{company.description}</p>
          {company.jobs.map(job => <JobCard
            currentUser={currentUser}
            job={job}
            addJobApp={addJobApp}
            showCompany={false}
            key={job.id}
          />)}
        </div>
        <div className="col-1 col-md-4"></div>
      </div>
    </div>
  );
}

export default CompanyDetail;

