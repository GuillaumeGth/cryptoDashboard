import store from "../Redux/store";
const isConencted = () =>  {    
    return store.getState().userReducer?.email === null;
}
export default isConencted;