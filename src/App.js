import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Sidebar from './Components/Shared/Sidebar'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import 'devextreme/dist/css/dx.light.css';
import 'bootstrap'


// PAGES
import First from "./pages/First";
import Second from "./pages/Second";
import Third from "./pages/Third";

function App() {
  return (
    <div>
     <Router>
        <Sidebar />
        <Switch>
          <Route path="/" exact component={First} />
          <Route path="/Reports" component={Second} />
          <Route path="/Products" component={Third} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
