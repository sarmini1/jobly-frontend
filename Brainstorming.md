const { getByTitle } = require("@testing-library/dom")

Homepage
- navbar - navbrand & login, signup
- login link
- sign up link

Navbar
- navbrand, companies, jobs, profile, logout user

Sign UP page
Form for sign up axios post
redirects to companies page

Log in page
form for log in axios post
redirects to companies page

/companies
search Bar - get requests to /companies
Company listing - name, description, logo (optional)

/companies/:Company
company name, description
job listings - get title, salary, equity, apply button (will toggle between apply/applied)


/jobs
search bar - get requests to /jobs
job listings- same as above, apply button

/profile
form - username- first name, last name, email, confirm password, save changes button(post)
- validate on back end

if we go somewhere that user is not authorized, redirect back to home


Component Hierarchy

APP (props: none / state: user (either null or user instance), isLoading: boolean)
  - NAVBAR (props: user, potentially function for logout user / state: none)
    - logout navlink should return to homepage and and make user state null
  - ROUTES ((props: user, login() / state: none))
    - HOMEPAGE (props: none / state: none)
        - user? Welcome Back, username!
        - !user? show login and sign up buttons
    - NOT LOGGED IN ROUTES (props: login function / state: none)
        - !user REACT /login  AXIOS-/auth/token
          - LOGIN FORM (props: login function state: formData)
          - redirect to /companies
        - !user REACT /signup AXIOS-/auth/register
          - SIGNUP FORM (props: login function state: formData)
          - redirect to /companies
    - ALL LOGGED IN ROUTES (props: user)
    - COMPANIES LISTING (props: toggleLoading() state: companies to list as an array) (/companies endpoint)
      - SEARCH FORM (props: setListCompanies() state: formData (default ""))
        - on submit make a get request to /companies?q={searchTerm}
      - COMPANY LIST ITEM (props: information on the company to display)
        - state: search terms : default("")
        - state: [companies]
        - or get /companies on no search terms
        - return companies listings using companies state
          - COMPANY JOB LISTING (props: user)
            - JOB LIST ITEM    Signup Form Component (props: login function)
    - JOBS LISTING (props: toggleLoading() state: jobs to list as an array) (/jobs endpoint)
      - SEARCH FORM (props: senpm tListJobs() state: formData (default ""))
        - on submit make a get request to /jobs?q={searchTerm}
      - JOB LIST ITEM (props: information on the job to display, applyToJob())
        - state: search terms : default("")
        - state: [jobs]
        - or get /jobs on no search terms
        - return jobs listings using jobs state
    - PROFILE (props of user)
      - UPDATE PROFILE FORM (props: user, updateuser() state: formData(default user values), responseMessage(default ""))
        - state JSON response default ("") and we set the state to the last response
        - on submit (return the JSON message as error or success alert)
        - makes patch request to /users/:username

    Notes:

    - isLoading is crucial to utilize when making requests to the backend
    - any component that utilizes an API request should have its own state for loading status
      - add loading status to companies, jobs, etc. name relative to the place it lives
    - add login/signup buttons to navbar
    - can let components make the decision on which routes to display
    - all routes should just go in a switch
    - alert component that takes in the JSON from the response and displays it