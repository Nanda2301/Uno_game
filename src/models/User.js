const {DataTypes} = require("sequelize");
const sequelize = require("../database");
const bcrypt = require("bcrypt")

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    userName:{
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    email:{
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate:{
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
})

User.beforeCreate(async (user)=>{
    const salt = 10
    user.password = await bcrypt.hash(user.password, salt)
})

module.exports = User;