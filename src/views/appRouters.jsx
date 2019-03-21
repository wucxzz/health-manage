import React from 'react'
import { HashRouter as Router, Route } from "react-router-dom"
import Home from './home/Home'
import Statistics from './statistics/Statistics'

export default () => (
  <Router>
    <div>
      <Route exact path="/" component={Home} />
      <Route exact path="/statistics" component={Statistics} />
    </div>
  </Router>
)