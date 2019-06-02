import React from 'react'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const style = {
      height: '10px',
      // height: '50px',
      // width: '100%',
      // fontSize: '22px',
      // color: '#333',
      // letterSpacing: '-0.25px',
      // lineHeight: '50px',
      // paddingLeft: '10px',
      // marginBottom: '10px',
      // background: '#5F6ADC'
    }
    return (
      <div>
        {/* <div style={style}>{this.props.data}</div> */}
        <div style={style}></div>
      </div>
    )
  }
}