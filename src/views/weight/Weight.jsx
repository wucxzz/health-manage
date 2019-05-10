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
export default class Weight extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      bmi: null
    };

  }

  componentDidMount() {
    this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
    API.health.weightGet({timeType: 0})
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
        text: '体重趋势',
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
        data: ['体重']
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
      series: [],                      // 这个需要设置
    }

    let xAxisData   = [];   // X轴的数据
    let series      = [];
    // 图表的每一个数据格式： { name: '', type: 'line', smooth: true, color: '', data: [] }
    const seriesItem = { type: 'line', }; // smooth: true 线是圆滑的
    // 处理X轴数据
    data.forEach(e => { xAxisData.push(e.time) });
    // 处理每条数据
    if (data) {  // 当前
      const item  = {...seriesItem}
      item.name   = '体重';
      item.data   = [];
      item.symbol = 'none';
      data.forEach( e => { item.data.push(e.num) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;

    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainer.setOption(option, true);
  }

  clickChoiceBtn = (type) => {
    API.health.weightGet({timeType: type})
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

  weightSave = () => {
    let value = this.state.date;
    let vmonth = value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
    let vdate = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
    let weight = document.getElementsByClassName('input')[0].value;
    if (!weight) {
      Toast.fail('数据输入不正确!', 1);
    } else {
      let param = {
        time: '' + value.getFullYear() + vmonth + vdate,
        num: weight
      }
      API.health.weightSave(param)
        .then(res => {
          if (res.data.code == 0) {
            this.setState({
              bmi: res.data.data.BMI
            })
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
    this.setState({
      bmi: null
    })
  }

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
          <div className="inputItem">
            <span>体重(kg)</span>
            <input className="input" type="number"/>
          </div>
          <div className="bmi">
            <span>BMI</span>
            <span className="bmi-output">{this.state.bmi}</span>
          </div>
          <div className="button-wrap button-wrap-cover">
            <span className="button-item" onClick={this.cancel}>取消</span>
            <span onClick={this.weightSave}>保存</span>
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
