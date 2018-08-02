// npm packages
const express = require('express');

// app imports
const { mutantsHandler } = require('../handlers');

// globals
const statRouter = new express.Router();
const { stats } = mutantsHandler;

/* All the Mutants Route */
statRouter
  .route('')
    .get(stats);

module.exports = statRouter;
