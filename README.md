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

## Available Chattaaar Options

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
| __welcomeTitle__ | _string_ | ‘Welcome’ | Changes the welcome title. |
| __welcomeStrapline__ | _string_ | ‘Please add a strapline’ | Changes the text beneath the welcomeTitle. |
| __welcomeTitle__ | _string_ | ‘<i class="el-icon-envelope"></i>’ | Sets title in the top bar for the welcome page. By default, it displays an envelope icon. |
| __welcomeLogo__ | _string_ | - | Add an image URL to set the background-image property of the welcome logo. |
| __welcomeLogoWidth__ | _string_ | - | Add a width appended with ‘px’ to define the welcome logo width. |
| __welcomeLogoHeight__ | _string_ | - | Add a height appended with ‘px’ to define the welcome logo height. |
| __startBtnText__ | _string_ | ‘Start’ | Sets the text of the start button on the welcome page. |
| __nextBtnText__ | _string_ | ‘Next’ | Sets the text of every next button. |
| __sendBtnText__ | _string_ | ‘Send’ | Sets the text of the send button. |
| __skipBtnText__ | _string_ | ‘Skip’ | Sets the text of the skip button. |
| __testMode__ | _boolean_ | FALSE | Sets test mode. Will simulate sending the message when a proper form action is not specified or set up correctly. |

## Input Types

* Input
* Email // Creates an email field & validates a valid email address
* Textarea
* Select
* Checkbox
* Radio
* Country // Adds a select box with a predefined array of countries as select options
* Date // Must be used in conjunction with jQuery UI Datepicker
* Rating // Adds a star-based ratings widget
* Media // Validates URLs for YouTube & Soundcloud


## Defining Stages

### Default Stage Options

```js
stage1: {
  title: 'This is the title', // string - sets the title in the Chattaaar top bar
	type: 'input', // string - name of input type
	inputName: 'input_name', // string - sets the name of the form element. Must be unique to retrieve with your custom email sending function
	question: 'Are you?', // string - sets the question
	placeholder: 'e.g. I am', // string - sets the placeholder text of the form input.
},
stage2: { ...
```

### Other Stage Options

{
  // Use a different 'person' from your default avatar & name for the stage
	useDifferentPerson: {
		name: string - sets the new person name,
		avatar: URL - path to an avatar image for the person
	}
}

## Input-specific Options

### Defining Textareas

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

Define options for checkboxes, radio buttons and selects in an array.

```js
{
options: ['First thing', 'Second thing', 'Third thing', 'Fourth thing', 'Fifth thing', 'Sixth thing'],
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

### Defining Country Selects

There is no need to add an options array for a country select. It will generate an options array.

```js
{
	type: 'country' // That will suffice!
}
```

### Defining Date Select

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

### Defining Media Inputs

Media inputs validate pasted URLs to ensure the correct type of media is entered into the input. Only YouTube & Soundcloud validations are available at the moment.

```js
{
	type: 'media',
	accepts: ['youtube', 'soundcloud'] // Pass multiple media types into the array.
}
```

_Future development: Media input will show a preview of the media when the URL is pasted, akin to the Facebook ‘write status’ box.__

## Passing Context

Here's an example of adding context to questions, such as adding the user’s name:

```js
stage1: {
    title: 'About You',
    type: 'input',
    inputName: 'name',
    question: "What's your name?",
    placeholder: "e.g. John"
  },
  stage2: {
    question: "Right, let's get going <span class='ch-name'></span>. What are your first impressions of Chattaaar?",
    ...
  },
…
```

Context can only be used in questions in stages AFTER the context is set. Context can be saved and used for inputs, textareas and select boxes.