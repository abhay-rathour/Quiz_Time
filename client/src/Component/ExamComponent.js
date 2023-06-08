import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardText, Form, Button, FormGroup, Input, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
// import { TEST } from '../shared/questions';
import {baseUrl} from '../shared/baseUrl';


//A component to create exam interface of MCQ type exam


class Exam extends Component {
  constructor(props) {
    super(props)

    this.state = {
        endTime: Date.now(),
        questions: {},
        index: 0,
        disabledNext: false,
        disabledSubmit: true,
        result: undefined,
        answer: '-1',
        testid : '',
        // studentid : '',
        groupid : '',
        time: {},
        numberOfQuestions: 0,
        isExamCompleted : false,
        isInstructionsToBeDisplayed : true,
        warningMessage : ''
    };
    this.interval =null;
    this.handleOptionChange = this.handleOptionChange.bind(this);
    this.startTimer= this.startTimer.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleOptionChange(option) {
    if(this.state.answer === option){
      this.setState({
        answer:'-1'
      })
    } else {
      this.setState({
        answer:option
      })
    }
  }
  
  componentDidMount() {
    const param = this.props.match.params
    this.setState({
      // studentid : param.studentId,
      groupid : param.groupId,
      testid : param.testId
    })
    const bearer= 'Bearer '+localStorage.getItem('token');
    fetch(baseUrl + 'tests/'+param.groupId+'/start/'+param.testId,{
      method:'GET',
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin"
    })
    .then(response => 
      // console.log(response);
      response.json())
    .then(res =>{
      console.log(res)
      if(res.message)
      {
        this.setState({
          warningMessage : res.message,
          isInstructionsToBeDisplayed : false
        })
      }
      else{
        this.setState({
          questions : {},
          index : 0,
          numberOfQuestions: res.totalNumberOfQuestions,
          endTime : res.remainingTime
        })  
        console.log(this.state)
        this.startTimer()
      }
          
    }).catch(err => alert(err))
  
  }

  nextQuestion(){
    const bearer= 'Bearer '+localStorage.getItem('token');
    const answer={
      ans:this.state.answer,
    }
    fetch(baseUrl + `tests/${this.state.testid}/next/${this.state.index + 1}`,{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin",
      body:JSON.stringify(answer)
    })
    .then(response => response.json())
    .then(res =>{
      this.setState({
        questions : res,
        index : res.number,
        answer:'-1',
        isInstructionsToBeDisplayed : false,
        warningMessage : ''
      })
      if(res.number === this.state.numberOfQuestions)
        this.setState({ 
          disabledNext : true,
        disabledSubmit : false
      })
    })
  }
  handleSubmit(){
    const bearer= 'Bearer '+localStorage.getItem('token');
    const answer={
      ans:this.state.answer,
    }
    fetch(baseUrl + `tests/${this.state.testid}/next/${this.state.index + 1}`,{
      method:'POST',
      headers: {
        "Content-Type": "application/json",
        'Authorization': bearer
      },
      credentials: "same-origin",
      body:JSON.stringify(answer)
    })
    .then(response => response.json())
    .then(res => {
      this.setState({
        result : res,
        isExamCompleted : true,
        questions : undefined
      })
    })
  }
  
  startTimer =()=>{
    console.log(this.state)
    const countDownTime = (this.state.endTime);
    this.interval=setInterval(()=>{
      const now = Date.now();
      const distance = countDownTime - now;
      var hours =Math.floor((distance%(1000*60*60*60))/(1000*60*60));
      var minutes =Math.floor((distance%(1000*60*60))/(1000*60));
      var seconds =Math.floor((distance%(1000*60))/(1000));
      if(hours<10)
      {
        hours= '0'+hours;
      }
      if(minutes<10)
      {
        minutes= '0'+minutes;
      }
      if(seconds<10)
      {
        seconds= '0'+seconds;
      }

      if(distance<0){
        clearInterval(this.interval);
        this.setState({
          time:{
            hour:0,
            min:0,
            sec: 0
          }
        },this.handleSubmit());
      }
      else{
        this.setState({
          time:{
            hour:hours,
            min:minutes,
            sec: seconds
          }
        })
      }
    },1000);
  }

  render() {

    const question = this.state.questions 

    if(this.state.warningMessage){
      return (
        <div className='container'>
          <Card className="mb-5 mt-5">
            <center><CardHeader className="bg-danger text-white text-center">WARNING</CardHeader></center>
          </Card>
          <CardBody>
            <center>
              <CardText><h2>{this.state.warningMessage}</h2></CardText>
              <Link to={`/studentgroups/${this.props.match.params.groupId}`}><Button color="success">Go to my test</Button></Link>
            </center> 
          </CardBody>
        </div>
      )
    } else if(this.state.isInstructionsToBeDisplayed)
    {
      return (
        <div className='container'>
          <div className="row justify-content-center mt-5"><h2>Time Left:- {this.state.time.hour}:{this.state.time.min}:{this.state.time.sec}</h2></div>
          <Card className="mb-5 mt-5">
            <center><CardHeader className="bg-info text-white text-center">INSTRUCTIONS</CardHeader></center>
          </Card>
          <CardBody>
            <CardText>
              <ul>
                <li>There is no choice available for going back to previous question.</li>
                <li>In case of any difficulty, contact your admin.</li>
                <li><b>All the best!!!</b></li>
              </ul>
              <Button color="success" onClick = {this.nextQuestion}>Go to questions</Button>
            </CardText>
          </CardBody>
        </div>
      )
    }
    else if (question) {
      return (
        <div className='container'>
          <div className="row justify-content-center mt-5"><h2>Time Left:- {this.state.time.hour}:{this.state.time.min}:{this.state.time.sec}</h2></div>
          <Card className="mb-5 mt-5">
            <CardHeader className="bg-info text-white text-center">{question.number} / {this.state.numberOfQuestions}</CardHeader>
          </Card>
          <CardBody>
            <CardText><h2>{question.question}</h2></CardText>
            <Form className="offset-md-1">
              <FormGroup row >
                <Label check >
                  <Input type="checkbox" value="A" checked={this.state.answer=== 'A'}  onClick={()=>this.handleOptionChange('A')}/>
                  {question.A}
                </Label>
              </FormGroup>
              {/* <FormGroup check>
                                <Label check>
                                    <Input type="checkbox"
                                        name="admin"
                                        checked={this.state.agree}
                                        onChange={this.handleInputChange} /> {' '}
                                    <strong>Administrator Account</strong>
                                </Label>
              </FormGroup> */}
              <FormGroup row>
                <Label check >
                  <Input type="checkbox" value="B" checked={this.state.answer=== 'B'} onClick={()=>this.handleOptionChange('B')}/>
                  {question.B}
                </Label>
              </FormGroup>
              <FormGroup row>
                <Label check >
                  <Input type="checkbox" value="C" checked={this.state.answer=== 'C'} onClick={()=>this.handleOptionChange('C')}/>
                  {question.C}
                </Label>
              </FormGroup>
              <FormGroup row >
                <Label check>
                  <Input type="checkbox" value="D" checked={this.state.answer=== 'D'} onClick={()=>this.handleOptionChange('D')}/>
                  {question.D}
                </Label>
              </FormGroup>
            </Form>
            <div>
              {/* <Next toggle={(e) => this.toggleNext(e)} nextQuestion={this.nextQuestion} active={disabledNext} />
              <Submit toggle={(e) => this.toggleSubmit(e)} disabled={disabledSubmit} /> */}
                <Button color="primary" onClick ={this.nextQuestion} disabled={this.state.disabledNext}>Next</Button>
                <Button color="success" onClick={this.handleSubmit} disabled={this.state.disabledSubmit}>Submit</Button>
            </div>
          </CardBody>
        </div>
      )
    } else if(this.state.isExamCompleted){
      return (
        <div className='container'>
          <Card className="mb-5 mt-5">
            <center><CardHeader className="bg-info text-white text-center">RESULT</CardHeader></center>
          </Card>
          <CardBody>
            <center>
              {/* <CardText><h2>Marks obtained : <b>{this.state.score}</b></h2></CardText> */}
              <CardText><h2><b>{this.state.result.Message}</b></h2></CardText>
              <Link to={`/studentgroups/${this.props.match.params.groupId}`}><Button color="success">Go to my test</Button></Link>
            </center> 
          </CardBody>
        </div>
      )
    } else {
      return <span>Error</span>
    }
  }
}

export default Exam;