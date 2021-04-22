"use strict";

function configureRefreshFetch(configuration) {
  var refreshToken = configuration.refreshToken,
      shouldRefreshToken = configuration.shouldRefreshToken,
      fetch = configuration.fetch;
  var refreshingTokenPromise = null;
  return function (url, options) {
    if (refreshingTokenPromise !== null) {
      return refreshingTokenPromise.then(function () {
        return fetch(url, options);
      }) // Even if the refreshing fails, do the fetch so we reject with
      // error of that request
      ["catch"](function () {
        return fetch(url, options);
      });
    }

    return fetch(url, options)["catch"](function (error) {
      if (shouldRefreshToken(error)) {
        if (refreshingTokenPromise === null) {
          refreshingTokenPromise = new Promise(function (resolve, reject) {
            refreshToken().then(function () {
              refreshingTokenPromise = null;
              resolve();
            })["catch"](function (refreshTokenError) {
              refreshingTokenPromise = null;
              reject(refreshTokenError);
            });
          });
        }

        return refreshingTokenPromise["catch"](function () {
          // If refreshing fails, continue with original error
          throw error;
        }).then(function () {
          return fetch(url, options);
        });
      } else {
        throw error;
      }
    });
  };
}

export { configureRefreshFetch };