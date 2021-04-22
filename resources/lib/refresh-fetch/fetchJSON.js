"use strict";

/* global fetch */
const fetchJSON = function fetchJSON(url) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var jsonOptions = Object.assign({}, {
    headers: {
      'Content-Type': 'application/json'
    }
  }, options);
  return fetch(url, jsonOptions).then(function (response) {
    return getResponseBody(response).then(function (body) {
      return {
        response: response,
        body: body
      };
    });
  }).then(checkStatus);
};

const getResponseBody = function getResponseBody(response) {
  var contentType = response.headers.get('content-type');
  return contentType && contentType.indexOf('json') >= 0 ? response.text().then(tryParseJSON) : response.text();
};

const tryParseJSON = function tryParseJSON(json) {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json);
  } catch (e) {
    throw new Error("Failed to parse unexpected JSON response: ".concat(json));
  }
};

function ResponseError(status, response, body) {
  this.name = 'ResponseError';
  this.status = status;
  this.response = response;
  this.body = body;
} // $FlowIssue


ResponseError.prototype = Error.prototype;

var checkStatus = function checkStatus(_ref) {
  var response = _ref.response,
      body = _ref.body;

  if (response.ok) {
    return {
      response: response,
      body: body
    };
  } else {
    throw new ResponseError(response.status, response, body);
  }
};

export { fetchJSON };