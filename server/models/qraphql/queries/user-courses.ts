import {GraphQLList} from "graphql";
import CourseType from "../types/course";

const QueryUserCourses = {
    type: new GraphQLList(CourseType),
    description: 'List the courses of the current user. The ones that he teaches if he is a teacher or the ones that he attends to if he is a student',
    resolve: (root: any, args: any, context: any) => {
        return context.user.populate({path: 'courses', options: {sort: {createdAt: -1}}}).execPopulate()
            .then((user: any) => user.courses)
    }
};

export default QueryUserCourses;

