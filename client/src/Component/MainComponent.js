import React, {Component } from 'react';
import {Switch, Route,Redirect,withRouter} from 'react-router-dom';
import{connect} from 'react-redux';

//Importing all the Components created so far

import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent';
import Student from './StudentComponent';
import Exam from './ExamComponent';
import Exam2 from './ExamComponent2';
import Exam3 from './ExamComponent3';
import Register from './RegisterComponent';
import Admin from './AdminComponent';
import Help from './HelpComponent';
import Contact from './ContactUsComponent';
import CreateTest from './CreateTestComponent';
import EditTest from './EditTestComponent';
import GroupDetailAdmin from './GroupDetailComponent';
import GroupDetailStudent from './GroupDetailStudentComponent';
import {adminRegistration,userRegistration}   from '../redux/ActionCreators/RegisterActions';
import {createGroup,fetchGroups,acceptMember,removeReq,removeMem,joinGroup,createTest}from '../redux/ActionCreators/GroupActions.js';
import Login from './LoginComponent';
import AdminStudentResult from './AdminTestResultStudent';
import AdminStudentResult2 from './AdminTestResultStudent2';
import AdminStudentResult3 from './AdminTestResultStudent3';
import StudentResult from './StudentTestResultComponent';
import StudentResult2 from './StudentTestResultComponent2';
import StudentResult3 from './StudentTestResultComponent3';
import AdminSummary from './AdminSummaryComponent';
import Details from './DetailComponent';
import Recover from './RecoveryComponent';

//Adding Redux store with Main State

const mapStateToProps = (state)=>({
        auth: state.auth,
});

const mapDispatchToProps = (dispatch)=>({
    adminRegistration: (user)=>dispatch(adminRegistration(user)),
    userRegistration: (user)=>dispatch(userRegistration(user)),
    createGroup:(group)=>dispatch(createGroup(group)),
    fetchGroups:(usertype)=>dispatch(fetchGroups(usertype)),
    acceptMember:(groupId,request)=>dispatch(acceptMember(groupId,request)),
    removeReq:(groupId,requestId)=>dispatch(removeReq(groupId,requestId)),
    removeMem:(groupId,memberId)=>dispatch(removeMem(groupId,memberId)),
    joinGroup:(groupId,request)=>dispatch(joinGroup(groupId,request)),
    createTest:(groupId,test)=>dispatch(createTest(groupId,test))
    
});




export const PrivateRoute = ({component: Component, ...rest}) => (
    <Route {...rest} render={(props) => (
        localStorage.getItem('token') ? <Component {...props} /> : <Redirect to="/login"/>
    )} />
)

// Defines the whole front page and combines everything together

class Main extends Component {
    render(){
        const IsAuth = this.props.auth.isAuthenticated;

        // Homepage Component which returns normal homepage when Not logged in otherwise it displays My Tests section of Logged in user

        const HomePage = () => {
            if(this.props.auth.isAuthenticated)
            {
                if(this.props.auth.isAdmin)
                {
                    return(
                        <Redirect to={'/admin'}/>
                    );
                }
                else{
                       return(
                        <Redirect to={'/student'}/>
                    );
                }
            }
            else
            {
                return(
                    <Redirect to={'/'}/>
                );
            }
          }
        // const CreatetestforGroup=({match})=>{
        //     return(
        //         <CreateTest groupId={match.params.groupId}/>
        //     );
        // }

        return(
            <div className="Body">  
            <>
                <Header authenticated={this.props.auth}/>
               
                    {/* Defines Route path to all components */}
               
                <Switch>
                    <Route path="/"  exact component = {()=>{
                        if(IsAuth){
                            return(
                                <Redirect to ='/home'/>
                            )    
                        }
                        else{
                            return(
                                <Home/>
                            )
                        }
                    }}/>
                    <Route path="/home" exact component = {HomePage}/>
                    <Route path="/login" exact component = {Login}/>
                    <Route path="/register" exact component={Register}/>
                    <Route path="/help" component={Help}/>
                    <Route path="/contactUs" component={Contact}/>
                    <Route path="/recoverUsernamePassword" component={Recover}/>
                    <PrivateRoute exact path="/student" component={Student}/> 
                    <PrivateRoute path="/admin" component={Admin}/>
                    <PrivateRoute path="/accountdetails" component={Details}/>
                    <PrivateRoute path="/exam1/:groupId/:testId" component={Exam}/>
                    <PrivateRoute path="/exam2/:groupId/:testId" component={Exam2}/>
                    <PrivateRoute path="/exam3/:groupId/:testId" component={Exam3}/>
                    <PrivateRoute path="/createtest/:groupId" component={CreateTest}/>
                    <PrivateRoute path="/edittest/:groupId/:testId" component={EditTest}/>
                    <PrivateRoute path="/admingroups/:groupId" component={GroupDetailAdmin}/>
                    <PrivateRoute path="/studentgroups/:groupId" component={GroupDetailStudent}/>
                    <PrivateRoute path="/student/result/1/:testId" component={StudentResult}/>
                    <PrivateRoute path="/student/result/2/:testId" component={StudentResult2}/>
                    <PrivateRoute path="/student/result/3/:testId" component={StudentResult3}/>
                    <PrivateRoute path="/adminresult/1/:testId/:studentId" component={AdminStudentResult}/>
                    <PrivateRoute path="/adminresult/2/:testId/:studentId" component={AdminStudentResult2}/>
                    <PrivateRoute path="/adminresult/3/:testId/:studentId" component={AdminStudentResult3}/>
                    <PrivateRoute path="/adminSummary/:testType/:testId" component={AdminSummary}/>
                    <Redirect to ="/home" />
                </Switch>
               
                <Footer/>
                </>
             </div>
        );
    }
}



export default withRouter(connect(mapStateToProps,mapDispatchToProps)(Main));