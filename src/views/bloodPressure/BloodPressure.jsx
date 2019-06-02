import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Modal } from 'antd-mobile'
import API from '../../components/httpAPI'
import echarts from 'echarts'
import ChoiceBtn from '../../components/base/ChoiceBtn/ChoiceBtn'
import Header from '../../components/base/Header/Header'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}
export default class BloodPressure extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      modal1: false,
      texthigh: null,
      textlow: null,
      textheart: null,
    };

  }

  componentDidMount() {
    this.getDataToProcess();
  }

  getDataToProcess = () => {
    API.health.pressureGet({timeType: 0})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
          this.processDetailResult(res.data.data);
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

  // 处理图表API查询的结果，转换为图表的数据格式
  processDetailResult = (data) => {
    // 图表的数据信息
    let option;
    option = {
      title: {
        text: '血压趋势',
        left: 'center',
        textStyle: {
          color: '#5F6ABA',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      color: ['#1473FF', '#3FBE2A'],
      legend: { // data需要设置
        bottom: 10, 
        itemWidth: 30,
        // itemHeight: 8,
        height: 20,
        backgroundColor: '#f7f7f7',
        orient: 'vertical',
        textStyle: {
          fontSize: 12
        },
        data: ['收缩压', '舒张压']
      },  
      grid: { left: 15, right: 30, bottom: 50, top: 40, containLabel: true, },
      xAxis: {      // data需要设置 boundaryGap不能删，否则会在线两边留空白
        type: 'category', 
        boundaryGap : false, 
        data: [],
        // splitLine: { show: true, },    // 坐标显示网格线
        axisLabel: {
          textStyle: {
            fontSize: 10
          },
        }
      }, 
      yAxis: { 
        type: 'value', 
        splitNumber: 5, 
        splitLine: { show: true, },    // 坐标显示网格线
        axisLabel: {
          textStyle: {
            fontSize: 10
          },
        }
      },
      series: [],                       // 这个需要设置
    }

    let xAxisData   = [];   // X轴的数据
    let series      = [];
    // 图表的每一个数据格式： { name: '', type: 'line', smooth: true, color: '', data: [] }
    const seriesItem = { type: 'line', }; // smooth: true 线是圆滑的
    // 处理X轴数据
    let useIndex = { length: data.high.length || 0, index : 'high' };
    if (data.low && useIndex.length < data.low.length) {
      useIndex.length = data.low.length;
      useIndex.index  = 'low';
    }
    data[useIndex.index].forEach(e => { xAxisData.push(Number(e.time.substr(6, 2))) });
    // 处理每条数据
    if (data.high) {  // 收缩压
      const item  = {...seriesItem}
      item.name   = '收缩压';
      item.data   = [];
      item.symbol = 'none';
      item.markLine = {
        data: [
          { name: '标线1', yAxis: 140},
        ],
        symbol: 'none',
        lineStyle: {
          type: 'solid',
          color: 'red',
        },
      };
      data.high.forEach( e => { item.data.push(e.num) })
      series.push(item)
    }
    if (data.low) { // 舒张压
      const item  = {...seriesItem}
      item.name   = '舒张压';
      item.data   = [];
      item.symbol = 'none';
      item.markLine = {
        data: [
          { name: '标线2', yAxis: 90},
        ],
        symbol: 'none',
        lineStyle: {
          type: 'solid',
          color: 'red',
        },
      };
      data.low.forEach( e => { item.data.push(e.num) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;

    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainer.setOption(option, true);
  }

  clickChoiceBtn = (type) => {
    API.health.pressureGet({timeType: type})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
          this.processDetailResult(res.data.data);
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

  savePressure = () => {
    let state = 1;
    let inpList = document.getElementsByClassName('input');
    for(var i = 0; i < inpList.length; i++) {
      if (!inpList[i].value) {
        Toast.fail('数据输入不正确!', 1);
        state = 0;
      }
    }
    if (state) {
      let param = {
        time: this.state.date.valueOf(),
        high: inpList[0].value,
        low: inpList[1].value,
        maibo: inpList[2].value
      }
      API.health.pressureSave(param)
        .then(res => {
          if (res.data.code == 0) {
            Toast.info('保存成功!', 1);
            this.getDataToProcess();
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
    this.props.history.push('/remind');
  }
  routeToFile = () => {
    this.props.history.push('/archives');
  }
  cancel = () => {
    let inpList = document.getElementsByClassName('input');
    for(var i = 0; i < inpList.length; i++) {
      inpList[i].value = null;
    }
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    let state = 1;
    let inpList = document.getElementsByClassName('input');
    for(var i = 0; i < inpList.length; i++) {
      if (!inpList[i].value) {
        Toast.fail('数据输入不正确!', 1);
        state = 0;
      }
    }
    if (state) {
      let high = inpList[0].value;
      let low = inpList[1].value;
      let heart = inpList[2].value;
      let texthigh, textlow, textheart;
      high > 140 ? texthigh = '偏高' : high < 90 ? texthigh = '偏低' : texthigh = '正常';
      low > 90 ? textlow = '偏高' : low < 60 ? textlow = '偏低' : textlow = '正常';
      heart > 100 ? textheart = '偏高' : heart < 60 ? textheart = '偏低' : textheart = '正常';
      this.setState({
        [key]: true,
        texthigh,
        textlow,
        textheart
      });
    }
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }
  onWrapTouchStart = (e) => {
    // fix touch to scroll background page on iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  }

  render() {
    return (
      <div className="layout">
        <Header data={'血压管理'}></Header>
        <div className="message-input">
          <DatePicker
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">时间</List.Item>
          </DatePicker>
          <div className="inputItem">
            <span>收缩压(毫米汞柱)</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>舒张压(毫米汞柱)</span>
            <input className="input" type="number"/>
          </div>
          <div className="inputItem">
            <span>脉搏(每分钟脉搏数)</span>
            <input className="input" type="number"/>
          </div>
          <div className="button-wrap">
            <span className="button-item" onClick={this.cancel}>取消</span>
            <span onClick={this.savePressure}>保存</span>
            <span className="analysis" onClick={this.showModal('modal1')}>血压分析</span>
            <Modal
              visible={this.state.modal1}
              transparent
              maskClosable={true}
              onClose={this.onClose('modal1')}
              title="血压分析"
              footer={[{ text: '确定', onPress: () => { this.onClose('modal1')(); } }]}
              wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
              <div style={{ height: 70, overflow: 'scroll' }}>
                收缩压：{this.state.texthigh}<br />
                舒张压：{this.state.textlow}<br />
                心率：{this.state.textheart}<br />
              </div>
            </Modal>
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

        <div className="chart">
          <ChoiceBtn defaultActive={'0'} clickBtn={this.clickChoiceBtn} data={['最近一月', '最近一季', '最近一年']} />
          <div id="echartsLine"></div>
        </div>
      </div>
    );
  }
}
