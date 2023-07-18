import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import * as pages from '~/pages';
import {useAppSelector} from '~/hooks';
import {RedirectAfterLogin} from '~/components';
import {selectElement} from '~/util';
import '~/styles/index.scss';
function App() {
  const auth = useAppSelector(
    state =>
      state.http.refresh?.httpRequestStatus === 'success' ||
      state.http.login?.httpRequestStatus === 'success',
  );
  return (
    <Router>
      <Routes>
        <Route path="/" Component={selectElement(auth, RedirectAfterLogin)} />
        <Route
          path="/login"
          Component={selectElement(!auth, pages.LoginPage, RedirectAfterLogin)}
        />
        <Route
          path="/networks"
          Component={selectElement(auth, pages.NetworksPage)}>
          <Route path=":networkId" Component={pages.NetworkEmpty}>
            <Route path="detail" Component={pages.NetworkDetail} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
