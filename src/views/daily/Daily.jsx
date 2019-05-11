import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Picker, Switch } from 'antd-mobile'
import API from '../../components/httpAPI'
import data from '../common/data'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

export default class Daily extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      asyncValue: 1,
      checked: true,
      pickerValue: [],
    };

  }

  componentDidMount() {

  }

  onClick = () => {
    console.log(9999)
  };
  onPickerChange = (val) => {
    console.log(val);
    const asyncValue = [...val];
    console.log(asyncValue)
    this.setState({
      asyncValue,
    });
  };

  render() {
    return (
      <div className="layout">
        <div className="message-input">
          <DatePicker
            mode="date"
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">时间</List.Item>
          </DatePicker>
          <Picker 
            data={data.sleepData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>睡眠</List.Item>
          </Picker>
          <List.Item
            extra={<Switch
              checked={this.state.checked}
              onChange={() => {
                this.setState({
                  checked: !this.state.checked,
                });
              }}
            />}
          >是否午睡</List.Item>
          <Picker 
            data={data.eatData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>饮食</List.Item>
          </Picker>
          <List.Item
            extra={<Switch
              checked={this.state.checked}
              onChange={() => {
                this.setState({
                  checked: !this.state.checked,
                });
              }}
            />}
          >是否饮酒</List.Item>
          <Picker 
            data={data.moodData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>心情</List.Item>
          </Picker>
          <div className="button-wrap button-wrap-cover">
            <span className="button-item">取消</span>
            <span>保存</span>
          </div>

        </div>
      </div>
    );
  }
}
