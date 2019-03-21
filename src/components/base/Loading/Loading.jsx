/**
 * 数据加载中动画提示组件
 * 关闭动画会延时一定时间在关闭
 */
import React from 'react';
import './Loading.less'

export default class Loading extends React.Component {
  constructor(props) {
    super(props);
    this.delay = 100 ;  // 延迟多久关闭 单位毫秒
    this.state = {
      showLoading: true,
    }
  };

  componentWillReceiveProps(nextProps){
    if (nextProps.showLoading !== this.props.showLoading) {
      if (nextProps.showLoading === false) {
        // 延时0.3秒关闭动画
        setTimeout(() => {
          this.setState({ showLoading: false, });  // 关闭加载动画
        }, this.delay)
      } else {
        this.setState({ showLoading: true, });
      }
    }
  }


  render() {
    let loadingHtml;
    if (this.state.showLoading) {
      loadingHtml = (
        <div className="loading">
          <div className="spinner">
            <div className="spinner-container container1">
              <div className="circle1"></div>
              <div className="circle2"></div>
              <div className="circle3"></div>
              <div className="circle4"></div>
            </div>
            <div className="spinner-container container2">
              <div className="circle1"></div>
              <div className="circle2"></div>
              <div className="circle3"></div>
              <div className="circle4"></div>
            </div>
            <div className="spinner-container container3">
              <div className="circle1"></div>
              <div className="circle2"></div>
              <div className="circle3"></div>
              <div className="circle4"></div>
            </div>
            <div className="loading-content">数据读取中...</div>
          </div>
        </div>
      )
    }
    return (
      <div className="loading-position">
        {/* 数据显示 */}
        {this.props.children}
        {/* 数据加载中动画 */}
        {loadingHtml}
      </div>
    )
  }
}