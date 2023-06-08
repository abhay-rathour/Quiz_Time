import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Card, CardBody, CardHeader, Form, FormGroup, FormFeedback, Col, Input, Button, Modal,ModalBody,ModalHeader,Table } from 'reactstrap';

import {baseUrl} from "../shared/baseUrl"



const mapStateToProps = state => ({
    auth: state.auth

});




class Details extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            admin: false,
            oldpass:'',
            newpass:'',
            confpass:'',
            isModalOpen:false,
            touched:{
                oldpass:false,
                newpass:false,
                confpass:false,
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChangePassword=this.handleChangePassword.bind(this);
        this.toggleModal=this.toggleModal.bind(this);
        this.handleBlur=this.handleBlur.bind(this);
        this.validate = this.validate.bind(this);
    };

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }
    toggleModal(){
        this.setState({
            isModalOpen:!this.state.isModalOpen
        })
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    validate(oldpass,newpass,confpass) {
        const errors = {
            oldpass:'',
            newpass: '',
            confpass: ''
        };  
        if(this.state.touched.oldpass&&oldpass==='')
        {
            errors.oldpass = 'Old password cannot be empty.';
        }
        if (this.state.touched.newpass && newpass.length < 8)
            errors.newpass = 'New password should be >= 8 characters';
        if (this.state.touched.confpass && confpass!==newpass)
            errors.confpass = "New password and Confirm password doesn't match";
        return errors;
    }

    handleChangePassword(event) {
        event.preventDefault();
        var user = {
            oldpass: this.state.oldpass,
            newpass: this.state.newpass,
            
        };
        const userType=this.props.auth.isAdmin ? 'admin' : 'student'
        const bearer="Bearer "+localStorage.getItem('token');
        fetch(baseUrl+userType+'/changepass', {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            body:JSON.stringify(user),
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                if(result.success)
                {
                    localStorage.setItem('token',result.token);
                    alert(result.status);
                    this.toggleModal()
                }
                else
                {
                    alert(result.error.message);
                    this.toggleModal();
                }
            })
            .catch(e => {
                console.log(e);
            });


       
        
    }
    render() {
            const errors = this.validate(this.state.oldpass,this.state.newpass,this.state.confpass);
            const user =this.props.auth.user;
            var actype=this.props.auth.isAdmin?"Administrator":"User";
            var orgname=this.props.auth.isAdmin?(<><tr>
                <td><b>Organisation</b></td>
                <td>{user.organisation}</td>
            </tr></>):(<></>);
            // console.log(this.props.auth)
            return (
                <>
                    <div className='container'>
                        <div className='row justify-content-center'>
                            <div className='col-md-6'style={{'padding':20+'px'}} >
                                <Card >
                                    <CardHeader ><h3><b>Profile</b></h3></CardHeader>
                                    <CardBody>
                                    <Table striped bordered hover>
                                            <tbody>
                                                <tr>
                                                    <td><b>Name</b> </td>
                                                    <td>{user.firstname} {user.lastname}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Email</b> </td>
                                                    <td>{user.email}</td>
                                                </tr>
                                                <tr>
                                                    <td><b>Account Type</b> </td>
                                                    <td>{actype}</td>
                                                </tr>
                                                {orgname}
                                                
                                            </tbody>
                                        </Table>
                                        <Button onClick={this.toggleModal} type="submit" color="primary">Change Password</Button>
                                    </CardBody>
                                </Card>
                                
                            </div>
                        </div>
                    </div>



                    <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}><strong> Change Password </strong></ModalHeader>
                        <ModalBody >
                            <Form onSubmit={this.handleChangePassword}>
                                <FormGroup row>
                                    <Col md={10} >
                                        <Input type="password" id="oldpass" name="oldpass"
                                            placeholder="Old Password"
                                            value={this.state.oldpass}
                                            valid={errors.oldpass === ''}
                                            invalid={errors.oldpass !== ''}
                                            onBlur={this.handleBlur('oldpass')}
                                            onChange={this.handleInputChange} required />
                                        <FormFeedback>{errors.oldpass}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md={10} >
                                        <Input type="password" id="newpass" name="newpass"
                                            placeholder="New Password"
                                            value={this.state.newpass}
                                            valid={errors.newpass === ''}
                                            invalid={errors.newpass !== ''}
                                            onBlur={this.handleBlur('newpass')}
                                            onChange={this.handleInputChange} required />
                                        <FormFeedback>{errors.newpass}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md={10} >
                                        <Input type="password" id="confpass" name="confpass"
                                            placeholder="Confirm New Password"
                                            value={this.state.confpass}
                                            valid={errors.confpass === ''}
                                            invalid={errors.confpass !== ''}
                                            onBlur={this.handleBlur('confpass')}
                                            onChange={this.handleInputChange} required />
                                        <FormFeedback>{errors.confpass}</FormFeedback>
                                    </Col>
                                </FormGroup>
                                <FormGroup row>
                                    <Col md={{ size: 10 }}>
                                        <Button type="submit" color="danger">
                                            Change Password
                                        </Button>
                                    </Col>
                                </FormGroup>
                            </Form>
                        </ModalBody>
                    </Modal>
                </>
            );
        }
}
export default connect(mapStateToProps,null)(Details);