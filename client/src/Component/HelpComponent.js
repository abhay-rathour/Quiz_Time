import React, { Component } from 'react';


class Help extends Component {

    render() {
        const divStyle = {
            paddingTop: "10vh",
            paddingBottom: "10vh",
            color: "#3d3d3d"
        };
        const rowStyle = {
            marginTop: "1vh",
            marginBottom: "1vh"
        }
        const textStyle = {
            marginBottom: "1vh"
        }
        return (
            <>
                {/* Text Information section of Homepage */}

                <div className="container" style={divStyle} >
                    <div class="row" style={rowStyle}>
                        <strong className="fa fa-hand-o-right fa-lg" style={textStyle} > &nbsp; Using Website </strong>
                        <ol>
                            <li>We can Register an Admin account first from register menu.</li>
                            <li>After successful registration we can create a group.</li>
                            <li>Group Id from group detail section can be shared to other student to help them send group join request.</li>
                            <li>We can create new test from the Create a new Test button.</li>
                            <li>We can fill basic test details there and choose test type.</li>
                            <li>Only test type 3 allows to upload a pdf style question paper for others we can add questions one by one with marks.</li>
                            <li>Once test is finished we can see test summary by clicking test Summary button from GroupDetails --&gt; Tests.</li>
                            <li>We can also see specifc students responses and evaluate if test is from <b> test type 2 (Fill Ups +MCQ)or 3 (Assignment type)</b>.</li>
                            <b>Student section:</b>
                            <p>
                                They need to register using student student account
                                After login they can send group join request by using join a group button and entering group ID provided by administrator of the group
                                they can start test by selecting a group to see test list and select test you want to give
                                you cannot refresh page once test starts as attendence is marked once you start a test and you cannot start test again after that
                                you can see response once test time is over and test is evaluated.
                            </p>
                        </ol>
                    </div>
                </div>
            </>
        );
    }
}

export default Help;