// npm packages
const { Validator } = require('jsonschema');

// app imports
const { Mutant } = require('../models');
const { mutantNewSchema, mutantUpdateSchema } = require('../schemas');
const { validateSchema} = require('../helpers');

// globals
const v = new Validator();

/**
 * Validate the POST request body and create a new Mutant
 */
async function createMutant(request, response, next) {
  const validSchema = validateSchema(
    v.validate(request.body, mutantNewSchema),
    'Mutant'
  );
  if (validSchema !== 'OK') {
    return next(validSchema);
  }

  try {
    const newMutant = await Mutant.createMutant(new Mutant(request.body));

    let statusCode = 200;

    if (newMutant.adnType === 'human') {
      statusCode = 403;
    }

    return response.status(statusCode).json(newMutant);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single Mutant
 * @param {String} adn - the name of the Mutant to retrieve
 */
async function readMutant(request, response, next) {
  const { adn } = request.params;
  try {
    const Mutant = await Mutant.readMutant(adn);
    return response.json(Mutant);
  } catch (err) {
    return next(err);
  }
}

/**
 * Update a single Mutant
 * @param {String} adn - the name of the Mutant to update
 */
async function updateMutant(request, response, next) {
  const { adn } = request.params;

  const validationErrors = validateSchema(
    v.validate(request.body, mutantUpdateSchema),
    'Mutant'
  );
  if (validationErrors.length > 0) {
    return next(validationErrors);
  }

  try {
    const Mutant = await Mutant.updateMutant(adn, request.body);
    return response.json(Mutant);
  } catch (err) {
    return next(err);
  }
}

/**
 * Remove a single Mutant
 * @param {String} adn - the name of the Mutant to remove
 */
async function deleteMutant(request, response, next) {
  const { adn } = request.params;
  try {
    const deleteMsg = await Mutant.deleteMutant(adn);
    return response.json(deleteMsg);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  createMutant,
  readMutant,
  updateMutant,
  deleteMutant
};
