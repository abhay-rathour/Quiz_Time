import moment from 'moment';
import React, { Component } from 'react';
import {  Card, CardHeader, CardBody ,CardTitle,CardText,Form,FormGroup,Input,Button} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';


// Component to display Test type 2 response sheet of  student and option to give marks for fill up type answers and finish evaluation

class AdminStudentResult2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test:{},
            isFetching:false,
        }
        this.handleEvaluate=this.handleEvaluate.bind(this);
        this.SubmitEvaluate=this.SubmitEvaluate.bind(this);
        this.finishEvaluate=this.finishEvaluate.bind(this);
    }

    handleEvaluate(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const ind=target.dataset.tag;
        var testnew=this.state.test;
        console.log(target);
        console.log(ind);

        testnew.response[ind][name]=value;
        this.setState({
           test:testnew
        });
    }
    SubmitEvaluate(event){
        event.preventDefault();
        const ind=event.target.dataset.tag;
        // questionIndex=index;
        // const studentId=this.props.match.params.studentId;
        // const testid=this.props.match.params.testId;
        
        var evaluatedData={
            marks:this.state.test.response[ind].marks,
            remarks:this.state.test.response[ind].remarks,
            questionIndex:ind,
            studentId:this.props.match.params.studentId,
            testid:this.props.match.params.testId
        }
        console.log(evaluatedData);
        const bearer= "Bearer "+localStorage.getItem('token');
        fetch(baseUrl+'admin/evaluate',{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "Authorization":bearer,
            },
            credentials: "same-origin",
            body:JSON.stringify(evaluatedData)
        }).then(response => response.json())
        .then(result => {
            console.log(result)
            this.setState({test: result, isFetching: false})
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state, isFetching: false});
        });

    }
    finishEvaluate(){
        var evaluatedData={
            studentId:this.props.match.params.studentId,
            testid:this.props.match.params.testId
        }
        const bearer= "Bearer "+localStorage.getItem('token');
        fetch(baseUrl+'admin/evaluate',{
            method:'PUT',
            headers:{
                "Content-Type": "application/json",
                "Authorization":bearer,
            },
            credentials: "same-origin",
            body:JSON.stringify(evaluatedData)
        }).then(response => response.json())
        .then(result => {
            console.log(result)
            this.setState({test: result, isFetching: false})
            this.props.history.push(`/adminSummary/2/${evaluatedData.testid}`)
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state, isFetching: false});
        });

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
                            var color='bg-success';
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
                                <CardHeader as="h5" className="bg-danger" variant = ''>Question : {index+1}</CardHeader>
                                <CardBody>
                                    <CardTitle>{question.question}</CardTitle>
                                    <CardText>
                                            Response. &emsp;{markedAns[index]}   
                                            <br/>Marks. &emsp;{question.marks}   
                                    </CardText>
                                    <Form>
                                        <FormGroup row>  
                                            <Input type="number" name="marks" id="marks" data-tag={index} value={test.response[index].marks} onChange={this.handleEvaluate} placeholder="Enter marks for response"/>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Input type="text" name="remarks" id="remarks" data-tag={index} value={test.response[index].remarks} onChange={this.handleEvaluate} placeholder="Remarks"/>
                                        </FormGroup>
                                        <Button type="submit" data-tag={index} className="btn-success" onClick={this.SubmitEvaluate}>Evaluate</Button>
                                    </Form>

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

            var finishButton=!test.isEvaluated?(<><Button type="submit" className="btn-success" onClick={this.finishEvaluate}>Finish</Button></>):(<></>);

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
                         {finishButton}
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
export default AdminStudentResult2;