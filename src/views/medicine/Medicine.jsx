import React from 'react'
import '../common/common.less'
import { List, Toast, Picker, Card, WingBlank } from 'antd-mobile'
import API from '../../components/httpAPI'
import data from '../common/data'

export default class Daily extends React.Component{
  constructor(props) {
    super(props);
    this.yaodata = null;
    this.state = {
      dosage: ['2', '1'],
      times: [2],
      way: [1],
      cardHtml: null
    };

  }

  componentDidMount() {
    API.health.yaoGet()
      .then(res => {
        if (res.data.code === 0) {
          this.yaodata = res.data.data;
          this.setState({
            cardHtml: this.setCardHtml()
          })
        }
      })
      .catch(err => {
        console.error('服务器出错，获取药数据失败');
        Toast.fail('服务器错误!', 3);
      })
  }

  deleteYao = (name) => {
    console.log(name)
  }

  setCardHtml = () => {
    let cardHtml;
    let yaoHtml;
    if (this.yaodata) {
      cardHtml = this.yaodata.map(data => {
        let unit;
        switch (data.num % 10) {
          case 0:
          unit = '丸'
          break;
          case 1:
          unit = '片'
          break;
          case 2:
          unit = '袋'
          break;
          case 3:
          unit = '滴'
          break;
          case 4:
          unit = '瓶'
          break;
          case 5:
          unit = 'mg'
          break;
          case 6:
          unit = 'g'
          break;
          default:
          unit = 'ml'
        }
        let eatType;
        switch (data.type) {
          case 0:
          eatType = '其他'
          break;
          case 1:
          eatType = '口服'
          break;
          case 2:
          eatType = '含化'
          break;
          case 3:
          eatType = '舌下给药'
          break;
          case 4:
          eatType = '咀嚼'
          break;
          case 5:
          eatType = '吸入'
          break;
          case 6:
          eatType = '外用'
          break;
          default:
          eatType = '其他'
        }
        return (
          <WingBlank size="md" key={data.name}>
            <Card>
              <Card.Header
                title={data.name}
                thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
              />
              <Card.Body>
                <div>主治：{data.zhuzhi}</div>
                <div>用法用量：{eatType}，每日{data.time}次，每次{Math.floor(data.num / 10) + unit}</div>
              </Card.Body>
              <Card.Footer extra={<div onClick={this.deleteYao.bind(this, data.name)}>删除</div>} />
            </Card>
          </WingBlank>
        )
      })
      yaoHtml = (
        <div>
          {cardHtml}
        </div>
      )
    }
    return yaoHtml;
  }

  yaoSave = () => {
    console.log(this.state.dosage)
    console.log(this.state.way)
    console.log(this.state.times)
    let name = document.getElementsByClassName('med-input')[0].value;
    let num = this.state.dosage;
    let zhuzhi = document.getElementsByClassName('med-input')[1].value;
    if (!(name && zhuzhi)) {
      Toast.fail('数据输入不正确!', 1);
    } else {
      let param = {
        name: name,
        zhuzhi: zhuzhi,
        time: this.state.times[0],
        num: '' + num[0] + num[1],
        type: this.state.way[0]
      }
      console.log(param)
      API.health.yaoSave(param)
        .then(res => {
          if (res.data.code == 0) {
            Toast.info('保存成功!', 1);
            this.cancel();
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

  routeToTip = () => {
    this.props.history.push('/daily');
  }
  routeToFile = () => {
    this.props.history.push('/daily');
  }
  cancel = () => {
    let inpList = document.getElementsByClassName('med-input');
    for(var i = 0; i < inpList.length; i++) {
      inpList[i].value = null;
    }
  }

  render() {
    return (
      <div className="layout">
        <div className="medicine-add-title">
          <span>正在服用的药物</span>
        </div>
        <div>
          {this.state.cardHtml}
        </div>
        <div className="medicine-add-title">
          <span>添加服用药物</span>
        </div>
        <div className="message-input">
          <div className="med-inputItem">
            <span>药品名称</span>
            <input className="med-input" type="text"/>
          </div>
          <div className="med-inputItem">
            <span>主治</span>
            <input className="med-input" type="text"/>
          </div>
          <Picker 
            data={data.timesData} 
            cols={1} 
            value={this.state.times}
            onOk={v => this.setState({ times: v })}
          >
            <List.Item arrow="horizontal">服药次数</List.Item>
          </Picker>
          <Picker
            data={data.dosageData}
            title="每次用量"
            cascade={false}
            extra="请选择"
            value={this.state.dosage}
            onOk={v => this.setState({ dosage: v })}
          >
            <List.Item arrow="horizontal">每次用量</List.Item>
          </Picker>
          <Picker 
            data={data.wayData} 
            cols={1} 
            value={this.state.way}
            onOk={v => this.setState({ way: v })}
          >
            <List.Item arrow="horizontal">服药方式</List.Item>
          </Picker>
          <div className="button-wrap button-wrap-cover">
            <span className="button-item" onClick={this.cancel}>取消</span>
            <span onClick={this.yaoSave}>保存</span>
          </div>
          <div className="img-button">
            <span className="img-wrap" onClick={this.routeToTip}>
              <img src={require('../../assets/images/tips.png')} alt=""/>
              提醒设置
            </span>
            <span className="img-wrap" onClick={this.routeToFile}>
              <img src={require('../../assets/images/file.png')} alt=""/>
              健康档案
            </span>
          </div>
        </div>
      </div>
    );
  }
}
