import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import rootReducer from "../../components/rootReducer"; // Chemin correct

const store = createStore(
  rootReducer,
  applyMiddleware(thunk) // Ajoute le middleware redux-thunk
);

export default store;
