import * as api from "../api";
import { setCurrentUser } from "./currentUser";

export const signup = (authData, navigate) => async (dispatch) => {
  try {
    // console.log("hello");
    const { data } = await api.signUp(authData)
    console.log("data"+data);
    dispatch({ type: 'AUTH', data });

    dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))))
    navigate('/')
    return data;
  } catch (error) {
    console.log(error)
  }
}

export const login = (authData, navigate) => async (dispatch) => {
  try {
    // console.log("j");
    const { data } = await api.logIn(authData)
    console.log(data);
    await dispatch({ type: 'AUTH', data })
    await dispatch(setCurrentUser(JSON.parse(localStorage.getItem("Profile"))))
    navigate('/')
    return data;
  } catch (error) {
    console.log(error)
  }
}


