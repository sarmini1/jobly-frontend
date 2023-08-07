import { Route, Navigate, Routes } from "react-router-dom";
import Homepage from "./Homepage";
import CompanyList from "./CompanyList";
import CompanyDetail from "./CompanyDetail";
import JobList from "./JobList";
import LoginForm from "./LoginForm";
import SignUpForm from "./SignUpForm";
import ProfileForm from "./ProfileForm";


/**
 * RoutesList Component
 *
 * Props:
 * - currentUser {}
 * - addJobApp()
 * - logIn ()
 * - signUp ()
 * - updateUserInfo ()
 *
 * State:
 * - none
 *
 * App -> RoutesList -> Homepage
 *               -> CompanyList
 *  *            -> CompanyDetail
 *  *            -> JobList
 *  *            -> ProfileForm
 *  *            -> LoginForm
 *  *            -> SignUpForm
 *
 */
function RoutesList({ currentUser, addJobApp, logIn, signUp, updateUserInfo }) {

  //TODO create and utilize private route component to encapsulate route logic

  return (
    <Routes>
      {currentUser &&
        <>
          <Route
            path="/"
            element={<Homepage currentUser={currentUser} />}
          />
          <Route
            path="/companies"
            element={<CompanyList currentUser={currentUser} />}
          />
          <Route
            path="/companies/:handle"
            element={<CompanyDetail currentUser={currentUser} addJobApp={addJobApp} />}
          />
          <Route
            path="/jobs"
            element={<JobList currentUser={currentUser} addJobApp={addJobApp} />}
          />
          <Route
            path="/profile"
            element={
              <ProfileForm
              currentUser={currentUser}
              updateUserInfo={updateUserInfo}/>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      }

      {!currentUser &&
        <>
          <Route
            path="/"
            element={<Homepage currentUser={currentUser} />}
          />
          <Route
            path="/login"
            element={<LoginForm logIn={logIn}/>}
          />
          <Route
            path="/signup"
            element={<SignUpForm signUp={signUp}/>}
          />
          <Route
            path="/companies"
            element={<Navigate to="/login" />}
          />
          <Route
            path="/jobs"
            element={<Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={<Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      }
    </Routes>
  );
}

export default RoutesList;
