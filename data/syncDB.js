require("dotenv").config();

const inquirer = require("inquirer");
const chalk = require("chalk");

const db = require("../models");
const seed = require("./seed.json");

inquirer
  .prompt([
    {
      name: "yes",
      type: "confirm",
      message: `This script will ${chalk.red(
        "DELETE ALL DATA"
      )} in your database and populate it with seed data!\nAre you sure?`,
      default: false
    }
  ])
  .then(answers => {
    answers.yes &&
      db.sequelize
        .sync({ force: true })
        .then(() => {
          seed.map(item => {
            db.Lighthouse.findOrCreate({
              where: { name: item.name },
              defaults: item
            })
              .then(([lighthouse, created]) => {
                const msg = `[${lighthouse.id}] ${lighthouse.name}`;
                console.log(created ? chalk.green(msg) : chalk.yellow(msg));
              })
              .catch(err => {
                console.log(err.message);
              });
          });
        })
        .catch(err => {
          console.log(err.message);
        });
  });
