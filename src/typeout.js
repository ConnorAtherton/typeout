/*
 * typeout.js
 *
 * Copyright 2014, Connor Atherton - http://connoratherton.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/ConnorAtherton/typeout
 */

"use strict";
// TODO Take gif of it working and add it to readme

let aq = require('aqueue');

/*
 *  Default options.
 */
var defaults = {
  interval: 3000,
  completeClass: 'typeout-complete',
  callback : function noop() {},
  numLoops: 1,
  max: 110,
  min: 40
};

var typeout = function(selector, words, options) {
  options = merge(defaults, (options || {}));
  options.words = words;

  var el = document.querySelector(selector);
  var shouldStartType = true;
  var aqueue = aq();
  let numLoops = 0;

  initialSetup();

  function initialSetup() {
    var html = el.innerHTML.trim();
    if (html !== "") {
      shouldStartType = false;
      options.words.unshift(html);
      el.innerHTML = '';
    }

    // start the spin loop
    startLoop();
  }

  function startLoop() {
    var stop = false;
    var currentElIndex = 0;
    var listLength = options.words.length;
    var stopping = false;

    options.words.forEach(function(el, i) {
      aqueue(type, options.words[currentElIndex]);

      if (currentElIndex === listLength - 1) {
        numLoops++;

        if (numLoops !== Infinity && numLoops === options.numLoops) {
          return aqueue(callback, null);
        }

        // Inifinite loop -> wouldn't advise but possible
        aqueue(pause, options.interval)(deleteWord);
        return startLoop();
      } else {
        aqueue(pause, options.interval)(deleteWord);
      }

      currentElIndex++;

      if (currentElIndex === listLength) currentElIndex = 0;
    });
  }

  function type(word, next) {
    var progress = 0;
    var wordLength = word.length;

    var interval = setInterval(function() {

      if (progress < wordLength) {
        el.innerHTML += word[progress];
        progress++;
      } else {
        window.clearInterval(interval);
        next();
      }

    }, getSpeed());
  }

  /*
   * BUG - aq won't invoke the function if no argument is passed which is kinda weird
   */
  function deleteWord(next) {
    var interval = setInterval(function() {
      var current = el.innerHTML;
      var length  = current.length;

      if (!length) {
        clearInterval(interval);
        next();
      }

      el.innerHTML = current.substring(0, length - 1);
    }, getSpeed());
  }

  function getSpeed() {
    var max = options.max;
    var min = options.min;

    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function pause(timeout, next) {
    setTimeout(function() {
      next();
    }, timeout);
  }

  function callback() {
    addClass(el, options.completeClass);
    options.callback(el);
  }
};

/*
 *  Merges two objects together.
 *
 *  Properties in the second object have higher
 *  precedence than corresponding properties in
 *  the first
 */
function merge(source, target) {
  let obj = {};

  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      obj[key] = (typeof target[key] !== "undefined") ? target[key] : source[key];
    }
  }

  return obj;
}

/*
 *  Adds a class.
 *
 *  Used when the word rotation is finished.
 */
function addClass(el, klass) {
  el.className += ' ' + klass;
}

global.typeout = typeout;

