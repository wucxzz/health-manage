import React from 'react'
import '../common/common.less'
import { Carousel, WingBlank, Toast, Card, WhiteSpace } from 'antd-mobile'
import API from '../../components/httpAPI'
import './Message.less'

export default class Message extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }
  componentDidMount() {
    API.health.getMessage()
      .then(res => {
        if (res.data.code == 0) {
          this.setState({
            data: res.data.data
          })
        } else {
          console.error('获取数据失败！');
          Toast.fail('获取数据失败!', 3);
        }
      })
      .catch(err => {
        console.error('服务器出错，数据传输失败');
        Toast.fail('服务器错误!', 2);
      })
  }

  render() {
    return (
      <div className="layout">
        <div className="message-header">
          健康常识
        </div>
        <WingBlank>
          <Carousel
            autoplay={true}
            infinite
            beforeChange={(from, to) => {}}
            afterChange={index => {}}
          >
            <a
              href="http://m.people.cn/34/index.html"
              style={{ display: 'inline-block', width: '100%', height: '190px' }}
            >
              <img
                src={require('../../assets/images/timg.jpg')}
                alt=""
                style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>

            <a
              href="https://m.haodf.com/article/"
              style={{ display: 'inline-block', width: '100%', height: '190px' }}
            >
              <img
                src={require('../../assets/images/hdf.jpg')}
                alt=""
                style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>

            <a
              href="http://www.xinhuanet.com/health/"
              style={{ display: 'inline-block', width: '100%', height: '190px' }}
            >
              <img
                src={require('../../assets/images/xinhua.jpg')}
                alt=""
                style={{ width: '100%', height: '100%', verticalAlign: 'top' }}
                onLoad={() => {
                  // fire window resize event to change height
                  window.dispatchEvent(new Event('resize'));
                  this.setState({ imgHeight: 'auto' });
                }}
              />
            </a>
          </Carousel>
        </WingBlank>

        <div>
          <WhiteSpace size="lg" />
          <WingBlank size="sm">
            <Card>
              <Card.Header
                title="高血压"
                thumb={require('../../assets/images/message.png')}
              />
              <Card.Body>
                <div>{this.state.data[0]}</div>
              </Card.Body>
              <Card.Footer />
            </Card>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank size="sm">
            <Card>
              <Card.Header
                title="高血糖"
                thumb={require('../../assets/images/message.png')}
              />
              <Card.Body>
                <div>{this.state.data[1]}</div>
              </Card.Body>
              <Card.Footer />
            </Card>
          </WingBlank>
          <WhiteSpace size="sm" />
          <WingBlank size="sm">
            <Card>
              <Card.Header
                title="BMI"
                thumb={require('../../assets/images/message.png')}
              />
              <Card.Body>
                <div>{this.state.data[2]}</div>
              </Card.Body>
              <Card.Footer />
            </Card>
          </WingBlank>
        </div>
        <WhiteSpace size="lg" />
      </div>
    );
  }
}
