const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const bcrypt = require("bcrypt");

/**
 * Modelo Sequelize que representa um usuário da aplicação.
 * Por padrão, o campo `password` é excluído de todas as consultas
 * para evitar exposição acidental da senha.
 *
 * @model User
 * @property {string} name - Nome do usuário (máx. 40 caracteres)
 * @property {string} userName - Nome de usuário único (máx. 40 caracteres)
 * @property {string} email - E-mail único e válido do usuário (máx. 70 caracteres)
 * @property {string} password - Senha do usuário armazenada como hash bcrypt (máx. 64 caracteres)
 *
 * @hook beforeCreate - Realiza o hash da senha antes de inserir o usuário no banco
 * @hook beforeUpdate - Realiza o hash da senha antes de atualizar, apenas se ela foi alterada
 */
const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING(40),
        allowNull: false
    },
    userName: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
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
    defaultScope: {
        attributes: { exclude: ['password'] }
    }
});

/**
 * Hook executado antes da criação de um novo usuário.
 * Realiza o hash da senha utilizando bcrypt com salt de 10 rounds.
 *
 * @hook beforeCreate
 * @param {Object} user - Instância do usuário a ser criado
 */
User.beforeCreate(async (user) => {
    const salt = 10;
    user.password = await bcrypt.hash(user.password, salt);
});

/**
 * Hook executado antes da atualização de um usuário existente.
 * Realiza o hash da nova senha apenas se o campo `password` foi modificado,
 * evitando re-hash desnecessário em atualizações de outros campos.
 *
 * @hook beforeUpdate
 * @param {Object} user - Instância do usuário a ser atualizado
 */
User.beforeUpdate(async (user) => {
    if (user.changed('password')) {
        const salt = 10;
        user.password = await bcrypt.hash(user.password, salt);
    }
});

module.exports = User;
