import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import decode from "jwt-decode";
import { BrowserRouter } from "react-router-dom";
import { useState, useEffect } from "react";
import NavigationBar from './NavigationBar';
import RoutesList from './RoutesList';
import JoblyApi from './api';
import Error from './Error';

/** App
 *
 * Props:
 * - none
 *
 * State:
 * - currentUser: null or {}
 * - token: ""
 * - isLoadingUser: boolean
 * - fetchUserErrors: null or []
 *
 * App --> NavigationBar, Routes
 */
function App() {

  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(window.localStorage.token);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [fetchUserErrors, setFetchUserErrors] = useState(null);

  useEffect(function setCurrentUserOrError() {
    async function fetchUser() {
      if (token) {
        try {
          JoblyApi.token = token;
          const { username } = decode(token);
          let user = await JoblyApi.getUser(username);
          setCurrentUser({ ...user, applications: new Set(user.applications) }); // TODO update set name
          setFetchUserErrors(null);
        } catch (err) {
          setFetchUserErrors(err);
        }

      }
      setIsLoadingUser(false);
    }
    fetchUser();
  }, [token]);

  /** logIn
   *
   * Takes incoming form data, calls API to log user in, sets
   * token state and localStorage up with token received from API.
   * Returns undefined.
   *
   * @param {object} loginFormData
   */
  async function logIn(loginFormData) {
    let token = await JoblyApi.logInUser(
      {
        username: loginFormData.username,
        password: loginFormData.password
      });
    JoblyApi.token = token;
    window.localStorage.setItem('token', token); //could replace this to use =
    setToken(token);
  }

  /** signUp
   *
   * Takes incoming form data, calls API to sign user up, sets
   * token state and localStorage up with token received from API.
   * Returns undefined.
   *
   * @param {object} signUpFormData
   */
  async function signUp(signUpFormData) {
    let token = await JoblyApi.signUpUser(signUpFormData);
    JoblyApi.token = token;
    setToken(token);
  }

  /** logOut
   *
   * Clears out token and currentUser states as well as localStorage entirely.
   * Accepts no arguments and returns undefined.
   */
  function logOut() {
    setToken(null);
    setCurrentUser(null);
    window.localStorage.clear(); //TODO can switch to removeItem for the token instead of clear
  }

  /** updateUserAfterJobApp
   *
   * Sets currentUser state to include updated list of job applications.
   * Returns undefined.
   *
   * @param {int} jobId
   */
  function updateUserAfterJobApp(jobId) {
    setCurrentUser(currUser => ({
      ...currUser,
      applications: currUser.applications.add(jobId)
    }));
  }

  /** updateUserInfo
   *
   * Takes incoming form data, calls API to autnenticate and upate user, sets
   * user state to include new information if successful. Returns undefined.
   *
   * @param {object} profileFormData
   */
  async function updateUserInfo(profileFormData) {

    const { username, password, firstName, lastName, email } = profileFormData;
    let token = await JoblyApi.logInUser(
      {
        username: username,
        password: password
      });
    let updatedUser = await JoblyApi.updateUser(username, { firstName, lastName, email, password });
    if (token) {
      setCurrentUser(currUser => ({
        ...currUser,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email
      }));
    }
  }

  if (isLoadingUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="App">
      <BrowserRouter>
        <NavigationBar currentUser={currentUser} logOut={logOut} />

        {fetchUserErrors && fetchUserErrors.map(e => <Error error={e} />)}

        <RoutesList
          currentUser={currentUser}
          addJobApp={updateUserAfterJobApp}
          logIn={logIn}
          signUp={signUp}
          updateUserInfo={updateUserInfo}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;

