import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DATABASE_URLI, {
  dialect: "postgres",
  protocol: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export default sequelize;
