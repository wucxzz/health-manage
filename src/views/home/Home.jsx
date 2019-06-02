import React from 'react'
import { Link } from 'react-router-dom'

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="layout">
        <br/> <br/> <br/>
        <Link to="/information">信息</Link><br/>
        <Link to="/bloodPressure">血压</Link><br/>
        <Link to="/bloodSugar">血糖</Link><br/>
        <Link to="/weight">体重</Link><br/>
        <Link to="/exercise">运动</Link><br/>
        <Link to="/medicine">用药</Link><br/>
        <Link to="/archives">档案</Link><br/>
        <Link to="/remind">提醒</Link><br/>
        <Link to="/message">常识</Link><br/>
      </div>
    );
  }
}
