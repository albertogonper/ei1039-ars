import * as express from 'express';
import * as passport from 'passport';
import * as log from 'winston';
import {userRepository, UserSignupData} from "../models/user";

export const createAuthRouter = (): express.Router => {
    const router = express.Router();

    router.post('/signup', (req, res) => {
        //FIXME Validate data first

        const newUser: UserSignupData = {
            email: req.body.email.trim().toString(),
            password: req.body.password.trim().toString(),
            name: req.body.name.trim().toString(),
            type: req.body.type.trim().toString()
        };

        userRepository.save(newUser)
            .then((user) => res.status(200).json({success: true, message: 'User signed up'}))
            .catch((err) => {
              log.info(err);
              return res.status(409).json({success: false, message: err.message, errors: err.errors})
            });
    });

    router.post('/login', (req, res, next) => {
          // FIXME Validate data first

        passport.authenticate('local-login', {session: false}, (err: any, loginData: any, info: any) => {
            if (err) {
                return res.status(409).json({success: false, message: err.message, errors: err.errors});
            }
            return res.status(200).json({success: true, message: 'User logged in', data: loginData});
        })(req, res, next);
    });

    return router;
};