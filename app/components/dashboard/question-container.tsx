import * as React from 'react';
const {Component} = React;
import {
    AppBar,
    IconButton,
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
    RaisedButton
} from 'material-ui';
import {white} from 'material-ui/styles/colors';

import ArrowBackIcon from 'material-ui/svg-icons/navigation/arrow-back';
import VisibilityIcon from 'material-ui/svg-icons/action/visibility';
import VisibilityOffIcon from 'material-ui/svg-icons/action/visibility-off';
import SkipPreviousIcon from 'material-ui/svg-icons/av/skip-previous';
import PlayArrowIcon from 'material-ui/svg-icons/av/play-arrow';
import StopIcon from 'material-ui/svg-icons/av/stop';
import SkipNextIcon from 'material-ui/svg-icons/av/skip-next';
import OpenInNewIcon from 'material-ui/svg-icons/action/open-in-new'
import MoreHorizIcon from 'material-ui/svg-icons/navigation/more-horiz';

import {Link} from 'react-router';
import {lightGreen400} from 'material-ui/styles/colors';
import {connect} from 'react-redux';
import {DashboardState} from "../../reducers/dashboard";
import {ApplicationState} from "../../reducers/index";
import {FormattedMessage} from 'react-intl';
import {selectQuestionSet, selectQuestion} from "../../actions/dashboard";
import {SelectedQuestionState, SelectedQuestion} from "../../reducers/selected-question";
import {findIndex} from 'lodash';
import {QuestionDisplay} from "../questions/question-display";
import {displayQuestion, clearDisplayedQuestion} from "../../actions/course";
import {fetchQuestion, askQuestion, stopAskingQuestion} from "../../actions/question";
import {QUESTION_ANSWERED, QUESTION_UNASKED} from "../../../common/states/question-states";
import {subscribeQuestionContainerToCourseChanges, unsubscribeToCourseChanges} from "../../actions/subscription";

interface QuestionContainerProps {
    dashboard: DashboardState,
    selectedQuestion: SelectedQuestionState,
    selectQuestionSet(questionSetId: string): any,
    selectQuestion(questionId: string): any,
    displayQuestion(courseId: string, questionId: string): Promise<any>,
    clearDisplayedQuestion(courseId: string): Promise<any>,
    askQuestion(questionId: string, courseId: string): Promise<any>,
    stopAskingQuestion(questionId: string, courseId: string): Promise<any>,
    subscribeQuestionContainerToCourseChanges(courseId: string, questionId: string): void,
    unsubscribeToCourseChanges(courseId: string): void,
    fetchQuestion(questionId: string): Promise<any>
}

class QuestionContainerComponent extends Component<QuestionContainerProps, any> {

    componentWillReceiveProps(nextProps: QuestionContainerProps) {
        const actualQuestion = this.props.selectedQuestion.question;
        const nextQuestion = nextProps.selectedQuestion.question;
        if (!actualQuestion && nextQuestion) {
            this.props.subscribeQuestionContainerToCourseChanges(nextQuestion.questionSet.course.id, nextQuestion.id);
        }

        if (actualQuestion && nextQuestion && actualQuestion.id !== nextQuestion.id) {
            this.props.unsubscribeToCourseChanges(actualQuestion.questionSet.course.id);
            this.props.subscribeQuestionContainerToCourseChanges(nextQuestion.questionSet.course.id, nextQuestion.id);
        }
    }

    goBackToQuestionSet() {
        const questionSetId = this.props.selectedQuestion.question.questionSet.id;
        this.props.selectQuestionSet(questionSetId);
    }

    renderVisibilityButton(question: SelectedQuestion) {
        const {questionSet: {course}} = question;
        if (notIsQuestionDisplayed(question)) {
            return (
                <IconButton
                    onTouchTap={() => this.props.displayQuestion(course.id, question.id)
                                          .then(() => this.props.fetchQuestion(question.id))}>
                    <VisibilityIcon color={white}/>
                </IconButton>
            );
        }
        return (
            <IconButton
                onTouchTap={() => this.props.clearDisplayedQuestion(course.id)
                                      .then(() => this.props.fetchQuestion(question.id))}>
                <VisibilityOffIcon color={white}/>
            </IconButton>);
    }

    renderActionButton(question: SelectedQuestion) {
        if (question.state !== QUESTION_UNASKED) {
            return (
                <IconButton
                    disabled={question.state === QUESTION_ANSWERED}
                    onTouchTap={() => this.props.stopAskingQuestion(question.id, question.questionSet.course.id)
                                          .then(() => this.props.fetchQuestion(question.id))}>
                    <StopIcon color={white}/>
                </IconButton>
            );
        }
        return (
            <IconButton
                disabled={notIsQuestionDisplayed(question)}
                onTouchTap={() => this.props.askQuestion(question.id, question.questionSet.course.id)
                                      .then(() => this.props.fetchQuestion(question.id))}>
                <PlayArrowIcon color={white}/>
            </IconButton>
        );
    }

    renderToolbar(question: SelectedQuestion, questionIndex: number) {
        const {questionSet: {course, questions}} = question;
        return (
            <Toolbar>
                <ToolbarGroup firstChild={true}/>
                <ToolbarGroup>

                    {this.renderVisibilityButton(question)}

                    <IconButton
                        disabled={questionIndex === 0}
                        onTouchTap={() => this.props.selectQuestion(questions[questionIndex - 1].id)}>
                        <SkipPreviousIcon color={white}/>
                    </IconButton>

                    {this.renderActionButton(question)}

                    <IconButton
                        disabled={questionIndex + 1 === questions.length}
                        onTouchTap={() => this.props.selectQuestion(questions[questionIndex + 1].id)}>
                        <SkipNextIcon color={white}/>
                    </IconButton>

                    <ToolbarSeparator/>
                    <Link to={`/display/${course.id}`} target="_blank">
                        <RaisedButton
                            primary={true}
                            label={<FormattedMessage id="dashboard.question.project" defaultMessage="Project"/>}
                            icon={<OpenInNewIcon color={white}/>}/>
                    </Link>
                </ToolbarGroup>
            </Toolbar>

        );
    }

    render() {
        const {fetching, question} = this.props.selectedQuestion;
        if (fetching && !question){
            return (
                <div style={{height: '100%'}} className="row middle-xs center-xs">
                    <div><MoreHorizIcon/></div>
                </div>
            );
        }

        const {title, questionSet: {questions}} = question;
        const id = this.props.dashboard.selectedItemId;
        const questionIndex = findIndex(questions, {id});
        const secondaryTitle = <FormattedMessage
                                    id="dashboard.question.label"
                                    defaultMessage="Question (number)"
                                    values={{number: questionIndex + 1}}/>;
        return (
            <div style={{height: '100%'}}>
                <AppBar
                    iconElementLeft={
                        <IconButton
                            onTouchTap={this.goBackToQuestionSet.bind(this)}>
                            <ArrowBackIcon/>
                        </IconButton>
                    }
                    style={{backgroundColor: lightGreen400}}
                    title={(title !== '' ? title : secondaryTitle)}/>

                {this.renderToolbar(question, questionIndex)}

                <div style={{height: '100%'}} className="row middle-xs center-xs col-xs-offset-2 col-xs-8">
                    <QuestionDisplay question={question} displayResponse={true} displayStudentResponses={true}/>
                </div>
            </div>
        );
    }
}

function notIsQuestionDisplayed(question: SelectedQuestion) {
    const {questionSet: {course}} = question;
    return !course.displayedQuestion || course.displayedQuestion.id !== question.id;
}

function mapStateToProps(state: ApplicationState) {
    return {
        dashboard: state.dashboard,
        selectedQuestion: state.selectedQuestion
    }
}

export const QuestionContainer = connect(mapStateToProps, {
    selectQuestionSet, selectQuestion,
    displayQuestion, clearDisplayedQuestion,
    askQuestion, stopAskingQuestion,
    subscribeQuestionContainerToCourseChanges, unsubscribeToCourseChanges,
    fetchQuestion
})(QuestionContainerComponent);