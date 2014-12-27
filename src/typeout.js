/*
 * typeout.js
 *
 * Copyright 2014, Connor Atherton - http://connoratherton.com/
 * Released under the MIT Licence
 * http://opensource.org/licenses/MIT
 *
 * Github:  http://github.com/ConnorAtherton/typeout
 */

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
    numLoops: Infinity,
    max: 100,
    min: 30
  };

  var Typeout = function(selector, words, options) {
    if(!(this instanceof Typeout)) return new Typeout(selector, words, options);

    this.options = merge(defaults, (options || {}));
    this.el = document.querySelector(selector);
    this.options.words = words;
    this.shouldStartType = true;

    this.initialSetup();
  };

  var proto = Typeout.prototype;

  proto.initialSetup = function() {
    var html = this.el.innerHTML.trim();
    if (html !== "") {
      this.shouldStartType = false;
      this.options.words.unshift(html);
    }

    // start the spin loop
    this.startLoop();
  };

  proto.startLoop = function() {
    var stop = false;
    var loops = 0;
    var currentElIndex = 0;
    var listLength = this.options.words.length;
    var stopping = false;

    if (this.shouldStartType) {
      // set initial word on first loop
      this.type(this.options.words[currentElIndex]);
    }

    var interval = setInterval(function() {
      // Update all state..
      currentElIndex += 1;
      if (currentElIndex === listLength) currentElIndex = 0;

      var tryStop = function () {
        if (stopping) {
          addClass(this.el, this.options.completeClass);
          this.options.callback.call(this, this.el);
        }
      };

      this.delete(function() {
        this.type(this.options.words[currentElIndex], tryStop);
      });

      // Should we stop?
      if (currentElIndex === listLength - 1) {
        loops += 1;

        if (loops === this.options.numLoops) {
          stopping = true;
          return clearInterval(interval);
        }
      }

    }.bind(this), this.options.interval);
  };

  proto.type = function(word, fn) {
    var progress = 0;
    var wordLength = word.length;

    var interval = setInterval(function() {

      if (progress < wordLength) {
        this.el.innerHTML += word[progress];
        progress++;
      } else {
        window.clearInterval(interval);
        fn && fn.call(this);
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
    var max = this.options.max;
    var min = this.options.min;

    return Math.floor(Math.random() * (max - min + 1) + min);
  };

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
