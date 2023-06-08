import moment from 'moment';
import React, { Component } from 'react';
import {  Card, CardHeader, CardBody ,CardTitle,CardText,Button} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';
import {Link} from 'react-router-dom';
import AuthIFrame from './AuthIFrame';

// A response sheet display component of test type 1

class StudentResult3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test:{},
            isFetching:true,
            questionsLink:undefined,
            token:''

        }
    }
    
    componentDidMount(){
        const testId=this.props.match.params.testId;
        const bearer= 'Bearer '+localStorage.getItem('token');
        const token=localStorage.getItem('token');
        this.setState({...this.state,token:token, isFetching: true});
        fetch(baseUrl+'student/'+testId+'/getCompletedQuestions/', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                if(result.warningMssg)
                {
                    console.log(result);
                    this.setState({...this.state, isFetching: false,message:result.warningMssg, test:{}});
                }
                else{
                    // console.log(result)
                this.setState({test: result, isFetching: false})

                }
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });

    }

    render() {
        if(this.state.isFetching)
        {
            return(
                <>Loading-----</>
            )
        }
        else if(this.state.message){
            return(
                <div className='container'>
                    <Card className="mb-5 mt-5">
                    <center><CardHeader className="bg-danger text-white text-center">WARNING</CardHeader></center>
                        
                    <CardBody>
                    <center>
                    <CardText><h2>{this.state.message}</h2></CardText>
                    <Link to='/student'><Button color="success">Go to my test</Button></Link>
                    </center> 
                </CardBody>
          </Card>
        </div>
                
            );
        }
        else{
            const test=this.state.test;
            console.log(test);
            var questionlist;
            if(!test.isQuestionInPDF)
            {
                if (test.questions.length) 
                {
                    questionlist = test.questions.map((question,index) => {
                       
                            return (
                                <><br/>{index+1}. &emsp; {question.question} &emsp; <b>[{question.marks} marks]</b></>
                            );  
                    })
                }
                else
                {
                    questionlist=(<>No Questions</>)
                }
            }

            var questionWritten=test.isQuestionInPDF?(<>
                <div style={{ width: '100%', height: 'auto' }}>
                <AuthIFrame  src = {`${baseUrl}student/${this.props.match.params.testId}/testPaper`}
                        token={this.state.token}
                        type="application/pdf" 
                        frameBorder="3"
                        scrolling="auto"
                        height="900px"
                        width="100%"
                        title="Testpaper"
                        />
                </div>
                </>):(<>
                <Card className="mb-5 mt-5 ">
                    <CardHeader className="bg-info text-white text-center">
                        Marks Obtained: {test.marksObtained} / {test.totalMarks} 
                    </CardHeader>
                    <CardBody>
                        <ul className="list-unstyled">
                                {questionlist}
                        </ul>
                    </CardBody>
                </Card>
                </>);
            
            var responselist=this.state.test.response.map((res,i)=>{
                return(
                    <Card className="mt-2">
                        <CardHeader as="h5" className="bg-secondary" variant = ''>Question : {i+1}</CardHeader>
                        <CardBody>
                            Marks Obtained. &emsp;{res.marks}
                            <br/>Remarks.  &emsp;{res.remarks} 
                        </CardBody>
                    </Card>

                );

            })
            return (
                <div className="container">
                    <div className="row">
                        <div className="col-12 justify-content-center">
                            <Card className="mt-2 mb-2">
                                <CardHeader as="h5" className="bg-warning">Test Details</CardHeader>
                                <CardBody>
                                    <CardTitle>Title: &emsp;{test.title}
                                        <br/>Subject:  &emsp;{test.subject}
                                        <br/>Duration: &emsp;{test.duration} (in min)
                                        <br/>Start Date: &emsp;{moment.utc(test.startDate).local().format('llll')}
                                        <br/>Marks Obtained: {test.marksObtained} / {test.totalMarks} 
                                    </CardTitle>
                                </CardBody>
                            </Card>
                        </div>
                    </div>  
                    <div className="row">
                        <div className="col-6 justify-content-center">
                            {questionWritten}
                        </div>
                        <div className="col-6 justify-content-center">
                            <>
                                <div style={{ width: '100%', height: 'auto' }}>
                                <AuthIFrame
                                    title= "responseSheet"
                                    src={`${baseUrl}student/${this.props.match.params.testId}/testresponse`}
                                    frameBorder="3"
                                    token={this.state.token}
                                    type="application/pdf"
                                    scrolling="auto"
                                    height="900px"
                                    width="100%"/>
                                </div>
                            </>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <div className="col-12">
                            {responselist}
                        </div>
                    </div>    
                </div>
            )

        }
        
    }
}
export default StudentResult3;