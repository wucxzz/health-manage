import React from 'react'
import '../common/common.less'
import { List, Switch, Toast } from 'antd-mobile'
import API from '../../components/httpAPI'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
export default class BloodPressure extends React.Component{
  constructor(props) {
    super(props);
    this.yaodata = null;
    this.state = {
      date: now,
      checked: true,
    };

  }

  componentDidMount() {

  }

  remindSave = () => {

  }

  render() {
    return (
      <div className="layout">
        <div className="remind-header">
          <span className="remind-img">
            <img src={require('../../assets/images/time.png')} alt=""/>
          </span>
          <span className="remind-content"> 测量提醒</span>
        </div>
        <div className="medicine-add-title">
          <span>血压</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血压(上午)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血压(下午)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血压(晚上)</List.Item>
        <div className="medicine-add-title">
          <span>血糖</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(早饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(早饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(午饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(午饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(晚饭前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(晚饭后)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(睡前)</List.Item>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >血糖(凌晨)</List.Item>
        <div className="medicine-add-title">
          <span>体重</span>
        </div>
        <List.Item
          extra={<Switch
            checked={this.state.checked}
            onChange={() => {
              this.setState({
                checked: !this.state.checked,
              });
            }}
          />}
        >体重</List.Item>
        <div className="button-wrap button-wrap-cover">
          <span className="button-item" onClick={this.cancel}>取消</span>
          <span onClick={this.remindSave}>保存</span>
        </div>
      </div>
    );
  }
}
