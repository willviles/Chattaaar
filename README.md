#  Chattaaar

Chattaaar is a multi-page form generator designed to create kick-ass, humanised forms. Inspired by iOS Messages, each question solicits information from the user by treating the process as a conversation, keeping them engaged and moving through your form.

## Getting Started

### 1 - Include Chattaaar after jQuery

```html
<script src="vendor/jquery.min.js"></script>
<script src="vendor/chattaaar.min.js"></script>
```

### 2 - Add the form to your page

```html
<form class="chattaaar-container"></form>
```

### 3 - Define stages
An example dictionary of stages:

```js
var myStages = {
  stage1: {
    title: 'About You',
    type: 'input',
    inputName: 'name',
    question: "What's your name?",
    placeholder: "e.g. Joe Bloggs"
  },
  stage2: {
    title: 'First Impressions',
    type: 'radio',
    inputName: 'first_impressions',
    question: "Right, let's get going <span class='ch-name'></span>. What are your first impressions of Chattaaar?",
    options: ['Wowza!', "Pretty swish", 'Okay', 'Could be better', "I don't like it"]
  },
  stage3: {
    title: 'Rate the Rating',
    type: 'rating',
    inputName: 'rating',
    question: "Thanks for being honest. Next up, rate the aesthetic of this ratings widget.",
    skippable: true
  },...
}
```

### 4 - Create a server side mail function

Here's a very simple php mail function.

```php
<?php
$name = $_POST['name'];
$email = $_POST['email'];
...

$to = "your@address.com";
$subject = "Message from $name";
$body = "Name: $name \n\n Message: \n $message...";
$from = $email;
$headers = "From:" . $from;
mail($to,$subject,$body,$headers);
echo "sent";
?>
```

### 5 - Define form options
An example dictionary of options:

```js
var myOptions = {
  formName: 'formName',
  formAction: 'path/to/my-server-side-mail-action.php',
  theme: 'formTheme',
  welcomeText: "What do you think of Chattaaar?",
  welcomeStrapline: "Have a play and submit your thoughts.",
  welcomeImage: '/img/chattaaar-logo.png',
  welcomeImageHeight: '48px',
  welcomeImageWidth: '150px',
  yourName: 'Will',
  yourAvatar: '/img/myavatar.png'
}
```

### 6 - Init Chattaaar
```js
$(document).ready(function() {
  $('.chattaaar-container').newChattaaar(
    options = myOptions,
    stages = myStages
  );
});
```

* * *

## Options

| Option | Type | Default | Description |
|-------------------|---------|------------------------------------|------------------------------------------------------------------------------------------------------------------------|
| __formName__ | _string_ | ‘form-[RAND]’ | Sets the <form> tag’s name attribute. |
| __formAction__ | _string_ | - | Sets the <form> tag’s action attribute. |
| __theme__ | _string_ | - | Adds a CSS class to the <form> tag setting theme styles. |
| __modal__ | _boolean_ | FALSE | Setting modal to true will activate modal mode. |
| __modalOpenBtn__ | _string_ | ‘.chattaaar-open’ | Set the modal opening class. |
| __modalContainer__ | _string_ | ‘.chattaaar-modal’ | Sets the modal container class. |
| __modalFullScreen__ | _boolean_ | FALSE | Setting modalFullScreen to true will expand the modal into fullscreen mode, so that none of the page beneath is shown. |
| __yourName__ | _string_ | ‘Us’ | Changes the name beneath your avatar. |
| __yourAvatar__ | _string_ | - | Add a URL to an image to set the background-image property of your avatar. |
| __theirName__ | _string_ | ‘You’ | Changes the name beneath their avatar. |
| __theirAvatar__ | _string_ | - | Add an image URL to set the background-image property of their avatar. |
| __welcomeText__ | _string_ | ‘Welcome’ | Changes the welcome text. |
| __welcomeStrapline__ | _string_ | ‘Click to begin’ | Changes the text beneath the welcomeTitle. |
| __welcomeTitle__ | _string_ | ‘<i class="el-icon-envelope"></i>’ | Sets title in the top bar for the welcome page. By default, it displays an envelope icon. |
| __welcomeLogo__ | _string_ | - | Add an image URL to set the background-image property of the welcome logo. |
| __welcomeLogoWidth__ | _string_ | - | Add a width appended with ‘px’ to define the welcome logo width. |
| __welcomeLogoHeight__ | _string_ | - | Add a height appended with ‘px’ to define the welcome logo height. |
| __startBtnText__ | _string_ | ‘Start’ | Sets the text of the start button on the welcome page. |
| __nextBtnText__ | _string_ | ‘Next’ | Sets the text of every next button. |
| __sendBtnText__ | _string_ | ‘Send’ | Sets the text of the send button. |
| __skipBtnText__ | _string_ | ‘Skip’ | Sets the text of the skip button. |
| __testMode__ | _boolean_ | FALSE | Sets test mode. Will simulate sending the message when a proper form action is not specified or set up correctly. |

* * *

## Stages

### Default Stage Options

```js
stage1: {
  title: 'This is the title', // string - sets the title in the Chattaaar top bar
	type: 'input', // string - name of input type
	inputName: 'input_name', // string - sets the name of the form element. Must be unique to retrieve with your custom email sending function
	question: 'Foo?', // string - sets the question
	placeholder: 'e.g. Bar', // string - sets the placeholder text of the form input.
	skippable: false // boolean - removes validation and allows user to skip section
},
stage2: { ...
```

### Overview of stage types

* Input - _Generates a standard form input_
* Email - _Generates an email input field & validates for a valid email address_
* Textarea - _Generates a textarea_
* Select - _Generates a select box with options_
* Checkbox - _Generates checkboxes with options_
* Radio - _Generates radio buttons with options_
* Country - Generates a select box with a predefined array of countries as select options_
* Date - _Generates a date input. Must be used in conjunction with jQuery UI Datepicker_
* Rating - _Generates a star ratings widget_
* Media - _Generates an input field & validates URLs from popular media content sites_

### Inputs

```js
{
	type: 'input'
}
```

### Textareas

```js
{
	type: 'textarea'
}
```

Word and character limits can be set for textareas. Just pass an integer to one of the two parameters.

```js
{
	wordlimit: 500
	// OR
	charlimit: 140
	// Should NOT be defined together.
}
```

### Defining Checkboxes, Radio Buttons & Selects

```js
{
  // Checkboxes
	type: 'checkbox'
	// OR Radio Buttons
	type: 'radio'
	// OR Select
	type: 'select'
}
```

Define options for checkboxes, radio buttons and selects in an array.

```js
{
options: ['First thing', 'Second thing', 'Third thing'],
...
}
```

_Idea: For longer arrays, move the array out into a function._

```js
function longArray() {
	return ['First thing', 'Second thing', 'Third thing', 'Fourth thing', 'Fifth thing', 'Sixth thing'];
}

// Then you can do...

{
options: longArray(),
...
}
```

### Scale

The __scale__ input type adds 5 checkboxes with custom 'low' and 'high' labels.

```js
{
  type: 'scale',
  placeholders: {
    low: 'Very Dissatisfied',
    hight: 'Very Satisfied'
  }
}
```

### Country

Instead of adding a long options array of countries to create a country select, simply use the __country__ input type. There is no need to pass an options array.

```js
{
	type: 'country' //
}
```

### Full Name
Instead of creating two input fields for 'first-name' and 'last-name', the __fullName__ input type can be used to capture the respondent's full name naturally by placing two input boxes next to one another.

```js
{
	type: 'fullName',
	// Instead of accepting a 'placeholder' value, fullName accepts placeholders like this:
	placeholders: {
    firstName: 'First Name',
    lastName: 'Last Name'
  },
  // And instead of accepting an 'inputName' value, accepts input names like this:
  inputNames: {
    firstName: 'foo', // Default: 'first-name'
    lastName: 'bar' // Default: 'last-name'
  }
}
```

### Date

Ensure jQuery UI Datepicker is included before Chattaaar, but after jQuery.

```js
<script src="../bower_components/jquery/dist/jquery.min.js"></script>
<script src="../plugin/vendor/jquery-ui/datepicker-custom.min.js"></script>
<script src="../prod/chattaaar-min.js"></script>
```

jQuery UI datepicker settings can be added in an object called 'datepicker'. For example:

```js
{
	type: 'date',
	datepicker: {
    minDate: -20, maxDate: "+1M +10D"
    // Sets the minimum date to 20 days before today and max date to 1 month and 10 days ahead of today.
    // For full jQuery UI datepicker options, visit: http://jqueryui.com/datepicker/
	}
}
```

### Media

Media inputs validate pasted URLs to ensure the correct type of media is entered into the input. Only YouTube & Soundcloud validations are available at the moment.

```js
{
	type: 'media',
	accepts: ['youtube', 'soundcloud'] // Pass multiple media types into the array.
}
```

_Future development: Media input will show a preview of the media when the URL is pasted, akin to the Facebook ‘write status’ box._

* * *

## Passing Context

Here's an example of adding context to questions:

```js
stage1: {
    title: 'About Foo',
    type: 'input',
    inputName: 'foo',
    question: "Foo?"
  },
  stage2: {
    question: "Your response to foo: <span class='ch-foo'></span>. What about bar?",
    ...
  },
…
```

Context can only be used in questions in stages AFTER the context is set. Context can be saved and used for inputs, textareas and select boxes.

* * *

## Other Stage Options

### Change your avatar mid-form

A short method to use a different 'person' from your default avatar & name for the defined stage.

```js
{
	useDifferentPerson: {
		name: '', // string - sets the new person's name,
		avatar: ''// url - path to an avatar image for the person
	}
}
```

* * *

## Multiple Chattaaars

It's really simple to add multiple instances of Chattaaar to a page.

### Add unique classes to form markup

```html
<form class="chattaaar-container form-one"></form>
<form class="chattaaar-container form-two"></form>
```

### Init on the unique classes

```js
$('.form-one').newChattaaar(...);
$('.form-two').newChattaaar(...);
```

* * *

## Feedback

Please use the [issues](http://github.com/willviles/chattaaar/issues "Chattaaar Issues") for any bugs, feature requests, etc.