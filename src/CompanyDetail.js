import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
 * - errors: null or []
 * 
 * Routes --> CompanyDetail
 */

function CompanyDetail({ currentUser, addJobApp }) {

  const [company, setCompany] = useState({});
  const [isLoadingCompany, setIsLoadingCompany] = useState(true);
  const [errors, setErrors] = useState(null);

  const { handle } = useParams();

  useEffect(function setCompanyOrError() {
    async function fetchCompany() {
      try {
        let company = await JoblyApi.getCompany(handle);
        setCompany(company);
        setIsLoadingCompany(false);
      } catch (err) {
        setErrors(err);
      }
    }
    fetchCompany();
  }, [handle]);

  if (isLoadingCompany) {
    return (
      <h2>Loading</h2>
    )
  }

  return (
    <div className="CompanyDetail">
      <div className="row">
        <div className="col-1 col-xl-3"></div>
        <div className="col-10 col-xl-6">
          {errors && errors.map(e => <Error error={e} />)}
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

