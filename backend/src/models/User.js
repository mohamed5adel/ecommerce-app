module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false, // ما يقبلش NULL
      validate: {
        notEmpty: true // ما يقبلش قيمة فاضية ""
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // ما يتكرررش
      validate: {
        notEmpty: true,
        isEmail: true // يتحقق إنه إيميل صحيح
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 100] // طول الباسورد بين 6 و100 حرف
      }
    }
  });

  return User;
};
