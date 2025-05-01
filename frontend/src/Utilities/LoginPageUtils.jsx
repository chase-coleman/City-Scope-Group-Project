import axios from "axios";

// --------------- API instance for all user functions ----------------

export const user_api = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/user/",
});


// --------------- User Registration function ----------------
export const userRegistration = async (email, firstName, lastName, password, setLogError ) => {
  if(firstName == "" || lastName == "" || password == "" || email == "") {
    setLogError("I know four fields is a lot to ask but do it anyway")
    return false
  }
  
  const regex = new RegExp("[a-zA-Z].+@[a-zA-Z].+.[a-zA-Z].+");  //Verify Email is in a valid email format
  if (!regex.test(email)) {
    setLogError("Invalid email address");
    return;
  }

    let response = await user_api.post("signup/", {
      first_name: firstName,
      last_name: lastName,
      email: email,
      password: password,
    },
    {
      validateStatus: (status) => true, // Accept all status codes, because axios likes to throw 
                                        // errors for most non "GTG status codes
    });
    console.log(response.status)

    if (response.status == 409 || response.status == 226) {
      setLogError("Username already exists, try another");
      return;
    } else if (response.status === 201) {
      const { user } = response.data;
      return userLogin(email, password, setLogError);
    } else {
      setLogError("Registration failed for an unknown reason")
    }
    // console.log(`${response.status} ${response["user"]}`);
};

// --------------- User Login function ----------------
export const userLogin = async (username, password, setLogError) => {
  // console.log(`${username} | ${password}`)
  if (username == "" || password == ""){
    setLogError("Username and password are required")
  return false
  }
  try {
    let response = await user_api.post("login/", {
      username: username,
      password: password,
    },
    {
      validateStatus: (status) => true,
    });
    if(response.status != 200) {
      setLogError("Invalid user credentials")
      return false
    }
    // console.log(response)

    let { user, token } = response.data;
    localStorage.setItem("token", token);
    user_api.defaults.headers.common["Authorization"] = `token ${token}`;
    // console.log(`Logged in ${user} ${response.status}`, token);
    // console.log("Full response data:", response.data);
    return { user: username, response: response.status};
  } catch (error) {
    console.error("Login error caught: ", error);
    setLogError(`   Invalid username or password`);
    return null;
  }
};

// --------------- User logout function ----------------
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

// --------------- valid user check for navigation ----------------
export const confirmUser = async () => {
  let token = localStorage.getItem("token");
  if (token) {
    user_api.defaults.headers.common["Authorization"] = `token ${token}`;
    let response = await user_api.get("info/");
    if(response.status == 401) {
      console.log("Invalid user")
      return false
    }
    // console.log(response)
    if (response.status == 200) {
      const { username } = response.data;
      // console.log(
      //   `user ${username} | ${response.status} | user verified}`
      // );
      return { username: username};
    }
  }
  return false;
};
