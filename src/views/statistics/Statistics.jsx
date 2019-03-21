import React from 'react'
import { Toast } from 'antd-mobile'
import Footer from '../../components/base/Footer/FooterIndex'   // 页面脚部组件
import Overview from './Overview/Overview'                      // 收入总览组件
import Trend from './Trend/Trend'                               // 收入走势组件
import Proportion from './Proportion/Proportion'                // 收入占比组件
import DataSetting from './DataSetting/DataSetting'             // 数据选择组件
import moment from 'moment'
import API from '../../components/httpAPI'
import './Statistics.less'
import watermark from '../waterMark'

export default class Statistics extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      businessLine: null,
      oneLevelClass: null,
      revenueType: 2,
      timeType: 1,
      timeStart: moment().startOf('day').valueOf(),
      timeEnd: moment().valueOf(),
      dateTitleValue: null,
      roleData: null
    }
  }

  componentDidMount() {
    // 获取用户数据
    API.auth.getAuth()
    .then(res => {
      if (res.status === 200) {
        const data = res.data.data;
        const array = [];
        data.hasRoles.forEach(e => { array.push({ label: e.name, value: e.tag }) });
        this.setState({
          roleData: array,
          selectRoleContent: data.currentRole.name,
          roleValue: [data.currentRole.tag]
        })
        let name = res.data.data.displayName;
        let mobile = res.data.data.mobile.substr(7, 4);
        watermark({
          content: name + mobile,
          container: document.getElementsByClassName('layout')[0]
        });
      } else {
        console.error('获取用户信息失败!');
        Toast.fail('获取用户信息失败!', 3);
      }
    })
    .catch(err => {
      console.error('获取用户信息出错， err：', err);
      Toast.fail('服务器错误!获取用户信息失败!', 3);
    })
  }

  // 数据筛选组件收款类型及业务线回调
  getRevenueBusiType = (revenue, business) => {
    this.setState({
      revenueType: revenue,
      businessLine: business
    }, () => {
      // 调用子组件方法，更新数据和页面
      this.refs.overview.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)
      this.refs.trend.update(this.state.revenueType, this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.businessLine)
      this.refs.proportion.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)
    })
  }
  // 数据筛选组件日期类型回调
  getDate = (date, type) => {
    if (date) {
      if (date[1] > moment().valueOf()) date[1] = moment().valueOf();
      this.setState({
        timeType: type,
        timeStart: date[0],
        timeEnd: date[1]
      }, () => {
        // 调用子组件方法，更新数据和页面
        this.refs.overview.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)
        this.refs.trend.update(this.state.revenueType, this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.businessLine)
        this.refs.proportion.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine) 
      })
    }
  }
  // 收入总览组件中下方按钮的回调
  handleTime = (e, timetype, timestart, timeend) => {
    let start = null;
    let end = null;
    let value = null;
    const typeArr = ['d', 'w', 'M', 'Q', 'y'];
    if(e === 'prev') {
      start = moment(timestart).subtract(1, typeArr[timetype - 1]);
      end = moment(timestart);
    }
    if(e === 'next') {
      start = moment(timestart).add(1, typeArr[timetype - 1]);
      end = moment(timeend).add(1, typeArr[timetype - 1]);
      if (start.valueOf() > moment().hour(0).valueOf()) return
    }
    switch(timetype) {
      case 1:
        value = [start.year(), start.month() + 1, start.date()]
        break;
      case 2:
        value = [start.year(), start.week()]
        break;
      case 3:
        value = [start.year(), start.month() + 1]
        break;
      case 4:
        value = [start.year(), start.quarter()]
        break;
      default:
        value = [start.year()]
    }
    this.setState({
      timeStart: start.valueOf(),
      timeEnd: end.valueOf() > moment().valueOf() ? moment().valueOf() : end.valueOf(),
      dateTitleValue: value,
      timeType: timetype
    }, () => {
      this.refs.overview.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)
      this.refs.trend.update(this.state.revenueType, this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.businessLine)
      this.refs.proportion.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)   
      this.refs.datesetting.update(this.state.dateTitleValue, this.state.timeType)
    })
  }
  // 收入占比组件中右侧展开按钮的回调
  handleBusinessLine = (business) => {
    this.setState({
      businessLine: business
    }, () => {
      // 调用子组件方法，更新数据和页面
      this.refs.overview.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine)
      this.refs.trend.update(this.state.revenueType, this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.businessLine)
      this.refs.proportion.update(this.state.timeType, this.state.timeStart, this.state.timeEnd, this.state.revenueType, this.state.businessLine) 
      this.refs.datesetting.updateBusiContent(this.state.businessLine)  
    })
  }

  render() {
    return (
      <div className="layout">
        <div className="statistics-data-set">
          <DataSetting 
            getRevenueBusiType={this.getRevenueBusiType}
            getDate={this.getDate}
            dateTitleValue={this.state.dateTitleValue}
            initValue={this.state.initValue}
            timeType={this.state.timeType}
            roleData={this.state.roleData}
            selectRoleContent={this.state.selectRoleContent}
            roleValue={this.state.roleValue}
            ref="datesetting"
          />
        </div>
        <div className="statistic-whitespace"></div>
        <div className="content">
          <div className="statistics-overview">
            <Overview 
              handleTime={this.handleTime} 
              businessLine={this.state.businessLine}
              oneLevelClass={this.state.oneLevelClass}
              revenueType={this.state.revenueType}
              timeType={this.state.timeType}
              timeStart={this.state.timeStart}
              timeEnd={this.state.timeEnd}
              ref="overview"
            />
          </div>
          <div className="statistics-trend">
            <Trend 
              businessLine={this.state.businessLine}
              revenueType={this.state.revenueType}
              timeType={this.state.timeType}
              timeStart={this.state.timeStart}
              timeEnd={this.state.timeEnd}
              ref="trend"
            />
          </div>
          <div className="statistics-proportion">
            <Proportion 
              handleBusinessLine={this.handleBusinessLine} 
              businessLine={this.state.businessLine}
              revenueType={this.state.revenueType}
              timeType={this.state.timeType}
              timeStart={this.state.timeStart}
              timeEnd={this.state.timeEnd}
              ref="proportion"
            />
          </div> 
        </div>
        <div className="footer">
          <Footer />
        </div>
      </div>
    );
  }
}
