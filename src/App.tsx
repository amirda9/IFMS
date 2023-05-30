import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './styles/index.scss';
import {Login} from '~/pages';

function App() {
  return (
    <Router>
      <Switch>
        <Route component={Login} path={'/'} exact />
      </Switch>
    </Router>
  );
}

export default App;
