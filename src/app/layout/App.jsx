import React, { Component } from 'react';
import {Container} from 'semantic-ui-react'
import { Route, Switch} from 'react-router-dom';
import EventDashboard from '../../features/event/EventDashboard/EventDashboard';
import NavBar from '../../features/nav/NavBar/NavBar';
import EventDetailedPage from "../../features/event/EventDetailed/EventDetailedPage";
import PeopleDashboard from "../../features/user/PeopleDashboard/PeopleDashboard";
import UserDetailedPage from "../../features/user/UserDetailed/UserDetailedPage";
import SettingsDashboard from "../../features/user/Settings/SettingsDashboard";
import EventForm from "../../features/event/EventForm/EventForm";
import HomePage from "../../features/home/HomePage";
import ModalManager from "../../features/modals/ModalManager";
import {UserIsAuthenticated} from "../../features/auth/AuthWrapper";
import FourOhFour from "./FourOhFour";
import LegalMention from "../../features/legal/LegalMention";
import ConfidentialityPolitic from "../../features/legal/ConfidentialityPolitic";

class App extends Component {
    /**
     *
     * @returns {*}
     */
  render() {
    return (
      <div>
          <ModalManager/>
          <Switch>
              <Route exact path='/' component={HomePage}/>
          </Switch>
          <Route path='/(.+)' render={() => (
              <div>
                  <NavBar/>
                  <Container className='main'>
                      <Switch>
                          <Route path='/events' component={UserIsAuthenticated(EventDashboard)}/>
                          <Route path='/event/:id' component={UserIsAuthenticated(EventDetailedPage)}/>
                          <Route path='/manage/:id' component={UserIsAuthenticated(EventForm)}/>
                          <Route path='/people' component={UserIsAuthenticated(PeopleDashboard)}/>
                          <Route path='/profile/:id' component={UserIsAuthenticated(UserDetailedPage)}/>
                          <Route path='/settings' component={UserIsAuthenticated(SettingsDashboard)}/>
                          <Route path='/createEvent' component={UserIsAuthenticated(EventForm)}/>
                          <Route path='/legalMentions' component={LegalMention}/>
                          <Route path='/confidentialityPolitic' component={ConfidentialityPolitic} />
                          <Route path='/error' component={FourOhFour}/>
                          <Route component={FourOhFour}/>
                      </Switch>
                  </Container>
              </div>
          )}/>
      </div>
    );
  }
}

export default App;
