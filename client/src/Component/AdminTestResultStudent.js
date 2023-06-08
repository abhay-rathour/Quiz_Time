import moment from 'moment';
import React, { Component } from 'react';
import {  Card, CardHeader, CardBody ,CardTitle,CardText} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';

//A component to display reponses of test type 1 MCQ Type


class AdminStudentResult extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test:{},
            isFetching:false
        }
    }
    componentDidMount(){
        const testId=this.props.match.params.testId;
        const studentId=this.props.match.params.studentId;
        const bearer= 'Bearer '+localStorage.getItem('token');
        this.setState({...this.state, isFetching: true});
        fetch(baseUrl+'admin/'+testId+'/getCompletedQuestions/'+studentId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                console.log(result)
                this.setState({test: result, isFetching: false})
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
        else{
            const test=this.state.test;
            console.log(test);
            var questionlist;
            if(test.questions)
            {
                var markedAns=test.response.map((res)=>{
                    if(res.markedAns==="-1")
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
                                        <br/>Marks Obtained.&emsp;{test.response[index].marks}   
                                </CardText>    
                            </CardBody>
                         </Card>
                        );
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
            var neg=test.negative?"Yes":"No";
            var negP=test.negative?test.negPercentage:0;
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
                                        <br/> Negative Marking: &emsp;{neg}
                                        <br/> Negative Percentage: &emsp;{negP}%
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