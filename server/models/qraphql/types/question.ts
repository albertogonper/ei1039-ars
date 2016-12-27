import {GraphQLObjectType} from "graphql";
import {GraphQLList} from "graphql";
import {GraphQLID} from "graphql";
import {GraphQLString} from "graphql";
import {GraphQLBoolean} from "graphql";
import QuestionSetType from "./question-set";
import {Question} from "../../question";

const AnswerType: any = new GraphQLObjectType({
    name: 'Answer',
    description: 'The representation of an answer part of a question on the system',
    fields: {
        option: {
            type: GraphQLString
        },
        text: {
            type: GraphQLString
        },
        isCorrect: {
            type: GraphQLBoolean
        }
    }
});

const QuestionType: any = new GraphQLObjectType({
    name: 'Question',
    description: 'The representation of a question on the system',
    fields: () => { // FIXME Access control
        return {
            id: {
                type: GraphQLID,
                resolve: question => question._id
            },
            title: {
                type: GraphQLString
            },
            createdAt: {
                type: GraphQLString,
                resolve: question => question.createdAt.toISOString()
            },
            questionSet: {
                type: QuestionSetType,
                resolve: question => question.populate('questionSet').execPopulate()
                    .then((question: Question) => question.questionSet)
            },
            answers: {
                type: new GraphQLList(AnswerType)
            }
        }
    }
});

export default QuestionType;
