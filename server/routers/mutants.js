// npm packages
const express = require('express');

// app imports
const { mutantHandler, mutantsHandler } = require('../handlers');

// globals
const router = new express.Router();
const { readMutants } = mutantsHandler;
const { createMutant } = mutantHandler;

/* All the Mutants Route */
router
  .route('')
    .get(readMutants)
    .post(createMutant);

module.exports = router;
