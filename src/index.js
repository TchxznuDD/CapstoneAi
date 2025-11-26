import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Computer from "./views/Computer";
import LoginPage from "./views/login-page";
import ServerStatus from "./views/ServerStatus";
import BackupManagement from "./views/BackupManagement";
import BackupHistory from "./views/BackupHistory";
import Settings from "./views/Settings";
import Firewall from "./views/Firewall";
import UserManual from "./views/UserManual";
import NotFound from "./views/not-found";

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/" component={LoginPage} />
      <Route path="/computer" component={Computer} />
      <Route path="/server-status" component={ServerStatus} />
      <Route path="/backup/history" component={BackupHistory} />
      <Route path="/backup" component={BackupManagement} />
      <Route path="/settings" component={Settings} />
      <Route path="/firewall" component={Firewall} />
      <Route path="/user-manual" component={UserManual} />
      <Route component={NotFound} />
    </Switch>
  </Router>,
  document.getElementById("app")
);
