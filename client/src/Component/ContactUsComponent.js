import React, { Component } from 'react'
import * as emailjs from 'emailjs-com'
// emailjs.init('user_yprI4H79h2JW33apW4oPD');
// import Layout from '../components/layout'
import { Button, Form, FormGroup, Label, Input, Col } from 'reactstrap'
class Contact extends Component {
  state = {
    name: '',
    email: '',
    subject: '',
    message: '',
  }
handleSubmit(e) {
    e.preventDefault()
    const { name, email, subject, message } = this.state
    let templateParams = {
      from_name: name,
      reply_to: email,
      subject: subject,
      message_html: message,
     }
     emailjs.send(
      'quizTimeFeedback_376',
      'template_7jw4s6a',
       templateParams,
      'user_yprI4H79h2JW33apW4oPD'
     )
     this.resetForm()
 }
resetForm() {
    this.setState({
      name: '',
      email: '',
      subject: '',
      message: '',
    })
  }
handleChange = (param, e) => {
    this.setState({ [param]: e.target.value })
  }
render() {
    return (
      <>
        <div className="container">
            <div className="row">
            <div className="col-12" style={{'padding-top':20+'px'}}>
                <h1 className="p-heading1">Get in Touch</h1>
            </div>
            </div>
          <div className="row  row-content">
              <div className="col-12">

          <Form onSubmit={this.handleSubmit.bind(this)}>
            <FormGroup  row controlId="formBasicEmail">
              <Label className="text-muted " md={2}>Email address</Label>
              <Col md={10}>
              <Input
                type="email"
                name="email"
                value={this.state.email}
                className="text-primary"
                onChange={this.handleChange.bind(this, 'email')}
                placeholder="Enter email"
              />
              </Col>
              
            </FormGroup>
<FormGroup row controlId="formBasicName">
              <Label className="text-muted " md={2}>Name</Label>
              <Col md={10}>
              <Input
                type="text"
                name="name"
                value={this.state.name}
                className="text-primary"
                onChange={this.handleChange.bind(this, 'name')}
                placeholder="Name"
              />
              </Col>
             
            </FormGroup>
<FormGroup row controlId="formBasicSubject ">
              <Label className="text-muted" md={2}>Subject</Label>
              <Col md={10}>
              <Input
                type="text"
                name="subject"
                className="text-primary"
                value={this.state.subject}
                onChange={this.handleChange.bind(this, 'subject')}
                placeholder="Subject"
              />
              </Col>
              
            </FormGroup>
<FormGroup row controlId="formBasicMessage">
              <Label className="text-muted " md={2}>Message</Label>
              <Col md={10}>
              <Input
                type="textarea"
                name="message"
                className="text-primary"
                value={this.state.message}
                onChange={this.handleChange.bind(this, 'message')}
              />
              </Col>
              
            </FormGroup>
<Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
          </div>
       </div>
       </div>
      </>
    )
  }
}
export default Contact