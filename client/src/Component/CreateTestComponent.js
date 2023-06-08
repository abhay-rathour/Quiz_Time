import React, { Component } from 'react';
import { Button, Col,  Label, Input, Form, FormGroup} from 'reactstrap';
import axios from 'axios'
import {baseUrl}from '../shared/baseUrl';
import moment from 'moment';

//A component to Initialise a test and upload pdf of assignment type exam if you want otherwise a link to edit test component to add questions

class CreateTest extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            duration: '',
            subject: '',
            startDate: '',
            startTime:'',
            test: [],
            testType:'1',
            negative:false,
            negPercentage:0,
            papersubmit:false,
            selectedFile: null,
            isQuestionInPDF: false,
            totalQuestions:0,
            totalMarks:0
        }
        this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
    }
    handleFileChange(event){
        this.setState({ selectedFile: event.target.files[0] });
    }
    handleInputChange(event) {
        const target = event.target;
        var value = target.type === 'checkbox' ? target.checked : target.value;
        if(target.type==='select-one'){
            if(value==='false')
            {
                value=false;
            }
            else if(value==='true')
            {
                value=true;
            }
        }
        const name = target.name;
        this.setState({
            [name]: value
        });
    }
    handleCreateSubmit(event) {
        event.preventDefault();
        var date=new Date(this.state.startDate+ " "+this.state.startTime);
        var adjustedDate=moment.utc(date).toISOString(true);
        console.log(date);
        // const neg=this.state.negative==="true"?true:false;
        const testnew = {

            title: this.state.title,
            duration: this.state.duration,
            subject:this.state.subject,
            startDate: adjustedDate,
            testType:this.state.testType,
            isQuestionInPDF:this.state.papersubmit,
            totalQuestions:this.state.totalQuestions,
            totalMarks:this.state.totalMarks,
            negative:this.state.negative,
            negPercentage:this.state.negPercentage
        };

        var formData = new FormData()
        formData.append('file', this.state.selectedFile)
        formData.append('totalQuestions',this.state.totalQuestions)
        formData.append('totalMarks',this.state.totalMarks)

        const bearer = 'Bearer ' + localStorage.getItem('token');
        const groupID=this.props.match.params.groupId;
        
        fetch(baseUrl+'createtest/'+groupID, {
            method: "POST",
            body: JSON.stringify(testnew,formData),
            headers: {
                "Content-Type": "application/json",
                'Authorization': bearer
            },
            credentials: "same-origin",
            // files:formData.
        })
        .then(response => {
            if (response) {
                return response;
            } 
            else {
            var error = new Error('Error ' + response.status + ': ' + response.statusText);
            error.response = response;
            throw error;
        }
        },
        error => {
            throw error;
        })
        .then(response => response.json())
        .then(tests => { console.log('Test Created', tests);
            if(this.state.papersubmit)
            {
                axios({
                    method: 'post',
                    url: `${baseUrl}createtest/uploadAssignment/${tests._id}`,
                    data: formData,
                    headers: {
                        Authorization: `${bearer}`
                    }
                })
                .then(res => {
                    console.log(res)
                    this.props.history.push(`/home`)}
                    ).catch(err => console.log(err));
            }
            else
            {
                this.props.history.push(`/edittest/${groupID}/${tests._id}`);
            }   
            
        })
        .catch(error => {console.log(error)});
    }
    



    render(){
            console.log(this.state);
            var paper=this.state.testType==='3'?(<>
            <FormGroup check>
                <Label check>
                <Input type="checkbox"
                        name="papersubmit"
                        checked={this.state.papersubmit}
                        onChange={this.handleInputChange} /> {' '}
                    <strong>I want to upload whole PDF of paper.</strong>
                </Label>
            </FormGroup></>):(<></>);
            var fileupload=this.state.papersubmit?(
            <>  <FormGroup row>
                    <Label htmlFor="totalQuestions" md={2}>No. of Questions. </Label>
                    <Col md>
                        <Input type="number" id="totalQuestions" name="totalQuestions" placeholder="Total Number of Questions" value={this.state.totalQuestions} onChange={this.handleInputChange} required/>
                    </Col>
                </FormGroup>
                <FormGroup row>
                    <Label htmlFor="totalMarks" md={2}>Total Marks. </Label>
                    <Col md>
                        <Input type="number" id="totalMarks" name="totalMarks" placeholder="Total Marks" value={this.state.totalMarks} onChange={this.handleInputChange} required/>
                    </Col>
                </FormGroup>
                <FormGroup>
                <input type='file' id="exampleFormControlFile1" name="paper"label="Paper" onChange={this.handleFileChange} required/>
                </FormGroup>
                <FormGroup row>
                    <Button disabled={(this.state.isTestInitialised)} type="submit" color="primary">Submit</Button>
                </FormGroup>
            </>):(<>
                <FormGroup row>
                    <Button disabled={(this.state.isTestInitialised)} type="submit" color="primary">Create</Button>
                </FormGroup>
            </>);
            var negativeform=this.state.testType==='1'?(<>
                                <FormGroup row>
                                    <Label htmlFor="negativeMarking" md={2}>Negative Marking </Label>
                                    <Col md={10}>
                                        <Input type="select" id="negative" name="negative" value={this.state.negative} onChange={this.handleInputChange} required >
                                        <option value="false">No</option>
                                        <option value="true">Yes</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
            </>):(<></>);
            var negativeVal=this.state.negative?(<>
                                <FormGroup row>
                                    <Label htmlFor="negativePercentage" md={2}>Negative Percentage </Label>
                                    <Col md={10}>
                                        <Input type="number" id="negPercentage" name="negPercentage" placeholder="Negative Percentage( e.g. 25 )" value={this.state.negPercentage} onChange={this.handleInputChange} required />
                                    </Col>
                                </FormGroup>
            </>):(<></>)
            return(
                <div className="container">
                    <div className="row row-content">
                        <div className="col-12">
                            <Form onSubmit={this.handleCreateSubmit} enctype="multipart/form-data">
                                <FormGroup row>
                                    <Label htmlFor="title" md={2}>Title. </Label>
                                    <Col md={10}>
                                        <Input type="text" id="title" name="title" placeholder="Title" value={this.state.title} onChange={this.handleInputChange} required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="subject" md={2}>Subject. </Label>
                                    <Col md={10}>
                                        <Input type="text" id="subject" name="subject" placeholder="Subject" value={this.state.subject} onChange={this.handleInputChange} required/>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="duration" md={2}>Duration. </Label>
                                    <Col md={10}>
                                        <Input type="text" id="duration" name="duration" placeholder="Duration in Minutes" value={this.state.duration} onChange={this.handleInputChange} required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="startDate" md={2}>Tentative Test Date </Label>
                                    {/* <Col md={10}>
                                        <Input type="datetime-local" id="startDate" name="startDate" placeholder="Tentative Start Date" value={this.state.startDate} onChange={this.handleInputChange}required />
                                    </Col>  */}
                                    <Col md={5}>
                                        <Input type="date" id="startDate" name="startDate" placeholder="Start Date" value={this.state.startDate} onChange={this.handleInputChange}required />
                                    </Col>
                                    <Col md={5}>
                                        <Input type="time" id="startTime" name="startTime" placeholder="Start Time" value={this.state.startTime} onChange={this.handleInputChange}required />
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Label htmlFor="testType" md={2}>Test type </Label>
                                    <Col md={10}>
                                        <Input type="select" id="testType" name="testType" value={this.state.testType} onChange={this.handleInputChange} required >
                                        <option value='1'>MCQ Only</option>
                                        <option value='2'>MCQ + Fill-ups</option>
                                        <option value='3'>Assignment type</option>
                                        </Input>
                                    </Col>
                                </FormGroup>
                                {negativeform}
                                {negativeVal}
                                {paper}
                                {fileupload}
                            </Form>
                        </div>
                    </div>
                </div>
            )
        }
}
export default CreateTest;