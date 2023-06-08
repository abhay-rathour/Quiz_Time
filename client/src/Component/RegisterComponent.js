import React, { Component } from 'react';
import {connect} from 'react-redux';
import { Card, CardBody, Label, Form, FormGroup, Input, Modal, ModalHeader, ModalBody, Button, Col, CardDeck, CardText, CardHeader,FormFeedback } from 'reactstrap';
import {adminRegistration,userRegistration}   from '../redux/ActionCreators/RegisterActions';
import {loginUser}   from '../redux/ActionCreators/LoginActions';
import {baseUrl} from '../shared/baseUrl';
//Registration Component To Handle Registration Forms



const mapDispatchToProps = (dispatch)=>({
    adminRegistration: (user)=>dispatch(adminRegistration(user)),
    userRegistration: (user)=>dispatch(userRegistration(user)),
    loginUser:(creds)=>dispatch(loginUser(creds))

});



class Register extends Component {

    constructor(props) {
        super(props);

        //State Containing all the variables Going to be used for Designing and storing Form Data to Submit

        this.state = {
            isModal1Open: false,
            isModal2Open: false,
            username: '',
            firstname: '',
            lastname: '',
            organisation: '',
            email: '',
            password: '',
            agree: false,
            userType:'',
            touched: {
                username: false,
                firstname: false,
                lastname: false,
                organisation:false,
                password: false,
                email: false
            }
        };

        //Medthod Definitions to handle the various actions during filling the form

        this.toggleModal1 = this.toggleModal1.bind(this);
        this.toggleModal2 = this.toggleModal2.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmitAdmins = this.handleSubmitAdmins.bind(this);
        this.handleSubmitUsers = this.handleSubmitUsers.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
    }

    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }

    //Switches the Modal 1 for  Student Registration ON or OFF

    toggleModal1() {
        this.setState({
            isModal1Open: !this.state.isModal1Open,
            userType:'users'
        });
    }

    //Switches the Modal 2 for  Administrator Registration ON or OFF

    toggleModal2() {
        this.setState({
            isModal2Open: !this.state.isModal2Open,
            userType:'admins'
        });
    }

    //  A input change method to keep state updated with user's input

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    //A Submit Button to submit all the data entered during registration form to and send it to Server-side to Complete the process

    handleSubmitAdmins(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
        //this.toggleModal2();
        var user={
            username: this.state.username,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            organisation:this.state.organisation,
            password: this.state.password,
            email : this.state.email
        };

        fetch(baseUrl + 'register/admins', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response => {alert('Your Registration is Sucessfull, Sign in to the New Account Using Username and Password! ')
            var creds={
                username:user.username,
                password:user.password,
                userType:'admins'
            }
            this.props.loginUser(creds);
            this.toggleModal2();
            this.props.history.push('/');
        })
            .catch(error => { console.log('Admin Registration ', error.message);
            //alert('Your Registration was UnsucessFull\nError: '+ error.message); })
            alert('This usename is already taken'); });
        
        event.preventDefault();
    }

    handleSubmitUsers(event) {
        // console.log('Current State is: ' + JSON.stringify(this.state));
        // alert('Current State is: ' + JSON.stringify(this.state));
        // this.toggleModal1();
        var user={
            username: this.state.username,
            firstname: this.state.firstname,
            lastname: this.state.lastname,
            password: this.state.password,
            email : this.state.email,
        };
        
            // const bearer = 'Bearer ' + localStorage.getItem('token');
        
            /*return*/ 
            fetch(baseUrl + 'register/users', {
                method: 'POST',
                body: JSON.stringify(user),
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'same-origin'
            })
            .then(response => {
                console.log(response);
                if (response.ok) {
                    return response;
                }
                else {
                    var error = new Error('Error ' + response.status + ': ' + response.statusText);
                    error.response = response;
                    throw error;
                }
            },
            error => {
                var errmess = new Error(error.message);
                throw errmess;
            })
            .then(response => response.json())
            .then(response =>{alert('Your Registration is Sucessfull, Sign in to the New Account Using Username and Password! ')
                var creds={
                    username:user.username,
                    password:user.password,
                    userType:'users'
                }
                this.props.loginUser(creds);
                this.toggleModal1();
                this.props.history.push('/');
                })
            .catch(error => { console.log('User Registration ', error.message);
                //alert('Your Registration was UnsucessFull\nError: '+ error.message); })
                alert('This usename is already taken'); });
        
            
            event.preventDefault();
            //this.props.history.push('/');
    }

    
    validate(username, firstname, lastname, organisation, password, email) {
        const errors = {
            username:'',
            firstname: '',
            lastname: '',
            organisation:'',
            password: '',
            email: ''
        };

        if (this.state.touched.username && username.length < 5)
            errors.username = 'User Name should be >= 5 characters';
        else if (this.state.touched.username && username.length > 15)
            errors.username = 'User Name should be <= 15 characters';
            
        if (this.state.touched.firstname && firstname.length < 3)
            errors.firstname = 'First Name should be >= 3 characters';
        // else if (this.state.touched.firstname && firstname.length > 10)
        //     errors.firstname = 'First Name should be <= 10 characters';

        if (this.state.touched.lastname && lastname.length < 3)
            errors.lastname = 'Last Name should be >= 3 characters';
            
        else if (this.state.touched.lastname && lastname.length > 10)
            errors.lastname = 'Last Name should be <= 10 characters';
        if (this.state.touched.organisation && organisation.length < 3)
            errors.organisation = 'Organisation Name should be >= 3 characters';
        // const reg = /^\d+$/;
        if (this.state.touched.password && password.length < 8)
            errors.password = 'Password should be >= 8 characters';
        else if (this.state.touched.username && username.length > 15)
            errors.password = 'Password should be <= 15 characters';
        // if (this.state.touched.password && !reg.test(password))
        //     errors.password = 'Password should contain only numbers';

        if(this.state.touched.email && email.split('').filter(x => x === '@').length !== 1)
            errors.email = 'Email should contain a @';

        return errors;
    }

    render() {
        const errors = this.validate(this.state.username, this.state.firstname, this.state.lastname,this.state.organisation, this.state.password, this.state.email);
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-sm-9">
                        
                        {/* Two card decks with two options to Submit the form depending upon the type of account user wants to create */}
                        <CardDeck>
                            <Card style={{ width: '18rem' }} className="border-primary text-center mb-5 mt-5">
                                <CardHeader className="bg-primary text-white">Test Takers</CardHeader>
                                <CardBody>
                                    <CardText>All test takers Register on link below:-</CardText>
                                    <Button onClick={this.toggleModal1} type="submit" color="primary">Register</Button>
                                </CardBody>
                            </Card>

                            <Card style={{ width: '18rem' }} className="border-danger text-center mb-5 mt-5">
                                <CardHeader className="bg-danger text-white">Administrators</CardHeader>
                                <CardBody>
                                    <CardText>All Admin Register on link below:-</CardText>
                                    <Button onClick={this.toggleModal2} type="submit" color="danger">Register</Button>
                                </CardBody>
                            </Card>
                        </CardDeck>
                    </div>
                </div>

                {/* Student Registration Form */}

                <Modal isOpen={this.state.isModal1Open} toggle={this.toggleModal1}>
                    <ModalHeader toggle={this.toggleModal1}><strong>Sign up  free Student Account</strong></ModalHeader>
                    <ModalBody >
                        <Form onSubmit={this.handleSubmitUsers}>
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="text" id="username" name="username"
                                        placeholder="User Name"
                                        value={this.state.username}
                                        valid={errors.username === ''}
                                        invalid={errors.username !== ''}
                                        onBlur={this.handleBlur('username')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.username}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={5}>
                                <Input type="text" id="firstname" name="firstname"
                                        placeholder="First Name"
                                        value={this.state.firstname}
                                        valid={errors.firstname === ''}
                                        invalid={errors.firstname !== ''}
                                        onBlur={this.handleBlur('firstname')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.firstname}</FormFeedback>
                                </Col>
                                <Col md={5}>
                                <Input type="text" id="lastname" name="lastname"
                                        placeholder="Last Name"
                                        value={this.state.lastname}
                                        valid={errors.lastname === ''}
                                        invalid={errors.lastname !== ''}
                                        onBlur={this.handleBlur('lastname')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.lastname}</FormFeedback>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        valid={errors.email === ''}
                                        invalid={errors.email !== ''}
                                        onBlur={this.handleBlur('email')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.email}</FormFeedback>
                                </Col>
                            </FormGroup>
                            
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="password" id="password" name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        valid={errors.password === ''}
                                        invalid={errors.password !== ''}
                                        onBlur={this.handleBlur('password')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.password}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="primary">
                                        Register
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>

                {/* Administrator Registration Form */}

                <Modal isOpen={this.state.isModal2Open} toggle={this.toggleModal2}>
                    <ModalHeader toggle={this.toggleModal2}><strong>Sign up for Administrator Account</strong></ModalHeader>
                    <ModalBody >
                        <Form onSubmit={this.handleSubmitAdmins}>
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="text" id="username" name="username"
                                        placeholder="User Name"
                                        value={this.state.username}
                                        valid={errors.username === ''}
                                        invalid={errors.username !== ''}
                                        onBlur={this.handleBlur('username')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.username}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={5}>
                                <Input type="text" id="firstname" name="firstname"
                                        placeholder="First Name"
                                        value={this.state.firstname}
                                        valid={errors.firstname === ''}
                                        invalid={errors.firstname !== ''}
                                        onBlur={this.handleBlur('firstname')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.firstname}</FormFeedback>
                                </Col>
                                <Col md={5}>
                                <Input type="text" id="lastname" name="lastname"
                                        placeholder="Last Name"
                                        value={this.state.lastname}
                                        valid={errors.lastname === ''}
                                        invalid={errors.lastname !== ''}
                                        onBlur={this.handleBlur('lastname')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.lastname}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="organisation" id="organisation" name="organisation"
                                        placeholder="Organisation"
                                        value={this.state.organisation}
                                        valid={errors.organisation === ''}
                                        invalid={errors.organisation !== ''}
                                        onBlur={this.handleBlur('organisation')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.organisation}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="email" id="email" name="email"
                                        placeholder="Email"
                                        value={this.state.email}
                                        valid={errors.email === ''}
                                        invalid={errors.email !== ''}
                                        onBlur={this.handleBlur('email')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.email}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={10}>
                                <Input type="password" id="password" name="password"
                                        placeholder="Password"
                                        value={this.state.password}
                                        valid={errors.password === ''}
                                        invalid={errors.password !== ''}
                                        onBlur={this.handleBlur('password')}
                                        onChange={this.handleInputChange} />
                                    <FormFeedback>{errors.password}</FormFeedback>
                                </Col>
                            </FormGroup>
                            <FormGroup check>
                                <Label check>
                                <Input type="checkbox"
                                        name="agree"
                                        checked={this.state.agree}
                                        onChange={this.handleInputChange} /> {' '}
                                    <strong>I accept all the terms & conditions of QUIZ TIME.</strong>
                                </Label>
                            </FormGroup>
                            <FormGroup row>
                                <Col md={{ size: 10 }}>
                                    <Button type="submit" color="danger">
                                        Register
                                    </Button>
                                </Col>
                            </FormGroup>
                        </Form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}

export default connect(null,mapDispatchToProps)(Register);