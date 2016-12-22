import * as React from 'react';
const {Component} = React;
import {
    RaisedButton
} from 'material-ui';
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';
import {connect} from 'react-redux';
import {DashboardState} from "../../reducers/dashboard";
import {ApplicationState} from "../../reducers/index";
import {SelectedCourseState} from "../../reducers/selected-course";
import {ItemAppBar} from "../ui/item-app-bar";
import {FormattedMessage} from 'react-intl';

interface CourseContainerProps {
    dashboard: DashboardState,
    selectedCourse: SelectedCourseState,
    fetchCourse(id: string): any
}

const buttonStyle = {
    margin: '5px 0 5px 0'
};

class CourseContainerComponent extends Component<CourseContainerProps, any> {

    render() {
        if (this.props.selectedCourse.fetching){
            return (
                <div style={{height: '100%'}} className="row middle-xs center-xs">
                    <div><MoreHorizIcon/></div>
                </div>
            );
        }

        return (
            <div style={{height: '100%'}}>
                <ItemAppBar
                    title={this.props.selectedCourse.course.name}/>

                <div style={{height: '100%'}} className="row middle-xs center-xs col-xs-offset-2 col-xs-8">
                    <div style={{height: '200px', width: '500px'}}>
                        <h3><FormattedMessage id="dashboard.course.content.title" defaultMessage="What do you want to add?"/></h3>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <RaisedButton
                                    primary={true}
                                    fullWidth={true}
                                    style={buttonStyle}
                                    label={<FormattedMessage id="dashboard.course.content.create-question" defaultMessage="A question"/>}/>
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <RaisedButton
                                    secondary={true}
                                    fullWidth={true}
                                    style={buttonStyle}
                                    label={<FormattedMessage id="dashboard.course.content.create-question-set" defaultMessage="A question set"/>}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state: ApplicationState) {
    return {
        dashboard: state.dashboard,
        selectedCourse: state.selectedCourse
    }
}

export const CourseContainer = connect(mapStateToProps)(CourseContainerComponent);