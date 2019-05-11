import React from 'react'
import { HashRouter as Router, Route } from "react-router-dom"
import Home from './home/Home'
import Information from './information/Information'
import BloodPressure from './bloodPressure/BloodPressure'
import BloodSugar from './bloodSugar/BloodSugar'
import Weight from './weight/Weight'
import Exercise from './exercise/Exercise'
import Daily from './daily/Daily'
import Medicine from './medicine/Medicine'
import Archives from './archives/Archives'
import Remind from './remind/Remind'

export default () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/information" component={Information} />
      <Route exact path="/bloodPressure" component={BloodPressure} />
      <Route exact path="/bloodSugar" component={BloodSugar} />
      <Route exact path="/weight" component={Weight} />
      <Route exact path="/exercise" component={Exercise} />
      <Route exact path="/daily" component={Daily} />
      <Route exact path="/medicine" component={Medicine} />
      <Route exact path="/archives" component={Archives} />
      <Route exact path="/remind" component={Remind} />
    </div>
  </Router>
)