import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import * as pages from '~/pages';
import {useAppSelector} from '~/hooks';
import {RedirectAfterLogin} from '~/components';
import {selectElement} from '~/util';
import '~/styles/index.scss';
import 'leaflet/dist/leaflet.css';
import {MainLayout} from '~/layout';
import ErrorPage404 from './pages/errors/404';

function App() {
  const auth = useAppSelector(
    state =>
      state.http.refresh?.httpRequestStatus === 'success' ||
      state.http.login?.httpRequestStatus === 'success',
  );
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          Component={selectElement(!auth, pages.LoginPage, RedirectAfterLogin)}
        />

        <Route path="/" Component={selectElement(auth, MainLayout)}>
          <Route
            path="/networks/:networkId/edit-access"
            Component={pages.NetworkAccessEditPage}
          />

          <Route
            path="/networks"
            Component={selectElement(auth, pages.NetworksPage)}>
            <Route path="create" Component={pages.NetworkCreatePage} />
            <Route path=":networkId" Component={pages.NetworkEmptyPage}>
              <Route path="" Component={pages.NetworkDetailPage}>
                <Route path="history" Component={pages.NetworkHistoryPage} />
              </Route>
              <Route path="Access" Component={pages.NetworkAccessPage} />
              <Route path="gis" Component={pages.NetworkGISPage} />
            </Route>
          </Route>

          <Route
            path="/regions/:regionId/edit-access"
            Component={pages.RegionAccessEditPage}
          />

          <Route
            path="/regions"
            Component={selectElement(auth, pages.RegionsPage)}>
            <Route path="create" Component={pages.RegionCreatePage} />
            <Route path=":regionId" Component={pages.RegionEmptyPage}>
              <Route path="" Component={pages.RegionDetailPage} />
              <Route path="access" Component={pages.RegionAccessPage} />
              <Route path="stations" Component={pages.RegionStationsPage} />
              <Route path="links" Component={pages.RegionLinksPage} />
            </Route>
          </Route>

          <Route
            path="/stations/:stationId/edit-access"
            Component={pages.StationEditViewerPage}
          />
          <Route path="/stations" Component={pages.StationsPage}>
            <Route path="create" Component={pages.StationCreatePage} />
            <Route path=":stationId" Component={pages.StationEmptyPage}>
              <Route path="" Component={pages.StationDetailPage} />
              <Route path="access" Component={pages.StationAccessPage} />
            </Route>
          </Route>

          <Route
            path="/links/:linkId/edit-access"
            Component={pages.LinkEditViewersPage}
          />
          <Route path="/links" Component={pages.LinksPage}>
            <Route path=":linkId" Component={pages.LinkEmptyPage}>
              <Route path="" Component={pages.LinkDetailPage} />
              <Route path="access" Component={pages.LinkAccessPage} />
              <Route
                path="cables-segments"
                Component={pages.LinkCablesAndSegmentsPage}
              />
              <Route
                path="ducts-segments"
                Component={pages.LinkDuctsAndSegmentsPage}
              />
              <Route path="points" Component={pages.LinkPointsPage} />
            </Route>
          </Route>

          <Route path="/config">
            <Route
              path="system-settings"
              Component={pages.SystemSettingsLayout}>
              <Route path="optical-route" Component={pages.OpticalRoutePage} />
              <Route path="system" Component={pages.SystemPage} />
              <Route
                path="threshold-settings"
                Component={pages.ThresholdSettingsPage}
              />
              <Route
                path="monitoring-test"
                Component={pages.MonitoringTestPage}
              />
              <Route
                path="proactive-maintenance-test"
                Component={pages.ProactiveMaintenanceTestPage}
              />
            </Route>
            <Route path="alarm-types" Component={pages.AlarmTypesLayout}>
              <Route path=":alarmId" Component={pages.SingleAlarmTypeLayout}>
                <Route index Component={pages.AlarmTypeDetailsPage} />
                <Route
                  path="definition"
                  Component={pages.AlarmTypeDefinitionPage}
                />
                <Route path="content" Component={pages.AlarmTypeContentPage} />
                <Route
                  path="alert-sending"
                  Component={pages.AlarmTypeAlertPage}
                />
                <Route
                  path="automatic-events"
                  Component={pages.AlarmTypeEventPage}
                />
                <Route path="access" Component={pages.AlarmTypeAccessPage} />
              </Route>
            </Route>
          </Route>

          <Route path="/users" Component={pages.UsersLayout}>
            <Route path="register" Component={pages.UserRegisterPage} />
            <Route path=":userId" Component={pages.SingleUserLayout}>
              <Route index Component={pages.UserDetailsPage} />
              <Route path="access" Component={pages.UserAccessPage} />
              <Route path="groups" Component={pages.UserGroupsPage} />
              <Route path="sessions" Component={pages.UserSessionsPage} />
              <Route
                path="authentication"
                Component={pages.UserAuthenticationPage}
              />
            </Route>
          </Route>

          <Route path="/user-groups" Component={pages.UserGroupsLayout}>
            <Route path="create" Component={pages.CreateGroupPage} />
            <Route path=":groupId" Component={pages.SingleGroupLayout}>
              <Route index Component={pages.GroupDetailsPage} />
              <Route path="members" Component={pages.GroupMembersPage} />
            </Route>
          </Route>

          <Route path="/map" Component={pages.MapPage} />

          <Route path="*" Component={ErrorPage404} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
