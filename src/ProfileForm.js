import { useState } from "react";
import Error from "./Error";
import { Form } from "react-bootstrap";
import "./ProfileForm.css";

/** ProfileForm
 * 
 * Props:
 * - currentUser {}
 * - updateUserInfo()
 * 
 * State:
 * - profileFormData: {}
 * - isSuccessful: boolean
 * - errors: null or []
 * 
 * Routes --> ProfileForm
 * 
 */
function ProfileForm({ currentUser, updateUserInfo }) {

  const [profileFormData, setProfileFormData] = useState({
    username: currentUser.username,
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    password: ""
  });
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [errors, setErrors] = useState(null);

  function handleChange(evt) {
    const { name, value } = evt.target;
    setProfileFormData(currData => ({ ...currData, [name]: value }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    setIsSuccessful(false);
    setErrors(null);
    try {
      await updateUserInfo(profileFormData);
      setIsSuccessful(true);
      setProfileFormData(currData => ({ ...currData, password: "" }));
    } catch (err) {
      setErrors(err);
      setIsSuccessful(false);
    }
  }

  return (
    <div className="ProfileForm">
      <div className="row">
        <div className="col-1 col-md-4"></div>
        <div className="col-10 col-md-4">
          <h3>Edit Profile</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Label htmlFor="ProfileForm-username">Username</Form.Label>
            <p id="ProfileForm-username">{currentUser.username}</p>
            <Form.Label htmlFor="ProfileForm-first-name">First Name</Form.Label>
            <Form.Control
              id="ProfileForm-first-name"
              name="firstName"
              type="text"
              onChange={handleChange}
              value={profileFormData.firstName}
              required
            />
            <Form.Label htmlFor="ProfileForm-last-name">Last Name</Form.Label>
            <Form.Control
              id="ProfileForm-last-name"
              name="lastName"
              type="text"
              onChange={handleChange}
              value={profileFormData.lastName}
              required
            />
            <Form.Label htmlFor="ProfileForm-email">Email</Form.Label>
            <Form.Control
              id="ProfileForm-email"
              name="email"
              type="text"
              onChange={handleChange}
              value={profileFormData.email}
              required
            />
            <Form.Label htmlFor="ProfileForm-password">Confirm password to make changes:</Form.Label>
            <Form.Control
              id="ProfileForm-password"
              name="password"
              type="password"
              onChange={handleChange}
              value={profileFormData.password}
              required
            />
            {errors && errors.map(e => <Error error={e} />)}
            {isSuccessful && <div className="alert alert-success">Updated successfully.</div>}
            <button className="btn" type="submit">Update!</button>
          </Form>
        </div>
        <div className="col-1 col-md-4"></div>
      </div>
    </div>
  );
}

export default ProfileForm;
