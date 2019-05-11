import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Tabs, WhiteSpace, Badge } from 'antd-mobile'
import API from '../../components/httpAPI'
import echarts from 'echarts'

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
    };

  }

  componentDidMount() {
    this.chartsContainer = echarts.init(document.getElementById('echartsLine'));
    this.chartsContainerHeart = echarts.init(document.getElementById('echartsLine-heart'));
    // this.chartsContainerSugar = echarts.init(document.getElementById('echartsLine-sugar'));
    // this.chartsContainerWeight = echarts.init(document.getElementById('echartsLine-weight'));
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

      API.health.heartGet({timeType: 0})
        .then( res => {
          if (res.data.code === 0) {
            // // 处理数据，同时渲染图表
            this.processDetailHeart(res.data.data);
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
    data.forEach(e => { xAxisData.push(e.time) });
    // 处理每条数据
    if (data) {  // 当前
      const item  = {...seriesItem}
      item.name   = '脉搏';
      item.data   = [];
      item.symbol = 'none';
      data.forEach( e => { item.data.push(e.num) })
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
    data.forEach(e => { xAxisData.push(e.time) });
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
        switch (data[i].type) {
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
        option.series.data.push(data[i].ctime)
      }
    }
    this.chartsContainerExercise.setOption(option, true);
  }

  getPressure = () => {

  }

  getSugar = () => {

  }

  getWeight = () => {

  }

  getExercise = () => {

  }

  cutTab = (tab, index) => {
    if (index == 1 && this.sugar) {
      API.health.sugarGet({timeType: 0})
        .then( res => {
          if (res.data.code === 0) {
            // // 处理数据，同时渲染图表
            this.chartsContainerSugar = echarts.init(document.getElementById('echartsLine-sugar'));
            this.processDetailSugar(res.data.data);
            this.sugar = false;
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
    if (index == 2 && this.weight) {
      API.health.weightGet({timeType: 0})
        .then( res => {
          if (res.data.code === 0) {
            // // 处理数据，同时渲染图表
            this.chartsContainerWeight = echarts.init(document.getElementById('echartsLine-weight'));
            this.processDetailWeight(res.data.data);
            this.weight = false;
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
    if (index == 3 && this.exercise) {
      API.health.exerciseGet({timeType: 0})
        .then( res => {
          if (res.data.code === 0) {
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
            // onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
          >
            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date1}
                onChange={date1 => this.setState({ date1 })}
                onOk={this.getPressure}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine"></div>
              </div>
              <div className="chart">
                <div id="echartsLine-heart"></div>
              </div>
            </div>
            
            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date2}
                onChange={date2 => this.setState({ date2 })}
                onOk={this.getSugar}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine-sugar"></div>
              </div>
            </div>

            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date3}
                onChange={date3 => this.setState({ date3 })}
                onOk={this.getWeight}
              >
                <List.Item arrow="horizontal">时间</List.Item>
              </DatePicker>
              <div className="chart">
                <div id="echartsLine-weight"></div>
              </div>
            </div>

            <div>
              <WhiteSpace />
              <DatePicker
                mode="month"
                value={this.state.date4}
                onChange={date4 => this.setState({ date4 })}
                onOk={this.getExercise}
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
      </div>
    );
  }
}
