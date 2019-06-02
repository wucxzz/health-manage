import React from 'react'
import '../common/common.less'
import { DatePicker, List, Toast, Picker } from 'antd-mobile'
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
export default class Exercise extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      date: now,
      type: ['0'],
      intensity: ['1']
    };

  }

  componentDidMount() {
    this.getDataToProcess();
  }

  getDataToProcess = () => {
    API.health.exerciseGet({timeType: 0})
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
    const option = {
      title: {
        text: '运动趋势',
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
          case '0':
          option.xAxis.data.push('走路');
          break;
          case '1':
          option.xAxis.data.push('跑步');
          break;
          case '2':
          option.xAxis.data.push('骑自行车');
          break;
          case '3':
          option.xAxis.data.push('游泳');
          break;
          case '4':
          option.xAxis.data.push('瑜伽');
          break;
          case '5':
          option.xAxis.data.push('广场舞');
          break;
          default:
          option.xAxis.data.push('其他');
        }
        option.series.data.push(data[i].ctime)
      }
    }
    this.chartsContainer.setOption(option, true);
  }

  clickChoiceBtn = (type) => {
    API.health.exerciseGet({timeType: type})
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

  exerciseSave = () => {
    let value = this.state.date;
    let vmonth = value.getMonth() + 1 < 10 ? '0' + (value.getMonth() + 1) : value.getMonth() + 1;
    let vdate = value.getDate() < 10 ? '0' + value.getDate() : value.getDate();
    let num = document.getElementsByClassName('input')[0].value;
    if (!num) {
      Toast.fail('数据输入不正确!', 1);
    } else {
      let param = {
        time: '' + value.getFullYear() + vmonth + vdate,
        type: this.state.type[0],
        strength: this.state.intensity[0],
        ctime: num
      }
      API.health.exerciseSave(param)
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

  render() {
    const exerciseData = [
      {label: '走路', value: '0'},
      {label: '跑步', value: '1'},
      {label: '骑自行车', value: '2'},
      {label: '游泳', value: '3'},
      {label: '瑜伽', value: '4'},
      {label: '广场舞', value: '5'},
      {label: '其他', value: '6'}
    ];
    const intensityData = [
      {label: '高', value: '0'},
      {label: '中', value: '1'},
      {label: '低', value: '2'}
    ];

    return (
      <div className="layout">
        <Header data={'运动管理'}></Header>
        <div className="message-input">
          <DatePicker
            mode="date"
            value={this.state.date}
            onChange={date => this.setState({ date })}
          >
            <List.Item arrow="horizontal">时间</List.Item>
          </DatePicker>
          <Picker 
            data={exerciseData} 
            cols={1} 
            value={this.state.type}
            onOk={type => this.setState({ type })}
          >
            <List.Item arrow="horizontal">运动类型</List.Item>
          </Picker>
          <Picker 
            data={intensityData} 
            cols={1} 
            value={this.state.intensity}
            onOk={intensity => this.setState({ intensity })}
          >
            <List.Item arrow="horizontal">运动强度</List.Item>
          </Picker>
          <div className="inputItem">
            <span>持续时间(分)</span>
            <input className="input" type="number"/>
          </div>
          <div className="button-wrap button-wrap-cover">
            <span className="button-item" onClick={this.cancel}>取消</span>
            <span onClick={this.exerciseSave}>保存</span>
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
