import { SET_ALERT, REMOVE_ALERT } from "./Type";
import { v4 as uuid } from "uuid";

export const setAlert = (msg, alerType) => (dispatch) => {
  const id = uuid.v4();

  dispatch({
    type: SET_ALERT,
    payload: { msg, alerType, id },
  });
};
