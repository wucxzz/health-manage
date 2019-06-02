import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Picker, Modal } from 'antd-mobile'
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
export default class BloodSugar extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      asyncValue: ['1'],
      modal1: false,
      textsugar: null,
    };

  }

  componentDidMount() {
    this.getDataToProcess();
  }

  getDataToProcess = () => {
    API.health.sugarGet({timeType: 0})
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
        text: '血糖趋势',
        left: 'center',
        textStyle: {
          color: '#5F6ABA',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      color: ['#1473FF'],
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
        data: ['血糖值']
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
          }
        }
      }, 
      yAxis: { 
        type: 'value', 
        splitNumber: 5, 
        splitLine: { show: true, },    // 坐标显示网格线
        axisLabel: {
          textStyle: {
            fontSize: 10
          }
        }
      },
      series: [],                      // 这个需要设置
    }

    let xAxisData   = [];   // X轴的数据
    let series      = [];
    // 图表的每一个数据格式： { name: '', type: 'line', smooth: true, color: '', data: [] }
    const seriesItem = { type: 'line', }; // smooth: true 线是圆滑的
    // 处理X轴数据
    data.forEach(e => { xAxisData.push(e.time.substr(6, 2)) });
    // 处理每条数据
    if (data) {  // 当前
      const item  = {...seriesItem}
      item.name   = '血糖值';
      item.data   = [];
      item.symbol = 'none';
      item.markLine = {
        data: [
          { name: '标线1', yAxis: 6.1},
        ],
        symbol: 'none',
        lineStyle: {
          type: 'solid',
          color: 'red',
        },
      };
      data.forEach( e => { item.data.push(e.num) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;

    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainer.setOption(option, true);
  }

  clickChoiceBtn = (type) => {
    API.health.sugarGet({timeType: type})
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

  sugarSave = () => {
    let value = this.state.date;
    let vmonth = value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
    let vdate = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
    let sugar = document.getElementsByClassName('input')[0].value;
    if (!sugar) {
      Toast.fail('数据输入不正确!', 1);
    } else {
      let param = {
        time: '' + value.getFullYear() + vmonth + vdate,
        qujian: this.state.asyncValue[0],
        num: sugar
      }
      API.health.sugarSave(param)
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
    let sugar = document.getElementsByClassName('input')[0].value;
    let textsugar;
    if (!sugar) {
      Toast.fail('数据输入不正确!', 1);
    } else 
    if (this.state.asyncValue === '1') {
      sugar > 9.4 ? textsugar = '偏高' : sugar < 3.9 ? textsugar = '偏低' : textsugar = '正常';
      this.setState({
        [key]: true,
        textsugar
      });
    } else {
      sugar > 6.1 ? textsugar = '偏高' : sugar < 3.9 ? textsugar = '偏低' : textsugar = '正常';
      this.setState({
        [key]: true,
        textsugar
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
    const timeData = [
      {label: '餐前', value: '0'},
      {label: '餐后', value: '1'},
    ];

    return (
      <div className="layout">
        <Header data={'血糖管理'}></Header>
        <div className="message-input">
          <DatePicker
            mode="date"
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">时间</List.Item>
          </DatePicker>
          <Picker 
            data={timeData} 
            cols={1} 
            value={this.state.asyncValue}
            // onPickerChange={this.onPickerChange}
            onOk={asyncValue => this.setState({ asyncValue })}
          >
            <List.Item arrow="horizontal">时间区间</List.Item>
          </Picker>
          <div className="inputItem">
            <span>血糖值(mmol/L)</span>
            <input className="input" type="number"/>
          </div>
          <div className="button-wrap">
            <span className="button-item" onClick={this.cancel}>取消</span>
            <span onClick={this.sugarSave}>保存</span>
            <span className="analysis" onClick={this.showModal('modal1')}>血糖分析</span>
            <Modal
              visible={this.state.modal1}
              transparent
              maskClosable={true}
              onClose={this.onClose('modal1')}
              title="血压分析"
              footer={[{ text: '确定', onPress: () => { this.onClose('modal1')(); } }]}
              wrapProps={{ onTouchStart: this.onWrapTouchStart }}
            >
              <div style={{ height: 50, overflow: 'scroll' }}>
                血糖：{this.state.textsugar}<br />
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
