import React, { Component } from 'react';
import { Card, CardBody, CardHeader, CardText, Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import {baseUrl} from '../shared/baseUrl';
import AuthIFrame from './AuthIFrame';

//A component to create exam interface of Assignment type Exam where 
// student is diplayed pdf of question paper or list of question and he is asked to enter answers

class Exam3 extends Component {
  constructor(props) {
    super(props)

    this.state = {
        endTime: Date.now(),
        questions: [],
        selectedFile: undefined,
        disabledSubmit: true,
        testid : '',
        testType : '1',
        groupid : '',
        time: {},
        questionsLink: undefined,
        numberOfQuestions: 0,
        isExamCompleted : false,
		    isQuestionInPDF : false,
        isInstructionsToBeDisplayed : true,
        warningMessage : ''
    };
    this.interval =null;
    this.handleFileChange = this.handleFileChange.bind(this);
    this.startTimer= this.startTimer.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }  
  componentDidMount() {
    const param = this.props.match.params
    this.setState({
      // studentid : param.studentId,
      groupid : param.groupId,
      testid : param.testId,
      token:localStorage.getItem('token')
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
      // console.log(res)
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
          endTime : res.remainingTime,
          testType: res.testType,
		      isQuestionInPDF: res.isQuestionInPDF
        })  
        console.log(this.state)
        this.startTimer()
      }
          
    }).catch(err => alert(err))
  
  }
  
  handleFileChange(event){
    if(!this.state.selectedFile)
    {
      this.setState({
        disabledSubmit:!this.state.disabledSubmit
      })
    }
    this.setState({
      selectedFile: event.target.files[0]
    })
    console.log(this.state.selectedFile, event.target.files[0])
  }

  nextQuestion(){
    const bearer= 'Bearer '+localStorage.getItem('token');
    if(this.state.isQuestionInPDF)
    {
      this.setState({
        questionsLink: `${baseUrl}tests/${this.state.testid}/testPaper`,
        isInstructionsToBeDisplayed : false
      })
    }else{
      fetch(`${baseUrl}tests/${this.state.testid}/testPaper`,{
        method:'GET',
        headers: {
          "Content-Type": "application/json",
          'Authorization': bearer
        },
        credentials: "same-origin"
      })
      .then(res1 => res1.json())
      .then(res => {
        // console.log(res.questions)
        this.setState({
          questions: res.questions,
          isInstructionsToBeDisplayed : false
        })
      })
      .catch(err => console.log(err))
    }
  }
  handleSubmit( event){
    event.preventDefault();
    var formData = new FormData();
    console.log(this.state.selectedFile);
    formData.append('file', this.state.selectedFile);
    console.log(formData);
    const bearer= 'Bearer '+localStorage.getItem('token');
    fetch(baseUrl + 'tests/'+this.state.testid+'/uploadAssignment',{
      method:'POST',
      body: formData,
      headers: {
        'Authorization': bearer
      },
      credentials: "same-origin"
    })
    .then(res => res.json())
    .then(res => {
      console.log('ok')
      this.setState({
        isExamCompleted: true,
        questions: undefined
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
    }else if(this.state.isExamCompleted){
      return (
        <div className='container'>
          <Card className="mb-5 mt-5">
            <center><CardHeader className="bg-info text-white text-center">RESULT</CardHeader></center>
          </Card>
          <CardBody>
            <center>
              <CardText><h2>Exam over... Wait for the examiner to evaluate...</h2></CardText>
              <Link to={`/studentgroups/${this.props.match.params.groupId}`}><Button color="success">Go to my test</Button></Link>
            </center> 
          </CardBody>
        </div>
      )
    }
    else if (this.state.questionsLink ) {
      return (
        <div className='container'>
          <div className="row justify-content-center mt-5"><h2>Time Left:- {this.state.time.hour}:{this.state.time.min}:{this.state.time.sec}</h2></div>
          <Card className="mb-5 mt-5">
            <CardHeader className="bg-info text-white text-center">Questions</CardHeader>
          </Card>
          <CardBody>
		 	      <div style={{ width: '100%', height: 'auto' }}>
                   <AuthIFrame  src = {this.state.questionsLink}
                        token={localStorage.getItem('token')}
                        type="application/pdf" 
                        frameBorder="3"
                        scrolling="auto"
                        height="900px"
                        width="100%"
                        title="Testpaper"
                        />
                {/* <iframe title="examPaper"
                    src={this.state.questionsLink}
                    frameBorder="3"
                    scrolling="auto"
                    height="900px"
                    width="100%"
                ></iframe> */}
                <center>
                  <h4>Solve all the question mentioned in above file and upload the PDF of your assignment. Form will close automatically when time runs out.</h4>
                  <form method='post' encType='multipart/form-data'>
                    <br/><input type='file' id="exampleFormControlFile1" name="paper"label="Paper" onChange={this.handleFileChange}/>
                    <Button disabled={this.state.disabledSubmit} type="submit" color="success" onClick={this.handleSubmit}>Submit</Button>
                  </form>
                </center>
			      </div>
          </CardBody>
        </div>
      )
    }else if (this.state.questions ) {
      var questionHTML = this.state.questions.map((question,index)=>{
        return (
          <><br/>{index+1}. &emsp; {question.question} &emsp; <b>[{question.marks} marks]</b></>
        )
      })
      return (
        <div className='container'>
          <div className="row justify-content-center mt-5"><h2>Time Left:- {this.state.time.hour}:{this.state.time.min}:{this.state.time.sec}</h2></div>
          <Card className="mb-5 mt-5">
            <CardHeader className="bg-info text-white text-center">Questions</CardHeader>
          </Card>
          <CardBody>
		 	      <div style={{ width: '100%', height: 'auto' }}>
				        {questionHTML}
                <center>
                <h4>Solve all the question mentioned in above file and upload the PDF of your assignment. Form will close automatically when time runs out.</h4>
                  <form method='post' encType='multipart/form-data'>
                    <br/><input type='file' id="exampleFormControlFile1" name="paper"label="Paper" onChange={this.handleFileChange}/>
                    <Button disabled={this.state.disabledSubmit} type="submit" color="success" onClick={this.handleSubmit}>Submit</Button>
                  </form>
                </center>
			      </div>
          </CardBody>
        </div>
      )
    } else {
      return <span>Error</span>
    }
  }
}

export default Exam3;