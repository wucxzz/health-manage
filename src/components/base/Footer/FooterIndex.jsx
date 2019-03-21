import React from 'react'

export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  render() {
    const style = {
      height: '34px',
      fontSize: '12px',
      color: '#999999',
      letterSpacing: '-0.25px',
      textAlign: 'center',
      lineHeight: '17px',
      paddingTop: '40px'
    }
    return (
      <div className="footer" style={{height: '114px', width: '100%', background: '#F2F2F2'}}>
        <div className="content" style={style}>
          更多收入明细查询及导出等功能<br />
          请登录 bi.baijiahulian.com 使用
        </div>
      </div>
    )
  }
}