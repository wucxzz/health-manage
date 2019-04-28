import React from 'react'
import './Information.less'
import { List, Picker, DatePicker } from 'antd-mobile'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

export default class Information extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      asyncValue: 1,
      date: now
    };

  }

  componentDidMount() {

  }

  handleClick = () => {
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
    const maleData = [
      {label: '男', value: 1},
      {label: '女', value: 0}
    ];
    const foodData = [
      {label: '正常', value: 0},
      {label: '荤食为主', value: 1},
      {label: '素食为主', value: 2},
      {label: '嗜油', value: 3},
      {label: '嗜盐', value: 4},
      {label: '嗜糖', value: 5}
    ];
    const healthData = [
      {label: '健康', value: 0},
      {label: '高血压', value: 1},
      {label: '糖尿病', value: 2}
    ];
    return (
      <div className="information-layout">
        <div className="form-wrapper">
          <div className="inputItem">
            <span>姓名</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>昵称</span>
            <input className="input" type="text"/>
          </div>
          <Picker 
            data={maleData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>性别</List.Item>
          </Picker>
          <DatePicker
            mode="date"
            title="Select Date"
            extra="Optional"
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">出生日期</List.Item>
          </DatePicker>
          <div className="inputItem">
            <span>证件号码</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>家庭住址</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>邮政编码</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>电话号码</span>
            <input className="input" type="text"/>
          </div>
          <Picker 
            data={healthData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>健康状况</List.Item>
          </Picker>
          <div className="inputItem">
            <span>身高</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>体重</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>日吸烟量（颗）</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>日饮酒量（两）</span>
            <input className="input" type="text"/>
          </div>
          <Picker 
            data={foodData} 
            cols={1} 
            value={this.state.asyncValue}
            onPickerChange={this.onPickerChange}
            onOk={v => console.log(v)}
          >
            <List.Item arrow="horizontal" onClick={this.onClick}>饮食习惯</List.Item>
          </Picker>
        </div>
        <div className="button-wrap">
          <span className="button-item">取消</span>
          <span>保存</span>
        </div>
      </div>
    );
  }
}
