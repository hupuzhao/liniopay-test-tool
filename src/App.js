import React, { Component } from 'react';
import { Form, Icon, Input, Button, Card, Row, Col, Radio } from 'antd';
import axios from 'axios';
import ReactJson from 'react-json-view';
import './App.css';

const PHPClient = 'http://127.0.0.1/linioapi/client.php';
const FormItem = Form.Item;
const { TextArea } = Input;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Index extends Component {
    state = {
        loading: false,
        result: {}
    };

    componentDidMount() {
        // To disabled submit button at the beginning.
        this.props.form.validateFields();
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    loading: true
                });
                axios.post(PHPClient, values).then(function (response) {
                    this.setState({
                        loading: false,
                        result: response.data
                    })

                }.bind(this)).catch(function (error) {
                    this.setState({
                        loading: false
                    });
                    console.log(error);
                }.bind(this));
            }
        });
    };
    render() {
      const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

      // Only show error after a field is touched.
      const accessKeyError = isFieldTouched('accessKey') && getFieldError('accessKey');
      const sharedSecretKeyError = isFieldTouched('sharedSecretKey') && getFieldError('sharedSecretKey');
      const apiError = isFieldTouched('api') && getFieldError('api');
      return (
          <Row>
              <Col span={12} offset={6}>
                  <Card style={{textAlign: 'center', marginTop: '16px'}}>
                      <Form onSubmit={this.handleSubmit}>
                          <FormItem
                              validateStatus={accessKeyError ? 'error' : ''}
                              help={accessKeyError || ''}
                          >
                              {getFieldDecorator('accessKey', {
                                  rules: [{ required: true, message: 'Please input your Access Key!' }],
                              })(
                                  <Input prefix={<Icon type="key" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Access Key" />
                              )}
                          </FormItem>
                          <FormItem
                              validateStatus={sharedSecretKeyError ? 'error' : ''}
                              help={sharedSecretKeyError || ''}
                          >
                              {getFieldDecorator('sharedSecretKey', {
                                  rules: [{ required: true, message: 'Please input your Shared Secret Key!' }],
                              })(
                                  <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Shared Secret Key" />
                              )}
                          </FormItem>
                          <FormItem
                              validateStatus={apiError ? 'error' : ''}
                              help={apiError || ''}
                          >
                              {getFieldDecorator('api', {
                                  rules: [{ required: true, message: 'Please input request API!' }],
                              })(
                                  <Input
                                      addonBefore={'https://api.liniopay.com/'} placeholder="API" />
                              )}
                          </FormItem>
                          <FormItem>
                              {getFieldDecorator('body')(
                                  <TextArea placeholder="Body" />
                              )}
                          </FormItem>
                          <FormItem>
                              {getFieldDecorator('method', {
                                  initialValue: 'POST'
                              })(
                                  <Radio.Group>
                                      <Radio.Button value="POST">POST</Radio.Button>
                                      <Radio.Button value="GET">GET</Radio.Button>
                                      <Radio.Button value="PUT">PUT</Radio.Button>
                                  </Radio.Group>
                              )}
                          </FormItem>
                          <FormItem>
                              <Button
                                  type="primary"
                                  htmlType="submit"
                                  loading={this.state.loading}
                                  disabled={hasErrors(getFieldsError())}
                              >
                                  Go!
                              </Button>
                          </FormItem>
                      </Form>
                  </Card>
                  <Card loading={this.state.loading}>
                      <ReactJson src={this.state.result} name={false} />
                  </Card>
              </Col>
          </Row>
      );
    }
}

const App = Form.create()(Index);

export default App;
