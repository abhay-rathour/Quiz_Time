import React, { Component } from 'react';
import {  Table,Button} from 'reactstrap';
import { Link } from 'react-router-dom';
import {baseUrl} from '../shared/baseUrl';

//Component to generate test summary. this component fetches student list who attempted the test and link to see their reponses


class AdminSummary extends Component {
    
    constructor(props){
        super(props);
        this.state = {
            isFetching:'false',
            group:null,
        };
        this.downloadfile=this.downloadfile.bind(this);
    }

    downloadfile(){
        const bearer= 'Bearer '+localStorage.getItem('token');
        const testid=this.props.match.params.testId;
        fetch(baseUrl+'admin/resultDownload/'+testid, {
            method: "GET",
            headers: {
              "Content-Type": "text/csv",
              'Authorization': bearer
            },
            credentials: "same-origin"
        }).then(response=>response.blob())
        .then(blob=>{
            const link =document.createElement('a');
            link.href=URL.createObjectURL(blob);
            link.download=`Result-${this.props.match.params.testId}.csv`;
            link.click(); 
        })
            .catch(e => {
                console.log(e);
            });

        // const link =document.createElement('a');
        // link.href='data:text/csv,'+encodeURIComponent(csv);
        // link.download=`Result-${this.props.match.params.testId}.csv`;
        // link.click();
    }

    componentDidMount(){
        const bearer= 'Bearer '+localStorage.getItem('token');
        const testid=this.props.match.params.testId;
        this.setState({...this.state, isFetching: true});
        // fetch(baseUrl+'admin/resultDownload/'+testid, {
        //     method: "GET",
        //     headers: {
        //       "Content-Type": "text/csv",
        //       'Authorization': bearer
        //     },
        //     credentials: "same-origin"
        // })
		// 	.then(response => response.blob())
		// 	.then(response => {
		// 		var blob = new Blob([response], { type })
		// 		const obj = URL.createObjectURL(blob)
		// 		this.setState({ blobObject: obj })
		// 	})
		// 	.catch(e => console.error("Error", e))
        fetch(baseUrl+'admin/results/'+testid, {
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
    }

    render(){
        if(this.state.isFetching)
        {
            return (
                <p>Loading Group Result Summary:-----</p>
            );
        }
        else{
            console.log(this.state.group)
            const group=this.state.group;
            
            var testslist;
            if(group.length)
            {
                testslist=group.map((user,index)=>{
                    
                    return(
                        <tr>
                            <td>{index+1}</td>
                            <td>{user.name}</td>
                            <td>{user.uniqueID}</td>
                            <td>{user.totalMarks}</td>
                            <td>{user.posMarks}</td>
                            <td>{user.negMarks}</td>
                            <td>{user.marks}</td>
                            
                            <td>
                                <Link to={`/adminresult/${this.props.match.params.testType}/${this.props.match.params.testId}/${user.userID}`} ><Button color="yellow" size="sm">See Responses</Button></Link>
                            </td>
                        </tr>

                    );

                })
            }
            else
            {
                testslist='No Members submitted Yet'
            }
            return (
                    <div className="container mt-5">
                        <Button color="yellow" size="sm" onClick={this.downloadfile}> Download Sheet</Button>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>S. No.</th>
                                    <th>Name</th>
                                    <th>Unique Id</th>
                                    <th>Maximum Marks</th>
                                    <th>Positive Marks</th>
                                    <th>Negative Marks</th>
                                    <th>Marks</th>
                                    <th>Responses</th>
                                </tr>
                            </thead>
                            <tbody>
                                {testslist}
                            </tbody>
                        </Table>
                    </div>
            );
        }
    }   
}

export default AdminSummary;
