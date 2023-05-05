import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import HomeScreens from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={HomeScreens} exact />
        <Route path="/login" component={LoginScreen} exact />
      </Switch>
    </Router>
  );
}

export default App;
