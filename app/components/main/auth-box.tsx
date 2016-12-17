import * as React from 'react';
import Paper from 'material-ui/Paper'
import RaisedButton from 'material-ui/RaisedButton';
import {Link} from 'react-router';

const paperStyle = {
    margin: '40px',
    padding: '15px 30px'
};

const buttonContainerStyle = {
    margin: '10px 0 10px 0'
};

const buttonStyle = {
    height: '50px'
};

export const AuthBox = (props: void) => {
    return (
        <div className="row center-xs">
            <div className="col-md-4">
                <Paper style={paperStyle} zDepth={2}>
                    <div className="row center-xs">
                        <div className="col-md-6 col-xs-12">
                            <Link to="/login">
                                <RaisedButton
                                    label="Login"
                                    style={buttonContainerStyle}
                                    fullWidth={true}
                                    buttonStyle={buttonStyle}
                                    primary={true}/>
                            </Link>
                        </div>
                        <div className="col-md-6 col-xs-12">
                            <Link to="/signup">
                                <RaisedButton
                                    label="Signup"
                                    style={buttonContainerStyle}
                                    fullWidth={true}
                                    buttonStyle={buttonStyle}
                                    secondary={true}/>
                            </Link>
                        </div>
                    </div>
                </Paper>
            </div>
        </div>
    );
};