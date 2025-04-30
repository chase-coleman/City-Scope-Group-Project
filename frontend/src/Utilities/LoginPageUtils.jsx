import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export const user_api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/user/",
});

export const userRegistration = async (
  email,
  firstName,
  lastName,
  password,
  setLogError
) => {
  console.log(`${email} ${password} ${firstName} ${lastName}`)
  const regex = new RegExp("[a-zA-Z].+@[a-zA-Z].+.[a-zA-Z].+");
  if (!regex.test(email)) {
    setLogError("Invalid email address");
    return;
  }
  try {
    let response = await user_api.post("signup/", {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    });
    print(response)
    if (response.status == 226) {
      setLogError("Username already exists, try another");
      return;
    }
    console.log(`${response.status} ${response["user"]}`);
    if (response.status === 201) {
      const { user } = response.data;
      return userLogin(user, password, setLogError);
    }
  } catch (error) {
    setLogError(`registration failed, ${error}`);
    return null;
  }
};

export const userLogin = async (username, password, setLogError) => {
  console.log(`${username} | ${password}`)
  try {
    let response = await user_api.post("login/", {
      username: username,
      password: password,
    });
    console.log(response)

    let { user, token } = response.data;
    localStorage.setItem("Token", token);
    user_api.defaults.headers.common["Authorization"] = `Token ${token}`;
    console.log(`Logged in ${user} ${response.status}`, token);
    console.log("Full response data:", response.data);
    return { user: username, response: response.status};
  } catch (error) {
    console.error("Login error caught: ", error);
    setLogError(`   Invalid username or password`);
    return null;
  }
};

export const userLogout = async () => {
  const response = await user_api.post("user/logout/");
  if (response.status == 204) {
    localStorage.removeItem("token");
    delete user_api.defaults.headers.common["Authorization"];
    console.log("user logged out");

    return true;
  }
  console.log("error loggin user out");
  return false;
};

export const confirmUser = async () => {

  let token = localStorage.getItem("token");
  if (token) {
    user_api.defaults.headers.common["Authorization"] = `token ${token}`;
    let response = await user_api.get("info/");
    if(response.status == 401) {
      return false
    }
    console.log(response)
    if (response.status == 200) {
      const { username } = response.data;
      console.log(
        `user ${username} | ${response.status} | user verified}`
      );
      return { username: username};
    }
  }
  return false;
};
