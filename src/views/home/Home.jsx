import React from 'react'
import { Link } from 'react-router-dom'

export default class App extends React.Component{
  constructor(props) {
    super(props);
    this.state = {

    }
  }


  render() {
    return (
      <div className="layout">
        <br/> <br/> <br/>
        <Link to="/statistics">点我进入数据统计页面</Link>
      </div>
    );
  }
}
