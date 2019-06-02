import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Tabs, WhiteSpace, Button, Modal } from 'antd-mobile'
import API from '../../components/httpAPI'
import echarts from 'echarts'
import './Archives.less'

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
    this.sugar = true;
    this.weight = true;
    this.exercise = true;
    this.state = {
      date1: now,
      date2: now,
      date3: now,
      date4: now,
      modal1: false,
      modal2: false,
      modal3: false,
      tableHtml1: null,
      tableHtml2: null,
      tableHtml3: null,
    };
  }

  componentDidMount() {
    let vmonth = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    let month = '' + now.getFullYear() + vmonth;
    this.getPressureData(month);
  }

  // 处理血压图表API查询的结果，转换为图表的数据格式
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
    data[useIndex.index].forEach(e => { xAxisData.push(e.time.substr(6, 2)) });
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

  // 处理脉搏API查询的结果，转换为图表的数据格式
  processDetailHeart = (data) => {
    // 图表的数据信息
    let option;
    option = {
      title: {
        text: '脉搏',
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
        data: ['脉搏']
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
      item.name   = '脉搏';
      item.data   = [];
      item.symbol = 'none';
      data.forEach( e => { item.data.push(e.maibo) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;

    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainerHeart.setOption(option, true);
  }

  // 处理血糖API查询的结果，转换为图表的数据格式
  processDetailSugar = (data) => {
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
      data.forEach( e => { item.data.push(Number(e.num)) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;
    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainerSugar.setOption(option, true);
  }

  // 处理体重图表API查询的结果，转换为图表的数据格式
  processDetailWeight = (data) => {
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
      item.name   = '体重';
      item.data   = [];
      item.symbol = 'none';
      data.forEach( e => { item.data.push(Number(e.num)) })
      series.push(item)
    }
    option.xAxis.data = xAxisData;
    option.series = series;
    // 绘制图表, 第二个参数表示不合并数据
    this.chartsContainerWeight.setOption(option, true);
  }

  // 处理运动图表API查询的结果，转换为图表的数据格式
  processDetailExercise = (data) => {
    const option = {
      title: {
        text: '体重趋势',
        left: 'center',
        textStyle: {
          color: '#5F6ABA',
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      color: ['#498FF7'],
      tooltip : {                        // 鼠标放在图标上显示提示数据
        trigger: 'axis',
        // formatter: '{b0} : {c0}元',   // 显示的数据格式
        // formatter: this.formatterBarX,   // 显示的数据格式
        axisPointer : {                  // 坐标轴指示器，坐标轴触发有效
            type : 'line'                // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis : {                          // X轴信息
        type : 'category', 
        data : [],
        boundaryGap : true,              // 两边留白  
        // splitLine: { show: true, },
        axisLabel: {
          textStyle: {
            fontSize: 12
          },
          formatter: function(value){
            return value.split("").join("\n");
          },
        }
      },  
      yAxis : {                          // Y轴信息
        type : 'value',
        splitNumber: 5,                 // 坐标轴的分割段数,最少是10个，最后可能会比这个多
        axisLabel: {
          textStyle: {
            fontSize: 10
          }
        }
      }, 
      grid : {
        containLabel: true,
        top: 40,
        bottom: 20,
        right: 20,
        left: 15
      },
      series : {
        type:'bar',
        barMaxWidth: 40,
        // barWidth: 20,
        label: { show: true, position: 'top', formatter:this.formatterBarXTop }, // 在bar顶部显示数据
        data:[],
      }
    };
    // 填充X轴数据
    for (var i = 0; i < data.length; i++) {
      if (data[i]) {
        switch (Number(data[i].type)) {
          case 0:
          option.xAxis.data.push('走路');
          break;
          case 1:
          option.xAxis.data.push('跑步');
          break;
          case 2:
          option.xAxis.data.push('骑自行车');
          break;
          case 3:
          option.xAxis.data.push('游泳');
          break;
          case 4:
          option.xAxis.data.push('瑜伽');
          break;
          case 5:
          option.xAxis.data.push('广场舞');
          break;
          default:
          option.xAxis.data.push('其他');
        }
        option.series.data.push(Number(data[i].ctime))
      }
    }
    this.chartsContainerExercise.setOption(option, true);
  }

  getPressureData = (month) => {
    API.health.pressureGet({month: month})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
          this.processDetailResult(res.data.data);
          this.setState({
            tableHtml1: this.setProcessTableHtml(res.data.data)
          })
        } else {
          console.error('获取图表数据失败！');
          Toast.fail('获取图表数据失败!', 3);
        }
      })
      .catch(err => {
        console.error('服务器出错获取图表数据失败');
        Toast.fail('服务器错误!获取图表数据失败!', 3);
      })

    API.health.pressureGet({month: month})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainerHeart = echarts.init(document.getElementById('echartsLine-heart'));
          this.processDetailHeart(res.data.data.maibo);
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
  getSugarData = (month) => {
    API.health.sugarGet({month: month})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainerSugar = echarts.init(document.getElementById('echartsLine-sugar'));
          this.processDetailSugar(res.data.data);
          this.sugar = false;
          this.setState({
            tableHtml2: this.setSugarTableHtml(res.data.data)
          })
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
  getWeightData = (month) => {
    API.health.weightGet({month: month})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainerWeight = echarts.init(document.getElementById('echartsLine-weight'));
          this.processDetailWeight(res.data.data);
          this.weight = false;
          this.setState({
            tableHtml3: this.setWeightTableHtml(res.data.data)
          })
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
  getExerciseData = (month) => {
    API.health.exerciseGet({month: month})
      .then( res => {
        if (res.data.code == 0) {
          // // 处理数据，同时渲染图表
          this.chartsContainerExercise = echarts.init(document.getElementById('echartsLine-exercise'));
          this.processDetailExercise(res.data.data);
          this.exercise = false;
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

  getPressure = (date) => {
    this.setState({
      date1: date
    })
    let vmonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let month = '' + date.getFullYear() + vmonth;
    this.getPressureData(month);
  }

  getSugar = (date) => {
    this.setState({
      date2: date
    })
    let vmonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let month = '' + date.getFullYear() + vmonth;
    this.getSugarData(month);
  }

  getWeight = (date) => {
    this.setState({
      date3: date
    })
    let vmonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let month = '' + date.getFullYear() + vmonth;
    this.getWeightData(month);
  }

  getExercise = (date) => {
    this.setState({
      date4: date
    })
    let vmonth = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1;
    let month = '' + date.getFullYear() + vmonth;
    this.getExerciseData(month);
  }

  cutTab = (tab, index) => {
    let vmonth = now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
    let month = '' + now.getFullYear() + vmonth;
    if (index == 1 && this.sugar) {
      this.getSugarData(month)
    }
    if (index == 2 && this.weight) {
      this.getWeightData(month);
    }
    if (index == 3 && this.exercise) {
      this.getExerciseData(month);
    }
  }

  showModal = key => (e) => {
    e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }
  onClose = key => () => {
    this.setState({
      [key]: false,
    });
  }

  setSugarTableHtml = (data) => {
    let tbodyHtml;
    let tableHtml;
    if(data) {
      tbodyHtml = data.map(data => {
        return (
          <tr key={data.time}>
            <td>{data.time}</td>
            <td>{data.num}</td>
          </tr>
        )
      })
      tableHtml = (
        <table>
          <thead>
            <tr>
              <td>时间</td>
              <td>血糖</td>
            </tr>
          </thead>
          <tbody>
            {tbodyHtml}
          </tbody>
        </table>
      )
    }
    return tableHtml;
  }

  setWeightTableHtml = (data) => {
    let tbodyHtml;
    let tableHtml;
    if(data) {
      tbodyHtml = data.map(data => {
        return (
          <tr key={data.time}>
            <td>{data.time}</td>
            <td>{data.num}</td>
          </tr>
        )
      })
      tableHtml = (
        <table>
          <thead>
            <tr>
              <td>时间</td>
              <td>体重</td>
            </tr>
          </thead>
          <tbody>
            {tbodyHtml}
          </tbody>
        </table>
      )
    }
    return tableHtml;
  }

  setProcessTableHtml = (data) => {
    let tbodyHtml;
    let tableHtml;
    if(data.high && data.low && data.maibo) {
      let list = [];
      for (let i = 0; i < data.high.length; i++) {
        list.push({
          time: data.high[i].time,
          high: data.high[i].num,
          low: data.low[i].num,
          maibo: data.maibo[i].num
        })
      }
      tbodyHtml = list.map(data => {
        return (
          <tr key={data.time}>
            <td className="process-tbody-time">{data.time}</td>
            <td className="process-tbody">{data.high}</td>
            <td className="process-tbody">{data.low}</td>
            <td className="process-tbody">{data.maibo}</td>
          </tr>
        )
      })
      tableHtml = (
        <table>
          <thead>
            <tr>
              <td className="process-thead-time">时间</td>
              <td className="process-thead">收缩压</td>
              <td className="process-thead">舒张压</td>
              <td className="process-thead">脉搏</td>
            </tr>
          </thead>
          <tbody>
            {tbodyHtml}
          </tbody>
        </table>
      )
    }
    return tableHtml;
  }

  render() {
    const tabs = [
      { title: '血压', sub: '1' },
      { title: '血糖', sub: '2' },
      { title: '体重', sub: '3' },
      { title: '运动', sub: '4' },
    ];
    return (
      <div className="layout">
        <div>
          <Tabs 
            tabs={tabs}
            initialPage={0}
            onChange={this.cutTab}
          >
            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date1}
                onChange={(date1) => {this.getPressure(date1)}}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine"></div>
              </div>
              <div className="chart">
                <div id="echartsLine-heart"></div>
              </div>
              <Button type="primary" inline size="small" style={{ marginLeft: '250px' }} onClick={this.showModal('modal1')}>查看表格</Button>
              <WhiteSpace size="lg" />
            </div>
            
            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date2}
                onChange={(date2) => {this.getSugar(date2)}}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine-sugar"></div>
              </div>
              <Button type="primary" inline size="small" style={{ marginLeft: '250px' }} onClick={this.showModal('modal2')}>查看表格</Button>
              <WhiteSpace size="lg" />
            </div>

            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date3}
                onChange={(date3) => {this.getWeight(date3)}}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine-weight"></div>
              </div>
              <Button type="primary" inline size="small" style={{ marginLeft: '250px' }} onClick={this.showModal('modal3')}>查看表格</Button>
              <WhiteSpace size="lg" />
            </div>

            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date4}
                onChange={(date4) => {this.getExercise(date4)}}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine-exercise"></div>
              </div>
            </div>
          </Tabs>
          <WhiteSpace />
        </div>

        <Modal
          popup
          visible={this.state.modal1}
          onClose={this.onClose('modal1')}
          animationType="slide-up"
        >
          <div className="popup">
            <div className="table">
              {this.state.tableHtml1}
            </div>
            <Button type="primary" onClick={this.onClose('modal1')}>确定</Button>
          </div>
        </Modal>
        <Modal
          popup
          visible={this.state.modal2}
          onClose={this.onClose('modal2')}
          animationType="slide-up"
        >
          <div className="popup">
            <div className="table">
              {this.state.tableHtml2}
            </div>
            <Button type="primary" onClick={this.onClose('modal2')}>确定</Button>
          </div>
        </Modal>
        <Modal
          popup
          visible={this.state.modal3}
          onClose={this.onClose('modal3')}
          animationType="slide-up"
        >
          <div className="popup">
            <div className="table">
              {this.state.tableHtml3}
            </div>
            <Button type="primary" onClick={this.onClose('modal3')}>确定</Button>
          </div>
        </Modal>
      </div>
    );
  }
}
