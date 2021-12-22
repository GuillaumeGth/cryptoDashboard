import Dashboard from './pages/dashboard';
import './App.css';
import { Provider } from 'react-redux';
import store from './Redux/store';
import {
  Routes,
  Route
} from "react-router-dom";
import Menu from "./components/Menu/Menu";
function App() {
  return (
    <Provider store={store}>
    <div className="App">     
        <div className="flex">   
          <Menu />       
          <Routes>
            <Route path="/" element={ <Dashboard />} />                         
          </Routes>
        </div>
    </div>
    </Provider>
  );
}

export default App;
