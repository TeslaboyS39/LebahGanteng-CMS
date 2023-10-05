'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Movie extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Movie.belongsTo(models.User, { foreignKey: 'authorId' })
      Movie.belongsTo(models.Genre, { foreignKey: 'genreId' })
    }
  }
  Movie.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title is required'
        },
        notEmpty: {
          msg: "Title cannot be empty"
        }
      }
    },
    synopsis: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Synopsis is required'
        },
        notEmpty: {
          msg: "Synopsis cannot be empty"
        }
      }
    },
    trailerUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    rating: {
      type: DataTypes.INTEGER,
      validate: {
        min: {
          args: [1],
          msg: 'Minimum rating is 1'
        }
      }
    },
    genreId: DataTypes.INTEGER,
    authorId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Movie',
  });
  
  Movie.beforeCreate((Movie) => {
    Movie.status = 'Active'
  })

  return Movie;
};