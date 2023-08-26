import { useState, useEffect } from "react";
import JobCard from "./JobCard";
import JoblyApi from "./api";
import SearchBar from "./SearchBar";
import Error from "./Error";

const initialSearchFormData = {
  term: ""
};

/** JobList component
 *
 * Props:
 * - currentUser {}
 * - addJobApp()
 *
 * State:
 * - isLoadingJobList: boolean
 * - jobs: []
 * - errors: null or []
 * - searchTerm: { term: "" }
 *
 * Routes -> JobList -> SearchBar
 *                   -> JobCard
 */
function JobList({ currentUser, addJobApp }) {

  const [isLoadingJobList, setIsLoadingJobList] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState([]);
  const [searchData, setSearchData] = useState(initialSearchFormData);

  useEffect(function setJobsOrError() {
    async function fetchJobs() {
      try {
        setErrors([]);
        let jobs = await JoblyApi.getJobs(searchData.term);
        setJobs(jobs);
        setIsLoadingJobList(false);
      } catch (err) {
        setErrors(errs => [...errs, err]);
        setIsLoadingJobList(false);
      }
    }
    fetchJobs();
  }, [searchData]);

  /** search
   *
   * Takes in search term and updates loading and searchTerm states to trigger
   * a re-render. Returns undefined.
   *
   * @param {string} searchTerm
   */
  function search(searchTerm) {
    setIsLoadingJobList(true);
    setSearchData(currData => (
      {
        ...currData,
        term: searchTerm.term
      }
    ));
  }

  /** populateErrors
   *
   * Maps through errors state and renders error component for each
   *
   * @returns
   */
  function populateErrors() {
    return (
      <div>
        {errors.map((e, idx) => <Error key={idx} error={e} />)}
      </div>
    );
  }

  if (isLoadingJobList) {
    return (
      <h2>Loading...</h2>
    );
  }

  return (
    <div className="JobList">
      <div className="row">
        <div className="col-1 col-xl-3"></div>
        <div className="col-10 col-xl-6">
          {errors.length ? populateErrors() : null}
          <SearchBar search={search} initialSearchData={searchData} />
          {jobs.length > 0
            ? jobs.map(job => <JobCard
              key={job.id}
              job={job}
              currentUser={currentUser}
              addJobApp={addJobApp}
              showCompany={true} />)
            : <p>No results found.</p>}
        </div>
      </div>
    </div>
  );
}

export default JobList;
