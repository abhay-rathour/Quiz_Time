import moment from 'moment';
import React, { Component } from 'react';
import {  Card, CardHeader, CardBody ,CardTitle,Form,FormGroup,Input,Button,Col,Modal,ModalBody,ModalHeader,Label} from 'reactstrap';
import {baseUrl} from '../shared/baseUrl';
import AuthIFrame from './AuthIFrame';



// Component to display Test type 3 response sheet of  student and option to give marks for  answers and finish evaluation


class AdminStudentResult3 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            test:{},
            isFetching:true,
            questionsLink:undefined,
            isModalOpen: false,
            questionNumber:0,
            token:'',
        }
        this.handleEvaluate=this.handleEvaluate.bind(this);
        this.SubmitEvaluate=this.SubmitEvaluate.bind(this);
        this.finishEvaluate=this.finishEvaluate.bind(this);
        this.toggleModal=this.toggleModal.bind(this);
    }
    toggleModal() {
        this.setState({
            isModalOpen: !this.state.isModalOpen,
            // questionType:this.state.test.testType,
        });
    }
    handleEvaluate(event){
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const ind=this.state.questionNumber;
        var testnew=this.state.test;
        if(name==='questionNumber')
        {
            this.setState({
                questionNumber:value
             });

        }
        else
        {
            
            testnew.response[ind][name]=value;

            this.setState({
               test:testnew
            }); 

        }

        // testnew.response[ind][name]=value;
    }
    SubmitEvaluate(event){
        event.preventDefault();
        
        // questionIndex=index;
        // const studentId=this.props.match.params.studentId;
        // const testid=this.props.match.params.testId;
        var evaluatedData={
            marks:this.state.test.response[this.state.questionNumber].marks,
            remarks:this.state.test.response[this.state.questionNumber].remarks,
            questionIndex:this.state.questionNumber,
            studentId:this.props.match.params.studentId,
            testid:this.props.match.params.testId
        }
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
            if(result.isQuestionInPDF)
            {
                this.setState({
                    questionsLink:`${baseUrl}admin/${evaluatedData.testid}/testPaper`
                })
            }
            this.setState({test: result, isFetching: false})
            this.toggleModal();
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state, isFetching: false});
            this.toggleModal();
        });

    }
    finishEvaluate(event){
        event.preventDefault();
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
            // console.log(result)
            // this.setState({test: result, isFetching: false})
            this.props.history.push(`/adminSummary/3/${evaluatedData.testid}`)
        })
        .catch(e => {
            console.log(e);
            this.setState({...this.state, isFetching: false});
        });

    }
    componentDidMount(){
        const testId=this.props.match.params.testId;
        const studentId=this.props.match.params.studentId;
        const token=localStorage.getItem('token');
        const bearer= 'Bearer '+localStorage.getItem('token');

        this.setState({...this.state,token:token, isFetching: true});
        fetch(baseUrl+'admin/'+testId+'/getEvaluationData/'+studentId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                // console.log(result)
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
            var finishButton=!test.isEvaluated?(<><Button type="submit" className="btn-success justify-self-left" onClick={this.finishEvaluate}>Finish</Button></>):(<></>);

            var questionWritten=test.isQuestionInPDF?(
            <>
                <div style={{ width: '100%', height: 'auto' }}>
                    <AuthIFrame  src = {`${baseUrl}admin/${this.props.match.params.testId}/testPaper`}
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
            var options=[]
                    for(var i=0;i<test.totalQuestions;i++)
                    {
                        options.push(<option id={i} value={i}>{i+1}</option>);
                    }

            var questionNumberInput= (
            <>
            <FormGroup row>
                <Label htmlFor="testType" md={2}>Question Number </Label>
                <Col md={10}>
                    <Input type="select" id="questionNumber" name="questionNumber" value={this.state.questionNumber} onChange={this.handleEvaluate} >
                        {options}
                    </Input>
                </Col>
            </FormGroup>
            </>);       
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
                    <div className="row ">
                        <div className="col ">
                            {finishButton}
                            </div>
                            <div className="col ">
                            <Button type="submit" className=" float-right btn-success"  onClick={this.toggleModal}>Evaluate</Button>
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
                                    src={`${baseUrl}admin/${this.props.match.params.testId}/testPaper/${this.props.match.params.studentId}`}
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

                    <Modal className="modal-lg" isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}><strong>Evaluate Question</strong></ModalHeader>
                        <ModalBody >
                            <Form onSubmit={this.SubmitEvaluate}>
                                {questionNumberInput}
                                <FormGroup row>
                                    <Label htmlFor="marks" md={2}>Marks. </Label>
                                    <Col md={10}>
                                        <Input type="number" id="marks" name="marks" placeholder="Marks" value={this.state.test.response[this.state.questionNumber].marks} onChange={this.handleEvaluate} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="remarks" md={2}>Remarks. </Label>
                                    <Col md={10}>
                                        <Input type="String" id="remarks" name="remarks" placeholder="Remarks" value={this.state.test.response[this.state.questionNumber].remarks} onChange={this.handleEvaluate} />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Button type="submit" color="primary" >Evaluate</Button>
                                </FormGroup>
                            </Form> 
                        </ModalBody>
                    </Modal>
                </div>
            )
        }  
    }
}
export default AdminStudentResult3;