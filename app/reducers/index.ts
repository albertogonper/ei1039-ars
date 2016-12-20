import {combineReducers} from 'redux';
import {reducer as formReducer} from 'redux-form';
import {intlReducer} from 'react-intl-redux';
import {SignupState, SignupReducer} from "./signup";
import {LoginState, LoginReducer} from "./login";
import {QuestionCreationState, QuestionCreationReducer} from "./questionCreation";
import {QuestionResponseReducer} from "./questionResponse";

export interface ApplicationState {
    login: LoginState,
    signup: SignupState,
    questionCreation : QuestionCreationState
}

const rootReducer = combineReducers({
    login: LoginReducer,
    signup: SignupReducer,
    form: formReducer,
    intl: intlReducer
});

export default rootReducer;