const { Movie, User } = require("../models");

async function authorization(req, res, next) {
  try {
    // proses pengecekan data movie di db
    // console.log(req.params.id);
    const { id } = req.params;
    const findMovie = await Movie.findByPk(id);
    // console.log(findUser, '<<<< INI USER');
    if (!findMovie) {
      throw { name: "not found", id: id };
    }

    // proses pengecekan privilege
    // console.log(req.user.id == findMovie.authorId)
    // console.log(req.user, '<<<< INI REQ.USERNYA');
    if (req.user.role === "admin") {
      next();
    } else if (req.user.role === "staff") {
      // console.log(req.user.role, '<<< USER ROLE');
      // console.log(findMovie.authorId, '<<< AUTHOR ID');
      // console.log(req.user.id, '<<< USER ID');
      if (req.user.id !== findMovie.authorId) {
        throw { name: "forbidden" };
      }
      next();
    }
  } catch (error) {
    next(error);
  }
}

module.exports = authorization;
