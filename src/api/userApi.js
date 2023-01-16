import axios from "axios";

const rootUrl = "http://localhost:8080/";
const loginUrl = rootUrl + "login";
const userProfileUrl = rootUrl + "user";
const userProfileUrlHome = rootUrl + "user/home";
const logoutUrl = rootUrl + "user/logout";
const newAccessJWT = rootUrl + "tokens";
const userVerificationUrl = userProfileUrl + "/verify";

export const userRegistration = (frmData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.post(userProfileUrl, frmData);

      resolve(res.data);
      if(res.data.status_code === 403) {//not verified user
        sessionStorage.setItem("id", res.data.data.id);
        return ({ status: "notverified", message: 'User not Verified' });
      }
    } catch (error) {
      reject(error);
    }
  });
};
export const userRegistrationVerification = (frmData) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await axios.patch(userVerificationUrl, frmData);

      resolve(res.data);
      if (res.data.status === "success") {
        resolve(res.data);
        
      }
    } catch (error) {
      reject({ status: "error", message: error.error });
    }
  });
};

export const userLogin = async (frmData) => {
    try {
      const res = await axios.post(loginUrl, frmData);
      console.log(res.data);
      if (res.data.status_code === 200) {
        sessionStorage.setItem("accessJWT", res.data.token);
        sessionStorage.setItem("id", res.data.data.id);
        localStorage.setItem(
          "crmSite",
          JSON.stringify({ refreshJWT: res.data.token })
        );
        return ({ status: "success", message: 'Logged in' });
      }
      else if(res.data.status_code === 403) {//not verified user
        return ({ status: "notverified", message: 'User not Verified' });
      }
      else if(res.data.status_code === 401) {//incorrect password
        return({ status: "error", message: 'Incorrect password' });
      }
      else if(res.data.status_code === 404) {//other error
        return({ status: "error", message: 'User not found' });
      }
    } catch (error) {
      console.log('in error');
      return({ status: "error", message: error.message });
    }
};

export const verifyOTP = async (frmData) => {
  try {
    const res = await axios.post(userVerificationUrl, frmData);
    console.log(res.data);
    if (res.data.status_code === 200) {
      return ({ status: "success", message: 'Verified' });
    }
    else if(res.data.status_code === 401) {//incorrect password
      return({ status: "error", message: 'Incorrect OTP' });
    }
  } catch (error) {
    console.log('in error');
    return({ status: "error", message: error.message });
  }
};

export const fetchUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const accessJWT = sessionStorage.getItem("accessJWT");
      const id = sessionStorage.getItem("id");

      if (!accessJWT) {
        reject("Token not found!");
      }

      const res = await axios.get(userProfileUrlHome+'/'+id, {
        headers: {
          Authorization: accessJWT,
        },
      });

      resolve(res.data);
    } catch (error) {
      console.log(error);
      reject(error.message);
    }
  });
};

export const fetchNewAccessJWT = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { refreshJWT } = JSON.parse(localStorage.getItem("crmSite"));

      if (!refreshJWT) {
        reject("Token not found!");
      }

      const res = await axios.get(newAccessJWT, {
        headers: {
          Authorization: refreshJWT,
        },
      });

      if (res.data.status === "success") {
        sessionStorage.setItem("accessJWT", res.data.accessJWT);
      }

      resolve(true);
    } catch (error) {
      if (error.message === "Request failed with status code 403") {
        localStorage.removeItem("crmSite");
      }

      reject(false);
    }
  });
};

export const userLogout = async () => {
  try {
    await axios.delete(logoutUrl, {
      headers: {
        Authorization: sessionStorage.getItem("accessJWT"),
      },
    });
  } catch (error) {
    console.log(error);
  }
};
