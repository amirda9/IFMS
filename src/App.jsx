import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeScreens from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import Dashboard from "./layout/Dashboard";
import './assets/fonts/Sansation-Bold.ttf';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomeScreens} exact />
        <Route path="/login" component={LoginScreen} exact />
        <Route path="/dashboard" component={Dashboard} exact >
            
        </Route>

      </Switch>
    </Router>
  );
}

export default App;
