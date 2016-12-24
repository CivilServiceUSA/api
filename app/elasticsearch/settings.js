/**
 * @module elasticsearch/settings
 * @version 1.0.0
 * @author Peter Schmalfeldt <me@peterschmalfeldt.com>
 */

/**
 * Elasticsearch Settings
 * @type {object}
 */
module.exports = {
  index: {
    analysis: {
      char_filter: {
        remove_punctuation: {
          type: 'mapping',
          mappings: [
            '\\u0021=>',
            '\\u0022=>',
            '\\u0023=>',
            '\\u0024=>',
            '\\u0025=>',
            '\\u0026=>',
            '\\u0027=>',
            '\\u0028=>',
            '\\u0029=>',
            '\\u002A=>',
            '\\u002B=>',
            '\\u002C=>',
            '\\u002D=>',
            '\\u002E=>',
            '\\u002F=>'
          ]
        }
      },
      filter: {
        ngram_filter: {
          type: 'nGram',
          min_gram: 2,
          max_gram: 20
        },
        edge_ngram_filter: {
          type: 'edgeNGram',
          min_gram: 2,
          max_gram: 20
        }
      },
      analyzer: {
        ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'ngram_filter'
          ]
        },
        edge_ngram_analyzer: {
          type: 'custom',
          tokenizer: 'standard',
          filter: [
            'lowercase',
            'edge_ngram_filter'
          ]
        },
        ducet_sort: {
          tokenizer: 'keyword',
          filter: [
            'icu_collation'
          ],
          char_filter: [
            'remove_punctuation'
          ]
        }
      }
    }
  }
};
