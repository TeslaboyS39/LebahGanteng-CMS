const { User, Genre, Movie, History } = require('../models');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
const { comparePasswords } = require('../helpers/bcrypt');
const { createToken } = require('../helpers/jwt');
const {OAuth2Client} = require('google-auth-library');

class Controller {
    static async showAllMovies(req, res, next) {
        try {
            const movies = await Movie.findAll({
                include: [User, Genre],
            })

            res.status(200).json(movies);
        } catch (error) {
            next(error)
        }
    }

    static async showOneMovie(req, res, next) {
        try {
            const { id } = req.params;

            const movie = await Movie.findByPk(id, {
                include: [User, Genre]
            });

            if (!movie) {
                throw { name: 'movieNotFound' };
            }

            res.status(200).json(movie);
        } catch (error) {
            // console.log(error, '<<<<<<')
            next(error);
        }
    }

    static async addMovie(req, res, next) {
        // console.log(req.body);
        try {
            const { title, synopsis, trailerUrl, imageUrl, rating, genreId } = req.body;

            const genre = await Genre.findByPk(genreId);

            if (!genre) {
                throw { name: 'genreNotFound', error: 'Genre not found' };
            }

            const newMovie = await Movie.create({
                title,
                synopsis,
                trailerUrl,
                imageUrl,
                rating,
                genreId,
                authorId: req.user.id,
            });

            let description = `new entity with id ${newMovie.id} created`
            const history = await History.create({title: newMovie.title, description, updatedBy: req.user.email});

            res.status(201).json({message: `Movie with id ${newMovie.id} has been created`, newMovie, history});
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async deleteOneMovie(req, res, next) {
        try {
            await Movie.destroy({ where: { id: req.params.id } })

            res.status(200).json({ message: `Movie with id ${req.params.id} deleted succesfully.`})
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async showAllGenres(req, res, next) {
        try {
            const genres = await Genre.findAll();
            res.status(200).json(genres);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async register(req, res, next) {
        try {
            const { userName, email, password, phoneNumber, address } = req.body;

            const user = await User.create({ userName, email, password, phoneNumber, address })

            res.status(201).json({ message: `User with id ${user.id} is created` });
        } catch (error) {
            // console.log(error);
            next(error);
        }
    }

    static async login(req, res, next) {
        try {
            const { email, password } = req.body

            if (!email) {
                throw { name: 'badRequest', message: 'Email cannot be empty' };
            }
    
            if (!password) {
                throw { name: 'badRequest', message: 'Password cannot be empty' };
            }

            const user = await User.findOne({ where: { email } })

            if (!user) {
                throw { name: 'unauthenticated', message: 'Invalid email' };
            }

            const validPass = comparePasswords(password, user.password);
            console.log(validPass);

            if (!validPass) {
                throw { name: 'unauthenticated', message: 'Invalid password' };
            }

            const access_token = createToken({ id: user.id });
            // console.log(access_token);
            res.status(200).json({ access_token, userName: user.userName })
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    static async googleLogin(req, res) {
        try {
            const { google_token } = req.headers;
            const client = new OAuth2Client();

            const ticket = await client.verifyIdToken({
                idToken: google_token,
                audience: process.env.GOOGLE_CLIENT_ID, 
            });

            const payload = ticket.getPayload();

            // console.log(payload, '<<<<<');
            const [user, isCreated] = await User.findOrCreate({
                where: {
                    email:payload.email
                },
                defaults: {
                    userName: payload.name,
                    email: payload.email,
                    password: String(Math.floor(Math.random() * 88888) + 11111), // rentang keacakan pw login google dari 11111 - 99999
                    role: 'staff',
                    phoneNumber: 'N/A',
                    address: 'N/A'
                },
                hook: false,
            });

            // console.log(user, '<<<< INI USER BRO');
            // console.log(isCreated, '<<<< INI ISCREATED BRO');
            const access_token = createToken({
                id: user.id
            });

            let status = 200;
            if (isCreated) status = 201;

            res.status(status).json({ access_token, userName: user.userName })
        } catch (error) {
            next(error);
        }

    }

    static async showAllHistories(req, res, next) {
        try {
            const histories = await History.findAll({
                order: [['id', 'DESC']]
            })

            res.status(200).json(histories);
        } catch (error) {
            console.log(error, 'ERRORNYA DISINI');
            next(error)
        }
    }

    static async updateMovie(req, res, next) {
        try {
            const { id } = req.params;
            const { title, synopsis, trailerUrl, imageUrl, rating, genreId } = req.body;
            const movie = await Movie.findByPk(id);

            if (!movie) {
                throw { name: 'movieNotFound' };
            }

            let updatedMovie = await Movie.update({
                title,
                synopsis,
                trailerUrl,
                imageUrl,
                rating,
                genreId
            }, {
                where: { id }
            })

            let description = `Movie with id ${id} updated`;
            const history = await History.create({title, description, updatedBy: req.user.email});
            
            res.status(200).json({ message: 'Movie updated successfully', updatedMovie, history });
        } catch (error) {
            next(err);
            // 404 & 403
        }
    }

    static async updateStatus(req, res, next) {
        try {
            const { id } = req.params;
            let { status } = req.body;
            const movie = await Movie.findByPk(id);

            if (!movie) {
                throw { name: 'movieNotFound' };
            }

            let updatedStatus = await Movie.update({ status }, {
                where: { id }
            });

            let description = `entity with id ${id} status has been updated from ${movie.status} into ${status}`
            const history = await History.create({title: movie.title, description, updatedBy: req.user.email});
            res.status(200).json({ message: 'Movie status updated successfully', updatedStatus, history });
        } catch (error) {
            next(error);
            // 404 & 403
        }
    }
}

module.exports = Controller;