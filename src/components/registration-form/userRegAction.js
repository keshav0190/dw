import {
  registrationPending,
  registrationSuccess,
  registrationError,
} from "./userRegestrationSlice";

import { userRegistration } from "../../api/userApi";
export const newUserRegistration = (frmDt) => async (dispatch) => {
  
  try {
    dispatch(registrationPending());

    const result = await userRegistration(frmDt);
    if(result.status_code === 403) {//not verified user
      dispatch(registrationSuccess());
      console.log(result.data.id);
      sessionStorage.setItem("id", result.data.id);
      window.location.href = '/verification'
    }
    else{
      dispatch(registrationError(result.message));
    }
  } catch (error) {
    dispatch(registrationError(error.message));
  }
};
