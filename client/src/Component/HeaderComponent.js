import React, { Component} from 'react';
import { Navbar, Nav, NavbarToggler,NavItem, Collapse,Jumbotron, Button} from 'reactstrap';
import{connect} from 'react-redux';
import { Link, NavLink} from 'react-router-dom';
import { logoutUser } from '../redux/ActionCreators/LoginActions';

//Navigation Bar Component of the page
const mapStateToProps=(state)=>({
    authenticated:state.auth,
});

const mapDispatchToProps=(dispatch)=>({
    logoutUser:()=>dispatch(logoutUser()),
});
class NavComp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isNavOpen: false
        };
        this.toggleNav = this.toggleNav.bind(this);
    };
    toggleNav() {
        this.setState({
            isNavOpen: !this.state.isNavOpen
        });
    }
    render(){

        //If user is signed in  displaying his Navbar containing options to see tests, results and his own information

        if(this.props.authenticated.isAuthenticated){
            return(
                <Navbar expand className="juicy-peach-gradient">                  
                <div className="container">
                    <NavbarToggler onClick={this.toggleNav} />
                    <Collapse isOpen={this.state.isNavOpen} navbar>
                        <Nav navbar>
                            <NavItem>
                                <NavLink className="nav-link pink-text" to="/tests">
                                    <span className="fa fa-tasks fa-lg"></span> Groups
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link pink-text" to="#">
                                    <span className="fa fa-bar-chart fa-lg"></span> Results
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink className="nav-link pink-text" to="/accountdetails">
                                    <span className="fa fa-info fa-lg"></span> Profile
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </div>
            </Navbar> 
            );
        }


        //Else displaying normal Navigation bar containing home, demo, about us and contact us


        else{
            return(
                <Navbar expand className="juicy-peach-gradient">                  
                    <div className="container">
                        <NavbarToggler onClick={this.toggleNav} />
                        <Collapse isOpen={this.state.isNavOpen} navbar>
                            <Nav navbar>
                                <NavItem>
                                    <NavLink className="nav-link pink-text" to="/home">
                                        <span className="fa fa-home fa-lg"></span> Home
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link pink-text" to="/test">
                                        <span className="fa fa-info fa-lg"></span> About Us
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link pink-text" to="/help">
                                        <span className="fa fa-desktop fa-lg"></span> Help
                                    </NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink className="nav-link pink-text" to="/contactus">
                                        <span className="fa fa-address-card fa-lg"></span> Contact Us
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </Collapse>
                    </div>
                </Navbar>   

            );
        }
    }
}



//Defines Header and Navigation Bar

class Header extends Component {

    render(){
        var loginpart;
        if(this.props.authenticated.isAuthenticated){
            loginpart=(
                    <div className="row align-items-center">
                        <div className=" white-text col-sm-2 ml-auto justify-contents-right">
                           <h4>{this.props.authenticated.user.firstname} </h4>
                        </div>
                        <div className="col-sm-2 justify-contents-left">
                            <Button  color="pink" size="sm" onClick={this.props.logoutUser}> LogOut </Button>
                        </div>
                    </div>
                ); 
        }
        else
        {
            loginpart=(
                <div className="row "> 
                   <div  className="col-sm-2 ml-auto">
                       <Link to="/login">
                        <Button  color="orange">
                           Login
                        </Button> 
                        </Link>  
                    </div>
                </div>
                )
        }
      return(
    
            <div className = "deep-orange lighten-5">
                <Jumbotron className = "sunny-morning-gradient">
                    <div className="container">
                        <div className="row row-header align-items-center">
                            
                            {/* Adding Logo of Website */}

                            <div className="col-12 col-sm-2 ">
                                <img className="rounded-circle" src="assets/images/logo.jpg" height="80" width="80" alt="Quiz Time" />
                            </div>

                            {/* Name of the Website */}

                            <div className="col-12 col-sm-1 mr-auto">
                               <h1 className="white-text ">Quiz Time</h1> 
                            </div>

                            {/* Rendering Login part of Right Half of Header */}

                            <div className="col-12 col-sm-6">
                             {/* <LoginPart authenticated= {this.props.authenticated} loginUser={this.props.loginUser} 
                                logoutUser={this.props.logoutUser} />    */}
                                {loginpart}
                            </div>
                        </div>
                    </div>
                </Jumbotron>

                {/* Showing Header Just Below The Header */}

                <NavComp authenticated= {this.props.authenticated}/>   

                
            </div>
      );
    }
  }
  
  export default connect(mapStateToProps,mapDispatchToProps)(Header);