import {
  registrationPending,
  registrationSuccess,
  registrationError,
} from "./userRegestrationSlice";

import { userRegistration } from "../../api/userApi";
//import { useHistory, useLocation } from "react-router-dom";
//const history = useHistory();
export const newUserRegistration = (frmDt) => async (dispatch) => {
  
  //let location = useLocation();
  try {
    dispatch(registrationPending());

    const result = await userRegistration(frmDt);
    if(result.status === "notverified"){
      //history.push("/verification");
      //dispatch(registrationSuccess(result.message))
      window.location.href = '/verification'
    }
    else{
      dispatch(registrationError(result.message));
    }
    
    console.log(result);
  } catch (error) {
    dispatch(registrationError(error.message));
  }
};
