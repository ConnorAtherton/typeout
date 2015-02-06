## typeout

Produces a nice text effect increasingly adopted by companies like [Google](), [npm]() and more.

[See a demo](http://htmlpreview.github.io/?https://github.com/ConnorAtherton/typeout/blob/master/example/index.html)

## how to use

``` js
/*
 * @params selector [string] -
 * @params wordList [array]  - Contains all the word to write
 * @params options  [object] - Override default options (shown below)
 */

typeout(selector, word_list, options);
```

Usually the selector will reference a **span** element or some other
element that is displaying inline. But it will work with any element.

```html
<h1 id="demo">
  San Francisco is <span class="typeout">amazing</span>
</h1>
```

Any html child element of the selector element will automatically be
appended to the append list. In the example above the word *amazing*
will be added to the world list you pass in.

```js
// basic usage with just one loop
typeout('.typeout', ['wonderful', 'eye-opening', 'an experience'], {
  callback: function(el) {
    el.innerHTML += ".";
  }
});
```

The code above will typeout all words in the word list once and on completion
will add a period (.) at the end.

### default options
```js
var defaults = {
  interval: 3000,
  completeClass: 'typeout-complete',
  callback : function noop() {},
  max: 110, // upper limit for typing speed
  min: 40,   // lower limit for typing speed
  numLoops: 1 // number of loops before the callback is called
};
```

You can have an infinite loop passing numLoops as Infinity, but I wouldn't recommend it.
Unless I add es6 generators at some point.

