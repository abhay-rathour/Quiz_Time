import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Form, FormGroup, FormFeedback, Col, Input, Button, Label } from 'reactstrap';
import { baseUrl } from '../shared/baseUrl';





class Recover extends Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            usernameError: '',
            newpass: '',
            confpass: '',
            admin: false,
            value: '',
            otp: '',
            getOTP: true,
            enterOTP: false,
            changePass: false,
            otpMismatch: false,
            touched: {
                newpass: false,
                confpass: false,
            }
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handlegetOTP = this.handlegetOTP.bind(this);
        this.handleverifyOTP = this.handleverifyOTP.bind(this);
        this.validate = this.validate.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.handleChangePassword=this.handleChangePassword.bind(this);
    };
    handleBlur = (field) => (evt) => {
        this.setState({
            touched: { ...this.state.touched, [field]: true }
        });
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    validate(usernameErr, newpass, confpass) {
        const errors = {
            username: '',
            newpass: '',
            confpass: ''
        };
        if (usernameErr)
            errors.username = usernameErr;

        if (this.state.touched.newpass && newpass.length < 8)
            errors.newpass = 'New password should be >= 8 characters';
        if (this.state.touched.confpass && confpass !== newpass)
            errors.confpass = "New password and Confirm password doesn't match";
        return errors;
    }



    handlegetOTP(event) {
        event.preventDefault();
        var user = {
            username: this.state.username,
            userType: this.state.admin
        };
        fetch(baseUrl + 'forgotPassword', {
            method: 'POST',
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "same-origin"
        }).then(response => response.json())
            .then(res => {
                if (res.success) {
                    this.setState({
                        value: res.OTP,
                        enterOTP: true,
                        getOTP: false,
                    })
                }
                else {
                    this.setState({
                        usernameError: res.message
                    })
                }
            })
    }
    handleverifyOTP(event) {
        event.preventDefault();
        if (this.state.value === this.state.otp) {
            this.setState({
                changePass: true,
                getOTP: false,
                enterOTP: false,
            })
        }
        else {
            this.setState({
                otpMismatch: true,
            })
        }
    }
    handleChangePassword(event) {
        event.preventDefault();
        var user = {
            newpass: this.state.newpass,
            username:this.state.username,
            userType:this.state.admin,
        };
        fetch(baseUrl+'forgotPassword/changepass', {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body:JSON.stringify(user),
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                if(result.success)
                {
                    
                    alert(result.message);
                }
                else
                {
                    alert(result.message);
                }
            })
            .catch(e => {
                console.log(e);
            });   
    }


    render() {
        if (this.state.getOTP) {
            const errors = this.validate(this.state.usernameError, '', '');
            return (

                // console.log(this.props.auth);

                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <Card className="mb-5 md-5 mt-5">
                                <CardHeader className="bg-info text-white text-center">Forgot Password</CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handlegetOTP}>
                                        <FormGroup row>
                                            <Col md={10} >
                                                <Input type="text" id="username" name="username"
                                                    placeholder="Username"
                                                    value={this.state.username}
                                                    valid={errors.username === ''}
                                                    invalid={errors.username !== ''}
                                                    onChange={this.handleInputChange} required />
                                                <FormFeedback>{errors.username}</FormFeedback>
                                            </Col>
                                        </FormGroup>

                                        <FormGroup check>
                                            <Label check>
                                                <Input type="checkbox"
                                                    name="admin"
                                                    checked={this.state.agree}
                                                    onChange={this.handleInputChange} /> {' '}
                                                <strong>Administrator Account</strong>
                                            </Label>

                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md={{ size: 10 }}>
                                                <Button type="submit" color="danger">
                                                    Get OTP
                                             </Button>
                                            </Col>
                                        </FormGroup>

                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            );

        }
        else if (this.state.enterOTP) {
            return (
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <Card className="mb-5 md-5 mt-5">
                                <CardHeader className="bg-info text-white text-center">Enter OTP</CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleverifyOTP}>
                                        <FormGroup row>
                                            <Col md={10} >
                                                <Input type="text" id="otp" name="otp"
                                                    placeholder="Enter the OTP sent to your registered email."
                                                    value={this.state.otp}
                                                    valid={!this.state.otpMismatch}
                                                    invalid={this.state.otpMismatch}
                                                    onChange={this.handleInputChange} required />
                                                <FormFeedback>OTP entered is incorrect.Try again!</FormFeedback>
                                            </Col>
                                        </FormGroup>
                                        <FormGroup row>
                                            <Col md={{ size: 10 }}>
                                                <Button type="submit" color="danger" disable={this.state.otpMismatch}>
                                                    Verify
                                        </Button>
                                            </Col>
                                        </FormGroup>

                                    </Form>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            )
        }
        else if (this.state.changePass) {
            const errors = this.validate('', this.state.newpass, this.state.confpass);
            return (<>


                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-md-6'>
                            <Card className="mb-5 md-5 mt-5">
                                <CardHeader className="bg-info text-white text-center">Change Your Password</CardHeader>
                                <CardBody>
                                    <Form onSubmit={this.handleChangePassword}>

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
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>



            </>)
        }
        else {
            return (<>Some Error Occured Try Reloading</>)
        }
    }
}
export default Recover;