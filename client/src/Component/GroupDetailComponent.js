import React, { Component } from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink, Row, Col, Table, Button,} from 'reactstrap';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import {connect} from 'react-redux';
import {acceptMember,removeMem,removeReq,DeleteGroup} from '../redux/ActionCreators/GroupActions'
import {baseUrl} from '../shared/baseUrl';
import moment from 'moment';



///This component shows the groups specifics of a given group created by admin
//He can add members and delete members and create test from this component 


const mapDispatchToProps = (dispatch)=>({

    acceptMember:(groupId,request)=>dispatch(acceptMember(groupId,request)),
    removeReq:(groupId,requestId)=>dispatch(removeReq(groupId,requestId)),
    removeMem:(groupId,memberId)=>dispatch(removeMem(groupId,memberId)),
    DeleteGroup:(groupId)=>dispatch(DeleteGroup(groupId))  
});



class GroupDetailAdmin extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            activeTab: '1',
            isFetching:'false',
            group:null,
        };
    
        this.handleAcceptmember = this.handleAcceptmember.bind(this);
        this.handleRemoveMember=this.handleRemoveMember.bind(this);
        this.handleDeleteReq=this.handleDeleteReq.bind(this);
        this.toggleTab = this.toggleTab.bind(this); 
        this.fetchGroupwithID=this.fetchGroupwithID.bind(this);
        this.removeMem=this.removeMem.bind(this);
        this.removeReq=this.removeReq.bind(this);
        this.acceptMember=this.acceptMember.bind(this);
        this.handleDeleteGroup=this.handleDeleteGroup.bind(this);
    }
    toggleTab(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab});
            }
    }
    fetchGroupwithID = (groupId) => {
        const bearer= 'Bearer '+localStorage.getItem('token');
        this.setState({...this.state, isFetching: true});
        fetch(baseUrl+'groups/' +groupId, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
            .then(response => response.json())
            .then(result => {
                this.setState({group: result, isFetching: false})
            })
            .catch(e => {
                console.log(e);
                this.setState({...this.state, isFetching: false});
            });
    };
    removeMem= (groupId,member)  => {

        const bearer = 'Bearer ' + localStorage.getItem('token');
        var request={
            groupId:groupId,
            memberId:member._id,
            name:member.name,
            uniqueID:member.uniqueID,
            userID:member.userID
        }
        return fetch(baseUrl +'groups/'+groupId+'/member', {
            method: "DELETE",
            body: JSON.stringify(request),
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
        .then(response => {
            if (response) {
              return response;
            } else {
              var error = new Error('Error ' + response.status + ': ' + response.statusText);
              error.response = response;
              throw error;
            }
          },
          error => {
                throw error;
          })
        .then(response => response.json())
        .then(Newgroup => { console.log('Group Updated', Newgroup); 
        this.setState({
            group:Newgroup
        })
        })
        .catch(error => console.log(error));
    }
    removeReq= (groupId,reqId) =>  {

        const bearer = 'Bearer ' + localStorage.getItem('token');
        var request={
            groupId:groupId,
            requestId:reqId
        }
        return fetch(baseUrl +'groups/'+groupId+'/removereq', {
            method: "DELETE",
            body: JSON.stringify(request),
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
        .then(response => {
            if (response) {
              return response;
            } else {
              var error = new Error('Error ' + response.status + ': ' + response.statusText);
              error.response = response;
              throw error;
            }
          },
          error => {
                throw error;
          })
        .then(response => response.json())
        .then(Newgroup => { console.log('Group Updated', Newgroup); 
        this.setState({
            group:Newgroup
        })
        })
        .catch(error => console.log(error));
    }

    acceptMember = (groupId,request) =>  {

        const bearer = 'Bearer ' + localStorage.getItem('token');
        
        return fetch(baseUrl+'groups/' +groupId+'/member', {
            method: "PUT",
            body: JSON.stringify(request),
            headers: {
              "Content-Type": "application/json",
              'Authorization': bearer
            },
            credentials: "same-origin"
        })
        .then(response => {
            if (response) {
              return response;
            } else {
              var error = new Error('Error ' + response.status + ': ' + response.statusText);
              error.response = response;
              throw error;
            }
          },
          error => {
                throw error;
          })
        .then(response => response.json())
        .then(Newgroup => { console.log('Group Updated', Newgroup); 
        this.setState({
            group:Newgroup
        })
        })
        .catch(error => console.log(error));
    }
    componentDidMount(){
        this.fetchGroupwithID(this.props.match.params.groupId);
    }

    handleAcceptmember(req){
        var request={
            requestId:req._id,
            name:req.name,
            uniqueID:req.uniqueID,
            userID:req.userID
        }
         this.acceptMember(this.state.group._id,request);
    }
    handleDeleteReq(req){
        
        this.removeReq(this.state.group._id,req._id);
    }
    handleRemoveMember(req){
        this.removeMem(this.state.group._id,req);

    }
    handleDeleteGroup()
    {
        var y=window.confirm("Are You Really want to delete the group? All Data Related to the group will be lost and It is Irriversible Operation");
        if(y)
        {
            this.props.DeleteGroup(this.state.group._id);
            this.props.history.push('/');
        }
        else{

        }
    }
    
    render(){
        if(this.state.isFetching)
        {
            return (
                <p>Loading Groups:-----</p>
            );
        }
        else{
            console.log(this.state.group)
            var pendingReqList;
            const group=this.state.group;
            console.log(group);
            if(group.pendingReq.length)
                {
                    pendingReqList=group.pendingReq.map((req)=>{
                        return(
                            <tr>
                                <td>{req.name}</td>
                                <td>{req.uniqueID}</td>
                                <td><Button type="submit" color="outline-primary" size="sm"onClick={()=>this.handleAcceptmember(req)}>Confirm</Button> <Button type="submit" color="outline-danger" size="sm"onClick={()=>this.handleDeleteReq(req)}>Delete</Button></td>
                            </tr>
                        );
                    })
                }
            else{
        
                pendingReqList='There are No Pending Req'
                
            }
            var memberList;
            if(group.members.length)
                {
                    memberList=group.members.map((req,index)=>{
                        var sno=index+1;
                        return(
                            <tr>
                                <td>{sno}</td>
                                <td>{req.name}</td>
                                <td>{req.uniqueID}</td>
                                <td><Button outline color="danger" size="sm" onClick={()=>this.handleRemoveMember(req)}> Remove Member </Button></td>
                                <td><Link to="#" ><Button outline color="primary" size="sm"> Details </Button></Link></td>
                            </tr>
                        );
                    })
                }
            else{
        
                memberList='There are No Members in group'
                
            }
            var testslist;
            if(group.tests.length)
            {
                testslist=group.tests.map((test,index)=>{
                    var testtype;
                    if(test.testType==='1')
                        {
                         testtype="MCQ Only"
                        }
                    if(test.testType==='2')
                        {
                        testtype="MCQ + Fill in the blanks"
                        }
                    if(test.testType==='3')
                        {
                        testtype="Assignment Type"
                        }
                    var negative=test.negative?"YES":"NO";
                    var negPercentage=test.negative?test.negPercentage:"0";
                    return(
                        <tr>
                            <td><span className="fa fa-file fa-lg"></span>{test.title}</td>
                            {/* <td>{moment.utc(test.startDate).local().format('MMMM Do YYYY,h:mm:ss a')}</td> */}
                            <td>{moment.utc(test.startDate).local().format('llll')}</td>
                            <td>{test.subject}</td>
                            <td>{test.duration}</td>
                            <td>{testtype}</td>
                            <td>{negative}</td>
                            <td>{negPercentage}</td>
                            <td>{test.totalMarks}</td>
                            <td>
                                <Link to={`/edittest/${group._id}/${test._id}`} ><Button outline color="info" size="sm">Edit</Button></Link>
                            </td>
                            <td>
                                <Link to={`/adminSummary/${test.testType}/${test._id}`} ><Button outline color="primary" size="sm">Click</Button></Link>
                            </td>
                        </tr>

                    );

                })
            }
            else
            {
                testslist='No tests Created Yet'
            }
            var grouptype=group.isPrivate?'Private':'Public';
            return (
                    <div className="container mt-5">
                        <Nav tabs>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '1' })} onClick={() => { this.toggleTab('1'); }}>
                                    Tests
                                    </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '2' })} onClick={() => { this.toggleTab('2'); }}>
                                    Pending Request
                                    </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '3' })} onClick={() => { this.toggleTab('3'); }}>
                                    Group Member
                                    </NavLink>
                            </NavItem>
                            
                            <NavItem>
                                <NavLink className={classnames({ active: this.state.activeTab === '4' })} onClick={() => { this.toggleTab('4'); }}>
                                    Group Details
                                    </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={this.state.activeTab}>
                            <TabPane tabId="2">
                                <Row>
                                    <Col sm="5">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Unique Id</th>
                                                    <th>Requests</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingReqList}
                                            </tbody>
                                        </Table>
            
                                    </Col>
                                </Row>
            
                            </TabPane>
                            <TabPane tabId="3">
                                <Row>
                                    <Col sm="12">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>S.N.</th>
                                                    <th>Name</th>
                                                    <th>Unique Id</th>
                                                    <th>Remove</th>
                                                    <th>Details</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {memberList}
                                            </tbody>
                                        </Table>
            
                                    </Col>
                                </Row>
                            </TabPane>
                            
                            <TabPane tabId="1">
                                <Row>
                                    <Col sm="12">
                                        <Table striped bordered hover>
                                            <thead>
                                                <tr>
                                                    <th>Test Name</th>
                                                    <th>Tentative Start Time</th>
                                                    <th>Subject</th>
                                                    <th>Max.Duration(in Min)</th>
                                                    <th>Test Type</th>
                                                    <th>Negative Mark.</th>
                                                    <th>Neg. Percentage</th>
                                                    <th>Max.Score</th>
                                                    <th>Preview</th>
                                                    <th>Summary</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {testslist}
                                            </tbody>
                                        </Table>
            
                                    </Col>
                                </Row>
                                <Link to={`/createtest/${group._id}`} ><Button outline color="pink" size="sm"> Create a New </Button></Link>
                            </TabPane>
                            <TabPane tabId="4">
                                <Row>
                                    <Col sm="12">
                                       <h5>Group Name: <strong>{group.name}</strong></h5>
                                       <h5>Group Type: {grouptype}
                                        </h5>
                                        <h5>
                                            Group ID: {group._id}
                                        </h5>
                                        <p>Share the Above group ID with Students to help them send a join req to the Group</p>
                                        
                                    </Col>
                                </Row>
                                <Button outline color="red"  size="sm" onClick={this.handleDeleteGroup}> Delete this Group </Button>
            
                            </TabPane>
                        </TabContent>
                    </div>
            
            
            );
        }
        

    }
    
}

export default connect(null,mapDispatchToProps)(GroupDetailAdmin);
