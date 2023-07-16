import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import * as pages from '~/pages';
import {useAppSelector} from '~/hooks';
import {RedirectAfterLogin} from '~/components';
import {selectElement} from '~/util';
import "~/styles/index.scss";
function App() {
  const auth = useAppSelector(
    state =>
      state.http.refresh?.httpRequestStatus === 'success' ||
      state.http.login?.httpRequestStatus === 'success',
  );
  return (
    <Router>
      <Routes>
        <Route path={'/'} Component={selectElement(auth, pages.UsersPage)} />
        <Route
          path={'/login'}
          Component={selectElement(!auth, pages.LoginPage, RedirectAfterLogin)}
        />
        <Route
          path={'/users'}
          Component={selectElement(auth, pages.UsersPage)}
        />
      </Routes>
    </Router>
  );
}

export default App;
