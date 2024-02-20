import React, { useState } from "react";
import "../../scss/Auth.scss";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import {
  handleGoogleAuth,
  handleFacebookAuth,
  handleGithubAuth,
} from "./BrandsAuth";
import { regexUserName, regexEmail, regexPassword } from "./RegexValidation";

const initialState = {
  firstName: "",
  lastName: "",
  userName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function Auth({ setActive }) {
  const [state, setState] = useState(initialState);
  const [signUp, setSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState(null);
  const { firstName, lastName, userName, email, password, confirmPassword } =
    state;
  const navigate = useNavigate();

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const handleAuth = async (e) => {
    e.preventDefault();
    if (!signUp) {
      try {
        if (email === "" || password === "") {
          return toast.error("Please fill all entries", { autoClose: 5000 });
        }
        if (email && password) {
          if (regexEmail.test(email) && regexPassword.test(password)) {
            const { user } = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );
            setUser(user);
            setActive("home");
          } else {
            return toast.error(
              "Invalid email or passsword. Please enter a valid email or password",
              { autoClose: 5000 }
            );
          }
        }
      } catch (error) {
        console.error("Error:", error);
        return toast.error("Failed to login account. Please try again", {
          autoClose: 5000,
        });
      }
    } else {
      if (password !== confirmPassword) {
        return toast.error("Password don't match", { autoClose: 5000 });
      }
      if (
        firstName === "" ||
        lastName === "" ||
        email === "" ||
        password === "" ||
        confirmPassword === ""
      ) {
        return toast.error("All fields are required", { autoClose: 5000 });
      }
      if (password !== confirmPassword) {
        return toast.error("Passwords are not same", { autoClose: 5000 });
      }

      if (!regexEmail.test(email)) {
        return toast.error("Enter a valid email", { autoClose: 5000 });
      }

      if (!regexUserName.test(userName)) {
        return toast.error("Enter a valid user name", { autoClose: 5000 });
      }
      if (!regexPassword.test(password)) {
        return toast.error("Enter a valid password", { autoClose: 5000 });
      }

      if (firstName && lastName && userName && email && password) {
        const { user } = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(user, { displayName: userName });
        setActive("home");
      } else {
        return toast.error("All fields are mandatory to fill", {
          autoClose: 5000,
        });
      }
    }
    navigate("/");
  };
  return (
    <div>
      <div className="container-fluid mb-4">
        <div className="container">
          <div className="col-12 text-center">
            <div className="text-center heading py-2">
              {!signUp ? "Sign-In" : "Sign-Up"}
            </div>
          </div>
          <div className="row h-100 justify-content-center align-items-center">
            <div className="col-10 col-md-8 col-lg-6">
              <form className="row" onSubmit={handleAuth}>
                {signUp && (
                  <>
                    <div className="col-6 py-3">
                      <input
                        type="text"
                        className="form-control input-text-box"
                        placeholder="First Name"
                        name="firstName"
                        value={firstName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-6 py-3">
                      <input
                        type="text"
                        className="form-control input-text-box"
                        placeholder="Last Name"
                        name="lastName"
                        value={lastName}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="col-12 py-3">
                      <input
                        type="text"
                        className="form-control input-text-box"
                        placeholder="Username"
                        name="userName"
                        value={userName}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}
                <div className="col-12 py-3">
                  <input
                    type="email"
                    className="form-control input-text-box"
                    placeholder={`${!signUp ? "Email or UserName" : "Email "}`}
                    name="email"
                    value={email}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-12 py-3 password">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control input-text-box"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                  />
                  <div
                    className="password-toggle-icon"
                    onClick={handleTogglePassword}
                    style={{ cursor: "pointer" }}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
                  </div>
                </div>
                {signUp && (
                  <div className="col-12 py-3 confirmPassword">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control input-text-box"
                      placeholder="Confirm Password"
                      name="confirmPassword"
                      value={confirmPassword}
                      onChange={handleChange}
                    />
                    <div
                      className="password-toggle-icon"
                      onClick={handleTogglePassword}
                      style={{ cursor: "pointer" }}
                    >
                      <FontAwesomeIcon
                        icon={showPassword ? faEye : faEyeSlash}
                      />
                    </div>
                  </div>
                )}
                <div className="BrandsAuth">
                  <div className="d-flex justify-content-center ">
                    <button
                      className="google-button"
                      onClick={handleGoogleAuth}
                    >
                      <i className="fa-brands fa-google me-4"></i>
                      Connect with Google
                    </button>
                  </div>
                  <div className="d-flex justify-content-center ">
                    <button
                      className="facebook-button"
                      onClick={handleFacebookAuth}
                    >
                      <i className="fa-brands fa-facebook me-4"></i>
                      Connect with Facebook
                    </button>
                  </div>
                  <div className="d-flex justify-content-center ">
                    <button
                      className="github-button"
                      onClick={handleGithubAuth}
                    >
                      <i className="fa-brands fa-github me-4"></i>
                      Connect with Github
                    </button>
                  </div>
                </div>
                <div className="col-12 py-3 text-center">
                  <button
                    className={`btn ${
                      !signUp ? "btn-sign-in" : "btn-sign-up"
                    } `}
                    type="submit"
                  >
                    {!signUp ? "Sign-In" : "Sign-Up"}
                  </button>
                </div>
              </form>
              <div>
                {!signUp ? (
                  <>
                    <div className="text-center justify-content-center mt-2 pt-2">
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Don't have an account?
                        <span
                          className="link-danger"
                          style={{ textDecoration: "none", cursor: "pointer" }}
                          onClick={() => setSignUp(true)}
                        >
                          SignUp
                        </span>
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center justify-content-center mt-2 pt-2">
                      <p className="small fw-bold mt-2 pt-1 mb-0">
                        Already have an account?
                        <span
                          className="link-danger"
                          style={{
                            textDecoration: "none",
                            cursor: "pointer",
                            color: "#298af2",
                          }}
                          onClick={() => setSignUp(false)}
                        >
                          SignIn
                        </span>
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
