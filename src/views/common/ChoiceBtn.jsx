import React from 'react';
import './ChoiceBtn.less'

export default class ChoiceBtn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: props.defaultActive,      // 活动的按钮, 默认1
    }
  }

  // 点击按钮的事件处理
  clickBtn = (e) => {
    // 如果点击的是按钮
    if (e.target.dataset.active) {
      this.setState({
        active: e.target.dataset.active
      })
      // 回调函数，把点击的结果告诉父组件
      this.props.clickBtn(e.target.dataset.active)
    }
  }
  render() {
    return (
      <div className="choice-btn" onClick={this.clickBtn}>
        <div className={(this.state.active === '1' ? 'active' : '')}
            data-active={1}
          >{this.props.data[0]}</div>
        <div className={(this.state.active === '2' ? 'active' : '')}
            data-active={2}
          >{this.props.data[1]}</div>
        <div className={(this.state.active === '3' ? 'active' : '')}
            data-active={3}
          >{this.props.data[2]}</div>
      </div>
    )
  }
}