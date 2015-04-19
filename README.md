# Store - vanilla-store

A JavaScript storing library

[![Build Status](https://api.travis-ci.org/drublic/Store.svg)](http://travis-ci.org/drublic/Store)

## Install

    npm install --save vanilla-store

## API

    Store.create(String category, Array items|Object item);
    Store.update(String category, Array items|Object item);
    Store.get(String category, String id);
    Store.remove(String category, Array items|Object item);
    Store.clean(String category);

## Dependencies

If you want to store nested objects with Store please make sure to use a deep
object extend function. You can do so by providing a global `extend` function,
include jQuery or Lodash/Underscore.

## Tests

Please run `npm run test`. Tests are written utilizing Jasmine.

## License

MIT - 2015, Hans Christian Reinl
