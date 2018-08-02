// app imports
const { Mutant } = require('../models');
const { parseSkipLimit } = require('../helpers');

/**
 * List all the Mutants. Query params ?skip=0&limit=1000 by default
 */
async function readMutants(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip, null, 'skip') || 0;
  let limit = parseSkipLimit(request.query.limit, 1000, 'limit') || 1000;
  if (typeof skip !== 'number') {
    return next(skip);
  } else if (typeof limit !== 'number') {
    return next(limit);
  }

  try {
    const Mutants = await Mutant.readMutants({}, {}, skip, limit);
    return response.json(Mutants);
  } catch (err) {
    next(err);
  }
}

/**
 * Count Muntants
 */
async function stats(request, response, next) {
  /* pagination validation */
  let skip = parseSkipLimit(request.query.skip, null, 'skip') || 0;
  let limit = parseSkipLimit(request.query.limit, 1000, 'limit') || 1000;
  if (typeof skip !== 'number') {
    return next(skip);
  } else if (typeof limit !== 'number') {
    return next(limit);
  }

  try {
    const Mutants = await Mutant.stats({}, {}, skip, limit);
    return response.json(Mutants);
  } catch (err) {
    next(err);
  }
}
module.exports = {
  readMutants,
  stats
};
