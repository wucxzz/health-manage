import axios from 'axios';  // API访问接口
import Jockey from './jockey';
let APIURL = 'http://59.110.237.168:8080';
// let APIURL = '';
let authToken = null;
let requrl = window.location.href.split('?');
let token = requrl[1];
// let token = '121212121212267ae6369e46bf88490555141340e08a9ea87bac0e87f03c4293ebc5c9d7437'
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
  // config.headers.AuthToken = authToken;
  config.headers.token = token; 
  // config.headers.token = authToken;
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
    // if (authToken || process.env.NODE_ENV === 'development') {
    //   // 如果有authToken 或 是本地开发，那么开始请求
    //   return func.apply(null, arguments)
    // } else {
    //   return getAuthToken().then(() => func.apply(null, arguments))
    // }
    return func.apply(null, arguments)
  }
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

const health = {
  /**
   * 保存 保存血压
   * 方法：POST
   * @param  {object} params   API需要的参数
   * @return {Promise}
   */
  pressureSave: wrap(function(params) {
    const url = APIURL + '/pressure/save'
    return axios.post(url, params)
  }),
  pressureGet: wrap(function(params) {
    const url = APIURL + '/pressure/get'
    return axios.post(url, params)
  }),
  heartGet: wrap(function(params) {
    const url = APIURL + '/heart/get'
    return axios.post(url, params)
  }),
  sugarSave: wrap(function(params) {
    const url = APIURL + '/sugar/save'
    return axios.post(url, params)
  }),
  sugarGet: wrap(function(params) {
    const url = APIURL + '/sugar/get'
    return axios.post(url, params)
  }),
  weightSave: wrap(function(params) {
    const url = APIURL + '/weight/save'
    return axios.post(url, params)
  }),
  weightGet: wrap(function(params) {
    const url = APIURL + '/weight/get'
    return axios.post(url, params)
  }),
  exerciseSave: wrap(function(params) {
    const url = APIURL + '/exercise/save'
    return axios.post(url, params)
  }),
  exerciseGet: wrap(function(params) {
    const url = APIURL + '/exercise/get'
    return axios.post(url, params)
  }),
  yaoSave: wrap(function(params) {
    const url = APIURL + '/yao/save'
    return axios.post(url, params)
  }),
  yaoGet: wrap(function(params) {
    const url = APIURL + '/yao/get'
    return axios.post(url)
  }),
  yaoDelete: wrap(function(params) {
    const url = APIURL + '/yao/delete'
    return axios.post(url, params)
  }),
  userInfo: wrap(function(params) {
    const url = APIURL + '/user/info'
    return axios.post(url)
  }),
  userInfoUpdate: wrap(function(params) {
    const url = APIURL + '/user/info/update'
    return axios.post(url, params)
  }),
  stateGet: wrap(function(params) {
    const url = APIURL + '/state/get'
    return axios.post(url)
  }),
  stateSave: wrap(function(params) {
    const url = APIURL + '/state/save'
    return axios.post(url, params)
  }),
  getMessage: wrap(function(params) {
    const url = APIURL + '/message'
    return axios.get(url)
  }),
}


export default {
  axios,
  common,
  health
};
