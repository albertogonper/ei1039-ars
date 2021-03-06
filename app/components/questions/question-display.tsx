import * as React from 'react';
import {
    List,
    ListItem,
    Paper,
    Avatar,
    LinearProgress
} from 'material-ui';
import {
    transparent,
    blue700,
    orange700,
    green700,
    yellow700,
    lightGreen500,
    red500
} from 'material-ui/styles/colors';
import CheckIcon from 'material-ui/svg-icons/navigation/check';
import CloseIcon from 'material-ui/svg-icons/navigation/close';
import {DisplayedQuestion} from "../../reducers/display-course";
import {LinearTimeProgress} from "./linear-time-progress";
import {filter} from "lodash";

interface QuestionDisplayProps {
    question: DisplayedQuestion,
    displayResponse: boolean,
    displayStudentResponses?: boolean
}

export const QuestionDisplay = (props: QuestionDisplayProps) => {

    const {question} = props;
    const {responses} = props.question;
    const colors = [blue700, orange700, green700, yellow700];

    return (
        <div style={{height: '530px', width: '400px'}}>
            <LinearTimeProgress question={question}/>
            <h1>{(question.title) ? question.title: ' '}</h1>
            <div className="start-xs">
                <Paper>
                    <List>
                        {question.answers.map((answer, i) => {
                            return (
                                <ListItem
                                    rightIcon={
                                        (props.displayResponse) ? ((answer.isCorrect) ?
                                        <CheckIcon color={lightGreen500}/> :
                                        <CloseIcon color={red500}/>) : null
                                    }
                                    leftAvatar={
                                        <Avatar
                                        color={colors[i]} backgroundColor={transparent}
                                        style={{left: 8}}>
                                            {answer.option}
                                        </Avatar>
                                    }
                                    key={`${question.id}_${answer.option}`}>

                                        <div>{(answer.text) ? answer.text : ''}</div>
                                        {(props.displayStudentResponses) ?
                                            <div>
                                                <LinearProgress
                                                    mode="determinate"
                                                    max={responses.length === 0 ? 1 : responses.length}
                                                    color={colors[i]}
                                                    value={filter(responses, (response) => response.option === answer.option).length}/>
                                            </div>
                                            : null}
                                </ListItem>
                            );
                        })}
                    </List>
                </Paper>
            </div>
        </div>
    );
};