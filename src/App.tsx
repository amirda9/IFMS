import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import * as pages from '~/pages';
import {useAppSelector} from '~/hooks';
import {RedirectAfterLogin} from '~/components';
import {selectElement} from '~/util';
import '~/styles/index.scss';
import 'leaflet/dist/leaflet.css';
import {MainLayout} from '~/layout';
import ErrorPage404 from './pages/errors/404';
import ErrorPage403 from './pages/errors/403';
import {UserRole} from './constant/users';

function App() {
  const auth = useAppSelector(
    state =>
      state.http.refresh?.httpRequestStatus === 'success' ||
      state.http.login?.httpRequestStatus === 'success',
  );

  const loggedInUser = useAppSelector(state => state.http.verifyToken?.data);

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
            path="/regions/:regionId/edit-stationlist"
            Component={pages.RegionstationlisteditPage}
          />
          <Route
            path="/regions/:regionId/edit-linklist"
            Component={pages.RegionlinklisteditPage}
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
            <Route path="create" Component={pages.LinkCreatePage} />
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

          <Route path="/monitoring">
            <Route path="status" Component={pages.status} />
            <Route path="test-on-demand" Component={pages.testondemand} />
            <Route path="alarms" Component={pages.alarms} />
            <Route
              path="status/:statusId"
              Component={pages.monitoringstatusDetail}
            />
          </Route>

          <Route path="/reporting">
            <Route path="dashboard" Component={pages.dashboard} />
            <Route path="reports" Component={pages.reportsRoutesLayout}>
              <Route path=":reportid" Component={pages.reports} />
              <Route
                path="reportsdata"
                Component={pages.SinglereportsRouteLayout}>
                <Route index Component={pages.reportsDetailpage} />
                <Route path=":id" Component={pages.reportsDetailmodal} />
                <Route path="Parameters" Component={pages.reportsparameters} />
              </Route>
            </Route>
            {/* <Route path="reports" Component={pages.reports}/> */}
            <Route path="reportschedule" Component={pages.reportscheduleLayout} >
            <Route
                path="reportscheduledetail"
                Component={pages.SinglereportsscheduleRouteLayout}>
                <Route index Component={pages.reportscheduleDetail} />
                <Route path="reportsscheduleUsers" Component={pages.reportsscheduleUsers} />
                <Route path="schedulereports" Component={pages.schedulereports} />
              </Route>
            </Route>
            <Route path="resultbrowser" Component={pages.resultbrowser} />
          </Route>

          <Route path="/config">
            <Route
              path="system-maintenance"
              Component={pages.Systemmaintenance}></Route>

            <Route
              path="all-rtu-status"
              Component={pages.AllRTUsStatus}></Route>

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

            <Route path="optical-routes" Component={pages.OpticalRoutesLayout}>
              <Route
                path="create/:id"
                Component={pages.OpticalRouteCreatePage}
              />
              <Route
                path=":opticalRouteId"
                Component={pages.SingleOpticalRouteLayout}>
                <Route index Component={pages.OpticalRouteDetailsPage} />

                <Route path="route" Component={pages.OpticalRouteRoutePage} />
                <Route
                  path="test-setup"
                  Component={pages.OpticalRouteTestSetupPage}>
                  <Route path=":testId" Component={pages.TestSetupDetailsModal}>
                    <Route index Component={pages.TestDetailsParameters} />
                    <Route
                      path="learning"
                      Component={pages.TestDetailsLearning}
                    />
                    <Route
                      path="test-program"
                      Component={pages.TestDetailsTestProgram}
                    />
                    <Route path="status" Component={pages.TestDetailsStatus} />
                  </Route>
                </Route>
                <Route
                  path="test-history"
                  Component={pages.OpticalRouteTestHistoryPage}
                />
              </Route>
            </Route>
            <Route path="chart/:id/:id" Component={pages.Chart} />

            <Route path="remote-test-units" Component={pages.RtuLayout}>
              <Route path=":rtuId" Component={pages.SingleRtuLayout}>
                <Route index Component={pages.RtuDetailsPage} />
                <Route path="ports" Component={pages.RtuPortsPage} />
              </Route>
              <Route path="create/:id" Component={pages.RtuCreatepage} />
            </Route>
          </Route>

          <Route path="/users" Component={pages.UsersLayout}>
            <Route
              path="register"
              Component={selectElement(
                loggedInUser?.role === UserRole.SUPER_USER,
                pages.UserRegisterPage,
                ErrorPage403,
              )}
            />
            <Route path=":userId" Component={pages.SingleUserLayout}>
              <Route index Component={pages.UserDetailsPage} />
              <Route path="access" Component={pages.UserAccessPage} />
              <Route path="edit-access" Component={pages.UserAccessPage} />
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
              <Route
                path="edit-members"
                Component={pages.EditGroupMembersPage}
              />
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
