import axios from 'axios';  // API访问接口
import Jockey from './jockey';
// let APIURL = '//test-bi.baijiahulian.com';
let authToken = null;

function getAuthToken () {
  return new Promise((resolve, reject) => {
    // 让APP设置 setAuthToken事件
    Jockey.send('getAuthToken', {
      jockeyType: 'setAuthToken'
    });
    // 调用事件读取数据
    Jockey.on('setAuthToken', function (response) {
      authToken = response.authToken;
      resolve(authToken)
    });
  });
}

// axios的配置信息：
// let axiosConfig = {
//   method: 'get',            // 请求的方法,默认值是get
//   url: '',                  // 请求的接口地址
//   baseURL: '',              // 当`url`是相对地址的时候，设置`baseURL`会非常的方便
//   params: '',               // 请求的参数
//   headers: {                // `headers`选项是需要被发送的自定义请求头信息
//     'AuthToken': authToken,
//   },
// }
// 请求拦截（配置发送请求的信息）
axios.interceptors.request.use(function (config){
  // 配置 请求头AuthToken
  config.headers.AuthToken = authToken;
   // 处理请求之前的配置
   return config;
   }, function (error){
   // 请求失败的处理
   return Promise.reject(error);
   });


/**
 * 包装函数，在API请求前判断是都已经得到authToken，
 * @param {function} func   请求的axios函数
 */
function wrap (func) {
  return function () {
    if (authToken || process.env.NODE_ENV === 'development') {
      // 如果有authToken 或 是本地开发，那么开始请求
      return func.apply(null, arguments)
    } else {
      return getAuthToken().then(() => func.apply(null, arguments))
    }
  }
}

// 规则配置API
const rule = {
  /**
   * 获取：业务线、一级品类、二级品类、三级品类列表
   * API介绍地址：http://ewiki.baijiahulian.com/基础技术部/运营系统/BI/品类对应关系.md
   * @param  {number} id   查询的ID
   * @return {Promise}
   */
  getBusinessLine: wrap((id = 0) => {
    const params = {
      parentId: id
    }
    return axios.post('/relationInfo/getRelationList',params);
  }),
}

// 数据统计API
const statistics = {
  /**
   * 获取 统计收入详情 图表
   * API介绍地址：http://ewiki.baijiahulian.com/基础平台部/运营系统/BI/统计/统计收入详情.md
   * url: /statistics/getStatisticsDetail
   * 方法：POST
   * @param  {object} params   API需要的参数
   * @return {Promise}
   */
  getStatisticsDetail: wrap(function(params) {
      return axios.post('/statistics/getStatisticsDetail', params)
  }),
  
  /**
   * 获取 品类收入占比列表
   * API介绍地址：http://ewiki.baijiahulian.com/基础平台部/运营系统/BI/统计/品类收入占比列表.md
   * url: /statistics/getProportionList
   * 方法：POST
   * @param  {object} params   API需要的参数
   * @return {Promise}
   */
  getProportionList: wrap( (params) => {
    return axios.post('/statistics/getProportionList', params);
  }),
  /**
   * 获取 获取数据最后更新时间
   * url: /common/getRefreshTime.ajax
   * 方法：POST
   * @return {Promise}
   */
  getRefreshTime: wrap( () => {
    return axios.post('/common/getRefreshTime.ajax');
  }),
}

// 登陆信息、退出登陆接口
const auth = {
  /**
   * 获取 获取用户登陆的信息
   * url: /ac/getAuth.ajax
   * 方法：POST
   * @return {Promise}
   */
  getAuth: wrap( () => {
    return axios.post('/ac/getAuth.ajax');
  }),
}

// 获取每年每周日期列表接口
const common = {
  /**
   * 获取 获取某年每周日期列表
   * url: /common/getWeekList
   * 方法：POST
   * @param  {object} params   API需要的参数
   * @return {Promise}
   */
  getWeekList: wrap( (params) => {
    return axios.post('/common/getWeekList', params);
  })
}


export default {
  axios,
  rule,
  statistics,
  auth,
  common
};
