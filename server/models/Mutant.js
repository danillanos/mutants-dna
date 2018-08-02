// npm packages
const mongoose = require('mongoose');

// app imports
const { APIError, processDBError, dnaAnalyzerObject } = require('../helpers');

// globals
const Schema = mongoose.Schema;

const mutantSchema = new Schema({
  code: String,
  adn: Array,
  adnType : String
});

mutantSchema.statics = {
  /**
   * Create a Single New Mutant
   * @param {object} newMutant - an instance of Mutant
   * @returns {Promise<Mutant, APIError>}
   */
  async createMutant(newMutant) {

    let dnaType = '';

    try {
      const duplicate = await this.findOne({ adn: newMutant.adn });
      if (duplicate) {
        throw new APIError(
          409,
          'Mutant Already Exists',
          `There is already a registry with adn code '${newMutant.adn}'.`
        );
      }


      dnaType = (dnaAnalyzerObject.isMutant(newMutant.adn))? 'mutant' : 'human';
      newMutant.adnType = dnaType;

      const Mutant = await newMutant.save();
      return Mutant.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Delete a single Mutant
   * @param {String} adn - the Mutant's adn
   * @returns {Promise<Mutant, APIError>}
   */
  async deleteMutant(adn) {
    try {
      const deleted = await this.findOneAndRemove({ adn }).exec();
      if (deleted) {
        return {
          Success: [
            {
              status: 200,
              title: 'Mutant Deleted.',
              detail: `The Mutant '${adn}' was deleted successfully.`
            }
          ]
        };
      }
      throw new APIError(404, 'Mutant Not Found', `No Mutant '${adn}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
    /**
   * Stats
   * @returns {Promise<Mutant, APIError>}
   */
  async stats() {
    try {
      const Humans = await this.count({ adnType: "human" }).exec();
      const Mutants = await this.count({ adnType: "mutant" }).exec();

      let stats = {
        "count_mutant_dna":Mutants,
        "count_human_dna":Humans,
        "ratio":(Humans / Mutants)
      }

       if (stats) {
         return stats;
       }

      throw new APIError(404, 'Humans Not Found', `No humans  found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a single Mutant by name
   * @param {String} adn - the Mutant's name
   * @returns {Promise<Mutant, APIError>}
   */
  async readMutant(adn) {
    try {
      const Mutant = await this.findOne({ adn }).exec();

      if (Mutant) {
        return Mutant.toObject();
      }
      throw new APIError(404, 'Mutant Not Found', `No Mutant '${adn}' found.`);
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Get a list of Mutants
   * @param {Object} query - pre-formatted query to retrieve Mutants.
   * @param {Object} fields - a list of fields to select or not in object form
   * @param {String} skip - number of docs to skip (for pagination)
   * @param {String} limit - number of docs to limit by (for pagination)
   * @returns {Promise<Mutants, APIError>}
   */
  async readMutants(query, fields, skip, limit) {
    try {
      const Mutants = await this.find(query, fields)
        .skip(skip)
        .limit(limit)
        .sort({ adn: 1 })
        .exec();
      if (!Mutants.length) {
        return [];
      }

      return Mutants.map(Mutant => Mutant.toObject());
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  },
  /**
   * Patch/Update a single Mutant
   * @param {String} name - the Mutant's name
   * @param {Object} MutantUpdate - the json containing the Mutant attributes
   * @returns {Promise<Mutant, APIError>}
   */
  async updateMutant(adn, MutantUpdate) {
    try {
      const Mutant = await this.findOneAndUpdate({ adn }, MutantUpdate, {
        new: true
      }).exec();
      return Mutant.toObject();
    } catch (err) {
      return Promise.reject(processDBError(err));
    }
  }
};

/* Transform with .toObject to remove __v and _id from response */
if (!mutantSchema.options.toObject) mutantSchema.options.toObject = {};
mutantSchema.options.toObject.transform = (doc, ret) => {
  const transformed = ret;
  delete transformed._id;
  delete transformed.__v;
  return transformed;
};

/** Ensure MongoDB Indices **/
mutantSchema.index({ name: 1, number: 1 }, { unique: true }); // example compound idx

module.exports = mongoose.model('Mutant', mutantSchema);
