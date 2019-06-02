import React from 'react'
import '../common/common.less'
import { List, Switch, Toast, WhiteSpace } from 'antd-mobile'
import API from '../../components/httpAPI'

export default class BloodPressure extends React.Component{
  constructor(props) {
    super(props);
    this.yaodata = null;
    this.state = {
    };

  }

  componentDidMount() {
    API.health.stateGet()
      .then( res => {
        if (res.data.code == 0 && res.data.data[0]) {
          let stateList = res.data.data[0].split('');
          this.setState({
            checked1: Number(stateList[0]),
            checked2: Number(stateList[1]),
            checked3: Number(stateList[2]),
            checked4: Number(stateList[3]),
            checked5: Number(stateList[4]),
            checked6: Number(stateList[5]),
            checked7: Number(stateList[6]),
            checked8: Number(stateList[7]),
            checked9: Number(stateList[8]),
            checked10: Number(stateList[9]),
            checked11: Number(stateList[10]),
            checked12: Number(stateList[11]),
          })
        } else {
        }
      })
      .catch(err => {
        console.error('服务器出错获取状态数据失败');
        Toast.fail('服务器错误!获取状态数据失败!', 3);
      })
  }

  remindSave = () => {
    let {checked1, checked2, checked3, checked4, checked5, checked6, checked7, checked8, checked9, checked10, checked11, checked12, } = this.state;
    let stateArr = [];
    stateArr.push(this.stateToNum(checked1));
    stateArr.push(this.stateToNum(checked2));
    stateArr.push(this.stateToNum(checked3));
    stateArr.push(this.stateToNum(checked4));
    stateArr.push(this.stateToNum(checked5));
    stateArr.push(this.stateToNum(checked6));
    stateArr.push(this.stateToNum(checked7));
    stateArr.push(this.stateToNum(checked8));
    stateArr.push(this.stateToNum(checked9));
    stateArr.push(this.stateToNum(checked10));
    stateArr.push(this.stateToNum(checked11));
    stateArr.push(this.stateToNum(checked12));
    let params = {state: stateArr.join('')}
    API.health.stateSave(params)
      .then( res => {
        if (res.data.code == 0) {
          Toast.info('保存成功!', 1);
        } else {
          console.error('保存状态数据失败！');
          Toast.fail('保存状态数据失败!', 3);
        }
      })
      .catch(err => {
        console.error('服务器出错保存状态数据失败');
        Toast.fail('服务器错误!保存状态数据失败!', 3);
      })
  }

  stateToNum = (checked) => {
    if (checked) {
      return 1;
    } else {
      return 0
    }
  }

  render() {
    return (
      <div className="layout">
        {/* <Header data={'提醒设置'}></Header> */}
        <div className="remind-header">
          <span className="remind-img">
            <img src={require('../../assets/images/time.png')} alt=""/>
          </span>
          <span className="remind-content"> 测量</span>
        </div>
        <div className="medicine-add-title">
          <span>血压</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked1}
            onChange={() => {
              this.setState({
                checked1: !this.state.checked1,
              });
            }}
          />}
        >血压(上午)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked2}
            onChange={() => {
              this.setState({
                checked2: !this.state.checked2,
              });
            }}
          />}
        >血压(下午)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked3}
            onChange={() => {
              this.setState({
                checked3: !this.state.checked3,
              });
            }}
          />}
        >血压(晚上)</List.Item>
        <div className="medicine-add-title">
          <span>血糖</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked4}
            onChange={() => {
              this.setState({
                checked4: !this.state.checked4,
              });
            }}
          />}
        >血糖(早饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked5}
            onChange={() => {
              this.setState({
                checked5: !this.state.checked5,
              });
            }}
          />}
        >血糖(早饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked6}
            onChange={() => {
              this.setState({
                checked6: !this.state.checked6,
              });
            }}
          />}
        >血糖(午饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked7}
            onChange={() => {
              this.setState({
                checked7: !this.state.checked7,
              });
            }}
          />}
        >血糖(午饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked8}
            onChange={() => {
              this.setState({
                checked8: !this.state.checked8,
              });
            }}
          />}
        >血糖(晚饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked9}
            onChange={() => {
              this.setState({
                checked9: !this.state.checked9,
              });
            }}
          />}
        >血糖(晚饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked10}
            onChange={() => {
              this.setState({
                checked10: !this.state.checked10,
              });
            }}
          />}
        >血糖(睡前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked11}
            onChange={() => {
              this.setState({
                checked11: !this.state.checked11,
              });
            }}
          />}
        >血糖(凌晨)</List.Item>
        <div className="medicine-add-title">
          <span>体重</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked12}
            onChange={() => {
              this.setState({
                checked12: !this.state.checked12,
              });
            }}
          />}
        >体重</List.Item>
        <div className="button-wrap button-wrap-cover">
          <span className="button-item" onClick={this.cancel}>取消</span>
          <span onClick={this.remindSave}>保存</span>
        </div>
        <WhiteSpace size="xl" />
        <WhiteSpace size="xl" />
        <WhiteSpace size="xl" />
      </div>
    );
  }
}
