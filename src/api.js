import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
  // the token for interactive with the API will be stored here.
  static token;

  static async request(endpoint, data = {}, method = "get") {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}/${endpoint}`;
    const headers = { Authorization: `Bearer ${JoblyApi.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      console.error("API Error:", err.response);
      let message = err.response.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  // Individual API routes

 /** Get all companies.  "searchTerm" => [companies]
   * 
   * returns [ { handle, name, description, numEmployees, logoUrl }, ...]
  */

  static async getCompanies(searchTerm) {
    if (searchTerm === "") {
      let res = await this.request(`companies`);
      return res.companies;
    }

    let res = await this.request(`companies`, { "name": searchTerm });
    return res.companies;
  }

  /** Get details on a company by handle. "handle" => {company}
   * 
   * returns { handle, 
   *           name, 
   *           description,
   *           numEmployees, 
   *           logoUrl, 
   *           jobs: [{ id, title, salary, equity }, ...] }
   */

  static async getCompany(handle) {
    let res = await this.request(`companies/${handle}`);
    return res.company;
  }

   /** Get all jobs. "searchTerm" => [jobs] 
   * 
   * returns [ { id, title, salary, equity, companyHandle, companyName }, ...]
  */

  static async getJobs(searchTerm) {

    if (searchTerm === "") {
      let res = await this.request(`jobs`);
      return res.jobs;
    }

    let res = await this.request(`jobs`, { "title": searchTerm });
    return res.jobs;

  }

  /** Get user.  "username" => {user}
   * 
   * Returns { username, firstName, lastName, isAdmin, jobs }
   * where jobs is { id, title, companyHandle, companyName, state }
  */


  static async getUser(username) {
    let res = await this.request(`users/${username}`);
    return res.user;
  }

  /** Log in user. {username, password} => "token" */

  static async logInUser({ username, password }) {
    let res = await this.request(`auth/token`, { username, password }, "post");
    return res.token;
  }

  /** Signup user.  user {}  => "token"
   * 
   * where user object is { username, password, firstName, lastName, email }
  */


  static async signUpUser(user) {
    let res = await this.request(`auth/register`, user, "post");
    return res.token;
  }

  /** Apply to Job. 
   * 
   * ("username", jobId) => {applied: jobId}
  */


  static async applyToJob(username, jobId) {
    let res = await this.request(`users/${username}/jobs/${jobId}`, {}, "post");
    return res;
  }

  /** Update user.  user {}  => updated user {}
   * 
   * where initial user object is { password, firstName, lastName, email }
   * resultant user object is { username, firstName, lastName, email, isAdmin }
  */

  static async updateUser(username, user) {
    let res = await this.request(`users/${username}`, user, "patch");
    return res.user;
  }

}

// for now, put token ("testuser" / "password" on class)
// JoblyApi.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ" +
//     "SI6InRlc3R1c2VyIiwiaXNBZG1pbiI6ZmFsc2UsImlhdCI6MTU5ODE1OTI1OX0." +
//     "FtrMwBQwe6Ue-glIFgz_Nf8XxRT2YecFCiSpYL0fCXc";

export default JoblyApi;