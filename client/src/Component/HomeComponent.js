import React, { Component ,Fragment} from 'react';
import {Button } from 'reactstrap';
import { Link } from 'react-router-dom';

//Home Component contains display and links provided on Home page

class Home extends Component {
    render() {
        return (
            <>
                {/* Register Now part of home page */}
                
                <div className="container">
                    <div className="row align-items-center backgroundPhoto">
                            <div className="col-12 col-md-4 mr-auto text-center">
                                <h2 className="font-weight-bold font-italic light-blue-text">Online Quiz</h2>
                                <p className="indigo-text font-weight-bold">Give and Take quizes nice and Easy!!!</p>
                            </div>

                            {/* Button to Register Now  */}
                            
                            <div className="col-12 col-md-3 ml-auto">
                                {/* <div className="col-sm-5"> */}
                                <Link to ="/register" >   
                                    <Button color="info">
                                        REGISTER NOW
                                    </Button>
                                </Link>
                                {/* </div> */}
                            </div>
                    </div>
                </div>

                {/* Text Information section of Homepage */}

                <div className="container purple-text">
                    <div className="row justify-content-center" >
                        <strong><h2>Online Exam Builder</h2></strong>
                        <p>
                            This is the last online examination system you will ever need! With our easy online exam builder
                            you will set up your own engaging exams that fit any kind of difficulty level. Build and create
                            your online exams and tests with great ease and provide your users with appropriate feedback, so
                            they will have a rich learning experien.
                                </p>
                        <strong><h2>Why use our online examination tool?</h2></strong>
                        <p>
                            Do you need some serious testing software for your students? Or Do you want to easily set up your exam software and invite your
                            participants, or do you need to connect your testing software with your internal software?
                            Start using the Online Exam Builder and this is all within reach. Take a look at all the
                            features and solutions.
                                </p>
                    </div>
                </div>
            </>
        );
    }
}

export default Home;