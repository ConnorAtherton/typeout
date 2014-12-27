/*
 * typeout.js
 *
 * Copyright 2014, Connor Atherton - http://connoratherton.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/ConnorAtherton/typeout
 */

// TODO Make the typing and deleting humanlike (typewriter)
// TODO Write documentation
// TODO Add to website with styles
// TODO Take gif of it working and add it to readme

;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    window.typeout = factory();
  }
}(this, function factory(exports) {
  'use strict';

  /*
   *  Default options.
   */
  var defaults = {
    interval: 3000,
    completeClass: 'typeout-complete',
    callback : function noop() {},
    numLoops: Infinity
  };

  var Typeout = function(selector, words, options) {
    if(!(this instanceof Typeout)) return new Typeout(selector, words, options);

    this.options = merge(defaults, (options || {}));
    this.el = document.querySelector(selector);
    this.options.words = words;

    this.initialSetup();
  };

  var proto = Typeout.prototype;

  // adds space to enclosing tag if not already present.
  proto.initialSetup = function() {
    // read innerHTML of el and shift it onto the list
    // if it is non-empty
    var html = this.el.innerHTML.trim();
    if (html !== "") this.options.words.unshift(html);

    // start the spin loop
    this.startLoop();
  };

  // start the word loop
  proto.startLoop = function() {
    var stop = false;
    var loops = 0;
    var currentElIndex = 0;
    var listLength = this.options.words.length;

    // set initial word on first loop
    this.type(this.options.words[currentElIndex]);

    var interval = setInterval(function() {
      // Should we stop?
      if (currentElIndex === listLength - 1) {
        loops += 1;

        if (loops === this.options.numLoops) {
          clearInterval(interval);
          addClass(this.el, this.options.completeClass);
          this.options.callback.call(this);
        }
      }

      this.delete(function() {
        // Update all state..
        currentElIndex += 1;
        if (currentElIndex === listLength) currentElIndex = 0;

        this.type(this.options.words[currentElIndex]);
      });

    }.bind(this), this.options.interval);
  };

  proto.type = function(word) {
    var progress = 0;
    var wordLength = word.length;

    var interval = setInterval(function() {

      if (progress < wordLength) {
        this.el.innerHTML += word[progress];
        progress++;
      } else {
        window.clearInterval(interval);
      }

    }.bind(this), this.getSpeed());
  };

  proto.delete = function(typeNextWord) {
    var interval = setInterval(function() {
      var current = this.el.innerHTML;
      var length  = current.length;

      if (!length) {
        clearInterval(interval);
        return typeNextWord.call(this);
      }

      this.el.innerHTML = current.substring(0, length - 1);
    }.bind(this), this.getSpeed());
  };

  proto.getSpeed = function() {
    return 30;
  };

  /*
   *  @private
   *
   *  Helper functions
   */

  /*
   *  Merges two objects together.
   *
   *  Properties in the second object have higher
   *  precedence than corresponding properties in
   *  the first
   */
  function merge(source, target) {
    var obj = {};

    for (var key in source) {
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

  return Typeout;

}));
