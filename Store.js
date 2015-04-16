/**
 * Implementaion of a generic store you can populate with data
 *
 * API Short reference:
 *   Store.create(String category, Array items|Object item);
 *   Store.update(String category, Array items|Object item);
 *   Store.get(String category, String id);
 *   Store.remove(String category, Array items|Object item);
 *   Store.clean(String category);
 */
void function () {
  'use strict';

  var _Store = {
    storage: {},

    /**
     * Generate unique IDs
     * Taken from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
     * and shortened UIDs
     * @return {String} Unique id
     */
    generateUuid: function () {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-';
    },

    /**
     * Find an item based on a name
     * @param  {Array}       category Category in store to find (first level)
     * @param  {String}      id       ID which you want to find
     * @return {null|Object}          Item which was found or null
     */
    find: function (category, id) {
      var item = null;
      var i = 0;

      if (!_Store.storage[category]) {
        return null;
      }

      if (typeof category !== 'string') {
        throw new Error('Store#find: Category ' + category + ' is not a string.');
      }

      if (typeof id !== 'string') {
        throw new Error('Store#find: ID ' + id + ' is not a string.');
      }

      for (; _Store.storage[category].length > i; i++) {
        if (_Store.storage[category][i].id === id) {
          item = _Store.storage[category][i];
        }
      }

      return item;
    },

    /**
     * Create a new category (child) in store
     * @param  {String}       category Name of category you want to create
     * @return {Object|false}          item, if could be created; false if category is alreay available
     */
    createCategory: function (category) {
      if (!_Store.storage[category]) {
        _Store.storage[category] = [];

        return true;
      }

      return false;
    },

    /**
     * Create a new item in store, update exisiting if that's what we're looking for
     * @param  {String}       category Category to look out for
     * @param  {Array}        items     Items that should be created
     * @return {Object|false}          Created object
     */
    create: function (category, items) {
      if (!_Store.storage[category]) {
        throw new Error('Store: Category ' + category + ' does not exist.');
      }

      // Should be an array
      if (items.constructor !== Array) {
        items = [items];
      }

      items.forEach(function (item) {

        if (!item.id) {
          item.id = _Store.generateUuid();
        }

        if (_Store.find(category, item.id)) {
          return _Store.update(category, item);
        }

        // Set an index on _Store item
        item.index = _Store.storage[category].length;

        _Store.storage[category].push(item);
      });

      return items;
    },

    /**
     * Remove item from store
     * @param  {String}  category Category to look out for
     * @param  {Array}   ids      Name of item that should be removed
     * @return {Boolean}          true, if removal was successful
     */
    remove: function (category, ids) {

      // Ensure that we use an array
      if (ids.constructor !== Array) {
        ids = [ids];
      }

      ids.forEach(function (id) {
        var storedItem = _Store.find(category, id);

        if (storedItem !== null) {
          _Store.storage[category] = _Store.storage[category].filter(function (item) {
            return item.id !== id;
          });
        }
      });

      return true;
    },

    /**
     * Update existing item in store
     * @param  {String}  category Category to look out for
     * @param  {Object}  item     New item
     * @return {Boolean}          True, if update was ok; false if item does not exist
     */
    update: function (category, item) {
      var storedItem = _Store.find(category, item.id);

      if (!_Store.storage[category]) {
        throw new Error('Store: Category "' + category + '" does not exist.');
      }

      if (storedItem !== null) {
        _Store.storage[category][storedItem.index] = extend(storedItem, item);

        return true;
      }

      return false;
    },

    /**
     * Clean up a category tree
     * @param  {Array}       category Category in store to find (first level)
     * @return {Array|false}          Empty category, false if category not present
     */
    clean: function (category) {
      if (!_Store.storage[category]) {
        return false;
      }

      _Store.storage[category] = [];

      return _Store.storage[category];
    }
  };

  /**
   * API
   */
  var Store = {

    /**
     * Get item from storage, proxy for private _Store.find
     * @param  {Array}       category Category in store to find (first level)
     * @param  {String}      id       id which you want to find
     * @return {null|Object}          Item which was found or null
     */
    get: function (category, id) {
      return _Store.find(category, id);
    },

    /**
     * Create a new item
     * @param  {String}       category Category to look out for
     * @param  {Object}       item     Item that should be created
     * @return {Object|false}          Item or false
     */
    create: function (category, item) {
      _Store.createCategory(category);
      return _Store.create(category, item);
    },

    /**
     * Update item in storage, proxy for private _Store.update
     * @param  {Array}   category Category in store to find (first level)
     * @param  {Object}  item     Item you want to find
     * @return {Boolean}          Whether or not update was successfull
     */
    update: function (category, item) {
      return _Store.update(category, item);
    },

    /**
     * Remove item from storage, proxy for private _Store.remove
     * @param  {Array}   category Category in store to find (first level)
     * @param  {Array}   name    Name which you want to find
     * @return {Boolean}          Whether or not removal was successfull
     */
    remove: function (category, name) {
      return _Store.remove(category, name);
    },

    /**
     * Get full storage
     * @return {Object} Set full storage
     */
    getAll: function () {
      return _Store.storage;
    },

    /**
     * Get all elements from a category
     * @param  {Array} category Category in store to find (first level)
     * @return {Array}          All items in category
     */
    getAllByCategory: function (category) {
      return _Store.storage[category];
    },

    /**
     * Clean up a category
     * @param  {Array} category Category in store to find (first level)
     * @return {Array}          Empty category
     */
    clean: function (category) {
      return _Store.clean(category);
    }
  };


  /*
   * AMD, module loader, global registration
   */

  // Expose loaders that implement the Node module pattern.
  if (typeof module === 'object' && module && typeof module.exports === 'object') {
    module.exports = Store;

  // Register as an AMD module
  } else if (typeof define === 'function' && define.amd) {
    define('Store', [], function () {
      return Store;
    });

  // Export into global space
  } else if (typeof global === 'object' && typeof global.document === 'object') {
    global.Store = Store;
  }
}();
