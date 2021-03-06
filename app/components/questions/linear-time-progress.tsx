import * as React from 'react';
const {Component} = React;
import {
    LinearProgress
} from 'material-ui';
import {
    lightGreen800,
    yellow800,
    red500
} from 'material-ui/styles/colors';
import {DisplayedQuestion} from "../../reducers/display-course";
import moment = require("moment");
import {QUESTION_UNASKED, QUESTION_ANSWERED, QUESTION_ASKED} from "../../../common/states/question-states";
import {KeypadQuestion} from "../../reducers/keypad";

interface LinearTimeProgressProps {
    question: DisplayedQuestion | KeypadQuestion
}

interface LinearTimeProgressState {
    currentProgress: number,
    progressColor: string
}


export class LinearTimeProgress extends Component<LinearTimeProgressProps, LinearTimeProgressState> {

    constructor(props: LinearTimeProgressProps) {
        super();

        const currentProgress = this.calculateInitialProgress(props);
        const progressColor = this.calculateProgressColor(currentProgress);
        this.state = {currentProgress, progressColor};

        this.performCountDown();
    }

    componentWillReceiveProps(nextProps: LinearTimeProgressProps) {
        const currentProgress = this.calculateInitialProgress(nextProps);
        const progressColor = this.calculateProgressColor(currentProgress);
        this.setState({currentProgress, progressColor});
    }

    calculateInitialProgress(props: LinearTimeProgressProps) {
        const {question: {time, state, askedAt}} = props;
        if (state === QUESTION_UNASKED) return time;
        if (state === QUESTION_ANSWERED) return 0;

        const diffInMs = moment().diff(moment(askedAt));
        const diffInS = moment.duration(diffInMs).get('seconds');
        const calculatedProgress = time - diffInS;

        return (calculatedProgress > 0) ? calculatedProgress : 0;
    }

    calculateProgressColor(progress: number) {
        return (progress > 10) ? lightGreen800 : (progress > 5) ? yellow800 : red500;
    }

    performCountDown() {
            setTimeout(() => {
                if (this.props.question.state === QUESTION_ASKED && this.state.currentProgress > 0) {
                    const {currentProgress} = this.state;
                    const progressColor = this.calculateProgressColor(currentProgress);
                    this.setState({
                        currentProgress: currentProgress - 1,
                        progressColor
                    });
                }
                this.performCountDown();
            }, 1000)
    }

    render() {
        const {question: {time}} = this.props;

        return (
            <div style={{height: '40px'}}>
                <h3 style={{color: this.state.progressColor}}>{`${this.state.currentProgress}s`}</h3>
                <LinearProgress
                    mode="determinate"
                    value={time - this.state.currentProgress}
                    min={0}
                    max={time}
                    color={this.state.progressColor}/>
            </div>
        );
    }
}