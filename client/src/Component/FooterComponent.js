import React from 'react';

//Defines Footer of the Page

function Footer(props) {
    return(
    <div className="frozen-dreams-gradient mt-auto">
        <div className="container">
            <div className = "row align-self-end">
            <div className="row justify-content-center">

                {/* Features Know How Menu */}

                <div className="col-6 offset-lg-1 col-lg-1">
                    <h5>Our Products:-</h5>
                    <ul className="list-unstyled">
                        <li><a href="####">Exams</a></li>
                        <li><a href="####">Assesments</a></li>
                        <li><a href="####">Quizes</a></li>
                    </ul>
                </div>

                {/* About Us Menu */}

                <div className="col-6 offset-lg-1 col-lg-2">
                    <h5>About Us:-</h5>
                    <ul className="list-unstyled">
                        <li><a href="####">What we Do?</a></li>
                        <li><a href="####">Who are we?</a></li>
                        <li><a href="####">Privacy Policy</a></li>
                        <li><a href="####">Terms and Conditions</a></li>
                    </ul>
                </div>

                {/* Support Menu */}

                <div className="col-6 offset-lg-1 col-lg-2">
                    <h5>Help Support:-</h5>
                    <ul className="list-unstyled">
                        <li><a href="####">Demo</a></li>
                        <li><a href="####">Contact</a></li>
                        <li><a href="####">Email</a></li>
                        <li><a href="####">Chat Support</a></li>
                    </ul>
                </div>

                {/* Social Links Corner */}

                <div className="col-12 col-sm-4 align-self-center">
                    <div className="text-center">
                        <a className="btn btn-social-icon btn-google" href="http://google.com/+"><i className="fa fa-google-plus"></i></a>
                        <a className="btn btn-social-icon btn-facebook" href="http://www.facebook.com/profile.php?id="><i className="fa fa-facebook"></i></a>
                        <a className="btn btn-social-icon btn-linkedin" href="http://www.linkedin.com/in/"><i className="fa fa-linkedin"></i></a>
                        <a className="btn btn-social-icon btn-twitter" href="http://twitter.com/"><i className="fa fa-twitter"></i></a>
                        <a className="btn btn-social-icon btn-google" href="http://youtube.com/"><i className="fa fa-youtube"></i></a>
                        <a className="btn btn-social-icon" href="mailto:"><i className="fa fa-envelope-o"></i></a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    )
}

export default Footer;