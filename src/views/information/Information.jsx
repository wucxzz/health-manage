import React from 'react'
import './Information.less'
import { List, Picker, DatePicker, Toast } from 'antd-mobile'
import API from '../../components/httpAPI'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
const minDate = new Date(1900, 1, 1, 0, 0, 0);

export default class Information extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      gender: null,
      date: now,
      health: null,
      food: null
    };
  }

  componentDidMount() {
    this.getMeseage();
  }

  getMeseage = () => {
    const msgList = document.getElementsByClassName('input');
    API.health.userInfo()
      .then(res => {
        if (res.data.code == 0 && res.data.data.name) {
          const data = res.data.data;
          // const msgList = document.getElementsByClassName('input');
          msgList[0].value = data.name;
          msgList[1].value = data.idcard;
          msgList[2].value = data.address;
          msgList[3].value = data.postcode;
          msgList[4].value = data.phone;
          msgList[5].value = data.height;
          msgList[6].value = data.weight;
          msgList[7].value = data.xiyan;
          msgList[8].value = data.yinjiu;
          const str = data.birthday.toString();
          const year = str.slice(0, 4);
          const mon = str.slice(4, 6);
          const day = str.slice(6, 8);
          this.setState({
            gender: [data.sex],
            health: [data.health],
            food: [data.food],
            date: new Date(year, mon - 1, day, 0, 0, 0)
          })
        } else {
          Toast.info('请输入个人信息!', 1.5);
        }
      })
      .catch(err => {
        console.error('服务器出错，获取信息数据失败');
        Toast.fail('服务器错误!', 3);
      })
  }

  msgSave = () => {
    let state = 1;
    let msgList = document.getElementsByClassName('input');
    for(var i = 0; i < msgList.length; i++) {
      if (!msgList[i].value) {
        Toast.fail('信息输入不完整!', 1);
        state = 0;
      }
    }
    if (state) {
      let value = this.state.date;
      let vmonth = value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
      let vdate = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
      let param = {
        name: msgList[0].value,
        idcard: msgList[1].value,
        address: msgList[2].value,
        postcode: msgList[3].value,
        phone: msgList[4].value,
        height: msgList[5].value,
        weight: msgList[6].value,
        xiyan: msgList[7].value,
        yinjiu: msgList[8].value,
        sex: this.state.gender[0],
        health: this.state.health[0],
        food: this.state.food[0],
        birthday: '' + value.getFullYear() + vmonth + vdate,
      }
      API.health.userInfoUpdate(param)
        .then(res => {
          if (res.data.code == 0) {
            Toast.info('保存成功!', 1);
          } else {
            console.error('传输数据失败！');
            Toast.fail('保存数据失败!', 3);
          }
        })
        .catch(err => {
          console.error('服务器出错，数据传输失败');
          Toast.fail('服务器错误!', 2);
        })
    }
  }

  cancel = () => {
    this.getMeseage();
  }


  render() {
    const maleData = [
      {label: '男', value: '0'},
      {label: '女', value: '1'}
    ];
    const foodData = [
      {label: '正常', value: '0'},
      {label: '荤食为主', value: '1'},
      {label: '素食为主', value: '2'},
      {label: '嗜油', value: '3'},
      {label: '嗜盐', value: '4'},
      {label: '嗜糖', value: '5'}
    ];
    const healthData = [
      {label: '健康', value: '0'},
      {label: '高血压', value: '1'},
      {label: '糖尿病', value: '2'}
    ];
    return (
      <div className="information-layout">
        <div className="form-wrapper">
          <div className="inputItem">
            <span>姓名</span>
            <input className="input" type="text"/>
          </div>
          <Picker 
            data={maleData} 
            cols={1} 
            value={this.state.gender}
            onOk={gender => this.setState({ gender })}
          >
            <List.Item arrow="horizontal">性别</List.Item>
          </Picker>
          <DatePicker
            mode="date"
            title="Select Date"
            extra="Optional"
            minDate={minDate}
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">出生日期</List.Item>
          </DatePicker>
          <div className="inputItem">
            <span>证件号码</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>家庭住址</span>
            <input className="input" type="text"/>
          </div>
          <div className="inputItem">
            <span>邮政编码</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>电话号码</span>
            <input className="input" type="number"/>
          </div>
          <Picker 
            data={healthData} 
            cols={1} 
            value={this.state.health}
            onOk={health => this.setState({ health })}
          >
            <List.Item arrow="horizontal">健康状况</List.Item>
          </Picker>
          <div className="inputItem">
            <span>身高</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>体重</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>日吸烟量（颗）</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>日饮酒量（两）</span>
            <input className="input" type="number"/>
          </div>
          <Picker 
            data={foodData} 
            cols={1} 
            value={this.state.food}
            onOk={food => this.setState({ food })}
          >
            <List.Item arrow="horizontal">饮食习惯</List.Item>
          </Picker>
        </div>
        <div className="button-wrap">
          <span className="button-item" onClick={this.cancel}>取消</span>
          <span onClick={this.msgSave}>保存</span>
        </div>
      </div>
    );
  }
}
