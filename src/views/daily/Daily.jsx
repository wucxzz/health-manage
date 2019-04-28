import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Picker, Switch  } from 'antd-mobile'
import API from '../../components/httpAPI'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
// GMT is not currently observed in the UK. So use UTC now.
const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
export default class Daily extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      asyncValue: 1,
      checked: true,
    };

  }

  componentDidMount() {

    API.statistics.getStatisticsDetail(1)
      .then( res => {
        if (res.data.code === 0 && res.data.msg === 'SUCCESS') {
          // // 处理数据，同时渲染图表
          console.log(res.data.data)
        } else {
          console.error('获取图表数据失败！');
          Toast.fail('获取图表数据失败!', 3);
        }
      })
      .catch(err => {
        console.error('服务器出错获取图表数据失败');
        Toast.fail('服务器错误!获取图表数据失败!', 3);
      })
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
    const sleepData = [
      {label: '非常好', value: 0},
      {label: '好', value: 1},
      {label: '一般', value: 2},
      {label: '差', value: 3},
      {label: '很差', value: 4}
    ];
    const eatData = [
      {label: '正常', value: 0},
      {label: '过量', value: 1},
      {label: '过甜', value: 2},
      {label: '过咸', value: 3}
    ];
    const moodData = [
      {label: '正常', value: 0},
      {label: '愉快', value: 1},
      {label: '伤心', value: 2},
      {label: '抑郁', value: 3},
      {label: '紧张', value: 4},
      {label: '焦虑', value: 5}
    ];
    const symptomsData = [
      {label: '正常', value: 0},
      {label: '头晕', value: 1},
      {label: '胸闷', value: 2},
      {label: '乏力', value: 3},
      {label: '其他', value: 4}
    ];
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
            data={sleepData} 
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
            data={eatData} 
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
            data={moodData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>心情</List.Item>
          </Picker>
          <Picker 
            data={symptomsData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>症状</List.Item>
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
