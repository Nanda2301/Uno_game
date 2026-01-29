const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const bcrypt = require("bcrypt");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0 // Evita idades negativas
        }
    },
    email: {
        type: DataTypes.STRING(70),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false
    }
}, {
    // 2. SEGURANÇA: Nunca retorna a senha nas buscas (find, get, etc.)
    defaultScope: {
        attributes: { exclude: ['password'] }
    }
});

// Hook para criar a hash antes de CRIAR o usuário
User.beforeCreate(async (user) => {
    const salt = 10;
    user.password = await bcrypt.hash(user.password, salt);
});

// 3. Hook para criar a hash antes de ATUALIZAR o usuário
// Se for preciso mudar a senha no futuro, isso garante que ela seja criptografada
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = 10;
        user.password = await bcrypt.hash(user.password, salt);
    }
});

module.exports = User;