import * as log from 'winston';
import {MongooseDocument, Types} from "mongoose";
import {User} from "./user";
import {CourseModel} from './mongodb/course';
import {QuestionSet, questionSetRepository} from "./question-set";
import {Question, questionRepository} from "./question";
import * as PubSub from 'pubsub-js';
import {
    COURSES_TOPIC, DISPLAYED_QUESTION_CHANGED, DISPLAYED_QUESTION_CLEARED,
    COURSE_SHOW_STATS_CHANGED, DISPLAYED_QUESTION_SET_CHANGED, DISPLAYED_QUESTION_SET_CLEARED
} from "../../common/messages/ws-messages";
import {USER_TEACHER, USER_STUDENT} from "../../common/types/user-types";

export interface Course {
    _id: Types.ObjectId,
    name: string,
    createdAt: Date,
    teacher: User,
    students: User[],
    questionSets: QuestionSet[],
    showStats: boolean,
    displayedQuestion: Question,
    displayedQuestionSet: QuestionSet
}

class CourseRepository {

    public createCourse(user: any & MongooseDocument, name: string): Promise<MongooseDocument & Course> {
        if (user.type !== USER_TEACHER) throw new Error('user-not-a-teacher');
        const course = new CourseModel({name: name, teacher: user._id, createdAt: Date.now(), showStats: false});
        return course.save().then((course) => {
            user.courses.push(course);
            return user.save().then(() => course);
        });
    }

    public addStudent(course: any & MongooseDocument, user: any & MongooseDocument): Promise<MongooseDocument & Course> {
        if (user.type !== USER_STUDENT) throw new Error('user-not-a-student');
        course.students.push(user);
        return course.save().then((course: any) => {
            user.courses.push(course);
            return user.save().then(() => course);
        });
    }

    public findById(id: string): Promise<MongooseDocument & Course> {
        return <any>CourseModel.findOne({_id: id}).exec().catch((err) => {
            log.error(`Error fetching course by id: ${id}`, err);
            return Promise.reject(new Error("course-not-found"));
        });
    }

    public findByIdIfOwner(courseId: string, user: any & MongooseDocument): Promise<MongooseDocument & Course> {
        return courseRepository.findById(courseId).then((course) => {
            if (!course) throw new Error('Course not found');
            if (course.teacher.toString() !== user._id.toString()) throw new Error('Forbidden access');

            return course;
        });
    }

    public toggleShowStats(course: any & MongooseDocument): Promise<MongooseDocument & Course> {
        course.showStats = !course.showStats;
        course.displayedQuestion = null;
        course.displayedQuestionSet = null;
        return course.save().then((course: any) => {
            PubSub.publish(`${COURSES_TOPIC}.${course._id}`, {msg: COURSE_SHOW_STATS_CHANGED});
            return course;
        });
    }

    public displayQuestion(course: any & MongooseDocument, questionId: string): Promise<MongooseDocument & Course> {
        return questionRepository.findByIdIfFromCourse(questionId, course).then((question) => {
            course.displayedQuestion = questionId;
            course.displayedQuestionSet = null;
            course.showStats = false;
            return course.save().then((course: any) => {
                PubSub.publish(`${COURSES_TOPIC}.${course._id}`, {msg: DISPLAYED_QUESTION_CHANGED});
                return course;
            });
        });
    }

    public clearDisplayedQuestion(course: any & MongooseDocument): Promise<MongooseDocument & Course> {
        course.displayedQuestion = null;
        return course.save().then((course: any) => {
            PubSub.publish(`${COURSES_TOPIC}.${course._id}`, {msg: DISPLAYED_QUESTION_CLEARED});
            return course;
        });
    }

    public displayQuestionSet(course: any & MongooseDocument, questionSetId: string): Promise<MongooseDocument & Course> {
        return questionSetRepository.findByIdIfFromCourse(questionSetId, course).then((questionSet) => {
            course.displayedQuestionSet = questionSet;
            course.displayedQuestion = null;
            course.showStats = false;
            return course.save().then((course: any) => {
                PubSub.publish(`${COURSES_TOPIC}.${course._id}`, {msg: DISPLAYED_QUESTION_SET_CHANGED});
                return course;
            })
        })
    }

    public clearDisplayedQuestionSet(course: any & MongooseDocument): Promise<MongooseDocument & Course> {
        course.displayedQuestionSet = null;
        return course.save().then((course: any) => {
            PubSub.publish(`${COURSES_TOPIC}.${course._id}`, {msg: DISPLAYED_QUESTION_SET_CLEARED});
            return course;
        })
    }
}

export const courseRepository = new CourseRepository();