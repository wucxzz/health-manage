import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast } from 'antd-mobile'
import API from '../../components/httpAPI'
import echarts from 'echarts'
import ChoiceBtn from '../../components/base/ChoiceBtn/ChoiceBtn'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);
let minDate = new Date(nowTimeStamp - 1e7);
const maxDate = new Date(nowTimeStamp + 1e7);
if (minDate.getDate() !== maxDate.getDate()) {
  // set the minDate to the 0 of maxDate
  minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
}
export default class BloodPressure extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
    };

  }

  componentDidMount() {
    this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
    API.health.pressureGet({timeType: 0})
      .then( res => {
        if (res.data.code === 0) {
          // // 处理数据，同时渲染图表
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
      // 鼠标放在图标上对应点时，显示数据
      // tooltip: { 
      //   trigger: 'axis',  // 触发类型,axis坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
      //   formatter: this.formatterCharts,
      //   position: function (pos, params, dom, rect, size) {     // 提示框位置
      //     // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
      //     var obj = {top: 60};
      //     obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5;
      //     return obj;
      //   },
      //   textStyle: {
      //     fontSize: 10
      //   },
      //   backgroundColor: 'rgba(0,0,0,.8)'
      // },
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
    data[useIndex.index].forEach(e => { xAxisData.push(e.time) });
    // 处理每条数据
    if (data.high) {  // 当前
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
    if (data.low) { // 环比
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
        if (res.data.code === 0) {
          // // 处理数据，同时渲染图表
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
    let inpList = document.getElementsByClassName('input');
    for(var i = 0; i < inpList.length; i++) {
      inpList[i].value = null;
    }
  }


  render() {
    return (
      <div className="layout">
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
            <span className="analysis">血压分析</span>
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
