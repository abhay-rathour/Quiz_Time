import moment from 'moment';
import React, { Component } from 'react';
import {  Card, CardHeader, CardBody ,CardTitle,CardText,Button} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';
import {Link} from 'react-router-dom'


// A response sheet display component of test type 2

class AdminStudentResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test:{},
            isFetching:false,
        }
       
    }


    componentDidMount(){
        console.log(this.props.match.params)
        const testId=this.props.match.params.testId;
        const bearer= 'Bearer '+localStorage.getItem('token');
        this.setState({...this.state, isFetching: true});
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
            if(test.questions)
            {
                var markedAns=test.response.map((res,i)=>{
                    if((test.questions[i].questionType==='1'&&res.markedAns==="-1")||res.markedAns==='')
                    {
                        return "Unanswered"
                    }
                    else{
                        return res.markedAns
                    }

                })
                if (test.questions.length) 
                {
                    questionlist = test.questions.map((question,index) => {
                        
                        if(question.questionType==='1')
                        {
                            var color=markedAns[index]===question.ans?'bg-success':'bg-danger';
                            return (
                                <Card className="mt-2">
                                <CardHeader as="h5" className={color} variant = 'light'>Question : {index+1}</CardHeader>
                                <CardBody>
                                    <CardTitle>{question.question}</CardTitle>
                                    <CardText>
                                            A. &emsp;{question.A}  
                                            <br/>B. &emsp;{question.B}  
                                            <br/>C. &emsp;{question.C}  
                                            <br/>D. &emsp;{question.D}  
                                            <br/><br/>Correct Option. &emsp;{question.ans} 
                                            <br/>Marked option. &emsp;{markedAns[index]}   
                                            <br/>Marks. &emsp;{question.marks}   
                                    </CardText>    
                                </CardBody>
                             </Card>
                            );
                        }
                        else{
                            return (
                                <Card className="mt-2">
                                <CardHeader as="h5" className="bg-secondary" variant = ''>Question : {index+1}</CardHeader>
                                <CardBody>
                                    <CardTitle>{question.question}</CardTitle>
                                    <CardText>
                                            Response. &emsp;{markedAns[index]}   
                                            <br/>Marks Obtained. &emsp;{test.response[index].marks}/{question.marks}
                                            <br/>Remarks.  &emsp;{test.response[index].remarks} 
                                    </CardText>
                                   

                                </CardBody>
                             </Card>
                            );

                        }
                        
                    })
                }
                else
                {
                    questionlist=(<>No Questions</>)
                }
            }
            else{
                questionlist=(<>Error Occured</>)
            }
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
                                </CardTitle>
                            </CardBody>
                            
                            
                         </Card>
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

                        </div>

                    </div>
                   
                </div>
            )

        }
        
    }
}
export default AdminStudentResult;