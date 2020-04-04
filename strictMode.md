# "use strict"; in JavaScript: A Deep Dive

## What is "use strict";

"use strict" was introduced in ES5, as a way to write more "secure" code.

Writing code in strict mode will throw errors in places where normal mode, or "sloppy" as it's called sometimes, wouldn't. Why would you want more errors in your code? Simple, because syntax errors are much easier to debug than logical errors.

You are working on a new app, and when you try to run it the JavaScript engine throws an error. It tells you the exact line where the error occurred as well as the type of error. So, you simply go that line and fix it!

On the flip side, if you have never gotten the error, most likely at some point you would start getting unexpected results. The code is perfectly valid (syntactically), however, the logic is not. In this scenario, you would have to go back and check your code line by line, try to run it in your head (even if you used the debugger, it's still a lot of work), and figure out why you got the results that you got.

Using strict mode can save you time and frustration that you can use later on a more complex bug!

## How do you use strict mode?

All you have to do is type "use strict"; (both single and double quotes are valid) at the top of your JS file(global) or as the first line inside a function(local).

Usually, you want to use strict mode globally, since it still affects the code inside your functions, but here is a catch! **"use strict;" works only if it's the first line of code on your file/function.** So, if you minify or bundling your JS files before deployment you might accidentally "disable" it. In a case where you want to be certain that parts of your code will run in strict mode, using "use strict" inside specific functions would make sense.

One final thing to remember; JS modules are automatically in strict mode.

## When should you use it?

Short answer; always. It forces you to write better and safer code, and it's intended to make it easier for JS engines to optimize your code. Earlier versions of JavaScript will just ignore it, so there is no need to worry about that either.

However, you shouldn't rely on strict mode, since older browsers might not support it. Always make sure that **your code runs on both strict and non-strict mode.**

## Strict Mode

1. **Using a variable without declaring it will throw an error**
   Assigning a value to an undeclared variable (think python/ruby style) is allowed in "normal" JavaScript. However, you should avoid it since it creates a new property on the global object (the window in case of the browser.)

    ```javascript
    function add(a, b) {
    	result = a + b
    	return result
    }

    const calc = add(5, 4)
    console.log(result) // 9
    ```

    In the example above, we never declared a result variable, thus it was added to the global object.

    Side: undeclared variables are not technically variables, they are properties of the global object, and thus they can be deleted with the delete operator:

    ```javascript
    console.log(delete result) // true
    console.log(delete calc) // false
    ```

    Here's another example:

    ```javascript
    let simpleSwitch = false
    function myFunc() {
    simpleSwicth = true // mispelled simpleSwitch
    }
    myFunc()
    console.log('something') // this code is never executed
    }
    ```

    Misspelling a variable's name can cause a logical error that could potentially be quite hard to find.

    In a strict mode, both of these cases will error out (ReferenceError: XX is not defined), making it much, much easier to debug!

    Finally, if you are doing chain assignment, let a = b = 0, be aware that due to right-to-left evaluation, 0 is assigned to an **undeclared variable b** which is then assigned to let a. In a case like this, all you have to do is declare both variables beforehand.

    ```javascript
    function myFun2() {
    	let a = (b = 0)
    	console.log(a)
    }
    myFun2()
    // console.log(a); throws error regardless
    console.log(b) // works in non-strict
    ```

1. **The "default" value of this is undefined instead of the global object**
   If you don't know how exactly this works, firstly none of us truly does, secondly, check out this [video](https://www.youtube.com/watch?v=gvicrj31JOM). Working with the this keyword will most likely cause some unexpected behaviors sooner or later, luckily, strict mode can make debugging a little bit easier. Let's see how!

    ```javascript
    const obj = {
    	name: 'Saraj',

    	// shorthand for logger: function(){...}
    	logger() {
    		function nameChanger() {
    			this.name = 'Maria'
    		}
    		nameChanger()

    		console.log(this.name)
    	}
    }

    obj.logger() // Sarah

    console.log(name) // Maria
    ```

    In this example, we have an object obj, with a property name and a method logger. When logger is called, it creates a function nameChanger, which assigns a new value to this.name. It then calls nameChanger, and finally logs this.name. However, this doesn't work as we would want it to. obj.logger() gave us 'Sarah' and we also created a new name property on the global object.

    logger is a method of obj, so, inside logger, this refers to obj. However, nameChanger is not a method to obj, and so this goes back to referring to the global object. When this.name = 'Maria' is executed, all it does is adds the property name to the global object.

    The code is valid. It just doesn't work the way we want. Errors like this can be quite hard to fix in a larger program!

    In strict mode, however, this inside function is set to undefined instead of the global object. In the example above we would have tried undefined.name = 'Maria'. That would have given us a big fat error, indicating that this is not what we expected it to be inside nameChange. There would still be some debugging to do, but at least we would have had a clue of what and where the error was.

    We are now done with the most complicated (and common I would say), cases where strict mode can be helpful. I promise the rest of the stuff will be much more straightforward.

1. **Duplicate function params and object properties are not allowed**
   In "sloppy" mode if you have two or more function params or object properties with the same name, the latest one will overwrite all the previous ones. In strict mode it just errors.

    ```javascript
    function dupParams(a, b, c, d, a) {
    	console.log(`a = ${a}`) // a = 5
    }
    dupParams(1, 2, 3, 4, 5)

    const obj = {
    	a: true,
    	b: 4,
    	c: 'string',
    	a: false
    }

    console.log(obj.a) // false
    ```

1. **Object Stuff**
   Let's look at a couple of object-related cases wherein strict mode you'll get an error, while in "sloppy" nothing will happen. And by nothing, I mean it. You won't accomplish what you wanted to, but you will not know it either!

    ```javascript
    // #1
    const obj = {
    	nonWritable: 'hello',
    	name: 'Steve',
    	get greed() {
    		console.log(`Hello ${this.name}`)
    	}
    }
    Object.defineProperty(obj, 'nonWritable', { writable: false })

    obj.nonWritable = 'goodbuy'
    console.log(obj.nonWritable) // hello

    // #2
    obj.greed = 'Something else'
    obj.greed // Hello Steve

    // #3
    Object.preventExtensions(obj)
    obj.b = 'something else'
    console.log(obj.b)

    // #4
    delete Object.prototype
    ```

    Attempting any of those will throw an error in strict mode only:

    - #1 To write on a non-writable property
    - #2 To write on a get/read-only property
    - #3 To assign new properties to a non-extendable object
    - #4 To delete an undeletable property

1. **Deleting variables, functions, as well as, function arguments is not allowed**

    ```javascript
    const myVar = 'foo'
    delete myVar // errors in strict

    function myFun(a, b) {
    	delete arguments // errors in strict
    }

    delete myFun // errors in strict
    ```

1. **Using future reserved keywords as variable names**
   Using keywords as variable names is not allowed in non-strict JS, however in strict, future keywords that are coming to JavaScript are also "banned". These keywords are:

    - implements
    - interface
    - let
    - package
    - private
    - protected
    - public
    - static
    - yield

1. **eval() is a bit safer**
   In general, you should try to [avoid eval()](https://alligator.io/js/eval/) at all cost, if you have to use it though, using it in strict mode is a good idea. Here's why:

    ```javascript
    var foo = 'hello world!'
    eval('var foo = 65 + 10')
    console.log(foo) // 75 in sloppy, hello world in strict
    ```

    Strict mode doesn't allow variables inside eval() to "leak" to the surrounding scope. They are only created for the code being evaluated, and thus there's no risk in overwriting existing variables outside eval().

1. **Other weird things that are not allowed in strict**

    ```javascript
    // Octal numeric literals (numbers starting with 0 )
    const num = 034
    console.log(num + 5) // 33

    // Assingin properties to primitives
    false.name = 'something'
    'hello'.world = true

    //eval and arguments as variable names
    const eval = 21
    const arguments = 'awesome'

    // arguments.callee
    function test() {
    	console.log(arguments.callee)
    }
    test()

    // with statement
    with (Math) {
    	const result = pow(PI, 3)
    	console.log(result)
    }
    ```

    I don't know who and why would do some of this stuff, but you can't do them in strict mode anyway!

    There are a few more things that are not allowed in strict, but I think we are already scraping the bottom of the barrel. I'll list all my resources where you can read more if you like, however, I think I have covered more than you should probably need and want to know.

This was "use strict"! A pretty simple feature at its core. Most of the things that it does, you'll probably never encounter, but again, there is no reason, no to use it. Every once in awhile it will save you a whole bunch of time and frustration! And also, just knowing and keeping in mind some of the restrictions behind strict mode, avoiding global variables, for example, will make you a better programmer altogether.

So, have you been writing JS in strict? Are you planning to? Let me know if you found this post helpful, and maybe throw a few topics that you want me to write about!

Thank You!

### Sources

[MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
[W3Schools](https://www.w3schools.com/js/js_strict.asp)
[All Things Javascript](https://www.youtube.com/watch?v=luq6aflInTQ)
[Advanced Javascript](https://www.udemy.com/course/javascript-advanced/)
