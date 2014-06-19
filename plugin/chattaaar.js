(function ($) {

  $.fn.newChattaaar = function(options, stages) {

    this.options = $.extend({
      // Defaults
      formName: 'form-' + (1 + Math.floor(Math.random() * 1000)),
      yourName: 'Us',
      theirName: 'You',
      // Welcome page defaults
      welcomeTitle: '<i class="el-icon-envelope"></i>',
      welcomeText: 'Welcome',
      welcomeStrapline: 'Please add a strapline',
      // Button text defaults
      startBtnText: 'Start',
      nextBtnText: 'Next',
      sendBtnText: 'Send',
      skipBtnText: 'Skip',
      // Modal defaults
      modal: false,
      modalOpenBtn: '.chattaaar-open',
      modalContainer: '.chattaaar-modal',
      modalFullScreen: false,
      // Test Mode default
      testMode: false
    }, options);

    options = this.options;

    // Set container as a variable for efficiency
    var ch = this;
    var container = $(ch);

    // Add form name & action
    container.attr({
      name: options.formName,
      action: options.formAction
    });

    // Add theme
    if (typeof options.theme !== 'undefined') {
      container.addClass(options.theme);
    }

    // SCAFFOLD

    function appendScaffold() {
      var titlearea = '<div class="ch-title"><span>' + options.welcomeTitle + '</span></div>',
          counter = '<div class="ch-counter"><span>-</span></div>',
          closeBtn = '',
          topbar = '',
          theme = '',
          modalContainerParsed = '';

      if (options.modal) {
        closeBtn = '<div class="ch-close"><i class="el-icon-remove"></i></div>';
      }
      topbar = '<div class="chattaaar-topbar">' + titlearea + counter +  closeBtn  + ' </div>';

      container.append(topbar);

      // Wrap everything a modal if it exists
      if (options.modal) {
        modalContainerParsed = options.modalContainer;
        modalContainerParsed = modalContainerParsed.replace(/\./g, "");
        if (typeof options.theme !== 'undefined') { theme = ' ' + options.theme;  }
        container.wrap('<div class="chattaaar-modal ' + modalContainerParsed + theme + '"></div>');
      }
    }

    appendScaffold();

    // STORE SETUP: Field values get passed here so they can be used in context.
    this.store = {};

    // STAGES SETUP
    this.stage = 1;
    this.stages = stages;
    this.stagesLength = Object.keys(ch.stages).length;

    // WELCOME SETUP
    function appendWelcome() {
      var image = '';
      if (typeof options.welcomeImage !== 'undefined') {
        image = '<div style="background-image: url(' + options.welcomeImage + '); height: ' + options.welcomeImageHeight + '; width: ' + options.welcomeImageWidth + '; background-size: ' + options.welcomeImageWidth + ' ' + options.welcomeImageHeight + ';" class="welcome-image"></div>';
      }
      container.append(' \
        <section class="welcome active"> \
          <div class="section-padding"> \
            ' + image + ' \
            <h2>' + options.welcomeText + '</h2> \
            <p>' + options.welcomeStrapline + '</p> \
            <div class="ch-next validated"><h4>' + options.startBtnText + '</h4></div> \
          </div> \
        </section>'
      );
    }
    appendWelcome();

    // SET UP EACH INDIVIDUAL STAGE
    for (var i = 1; i < (ch.stagesLength + 1); i++) {
      // Get a handle on the stageObj
      var stageObj = ch.stages['stage' + i];
      // Append the appropriate HTML
      if (stageObj.type === 'input') {
        appendInput('text');
      } else if (stageObj.type === 'email') {
        appendInput('email');
      } else if (stageObj.type === 'textarea') {
        appendTextarea();
      } else if (stageObj.type === 'select') {
        appendSelect();
      } else if (stageObj.type === 'checkbox' || stageObj.type === 'radio') {
        appendCheckboxOrRadio();
      } else if (stageObj.type === 'date') {
        appendInput('date');
      } else if (stageObj.type === 'rating') {
        appendRating();
      } else if (stageObj.type === 'media') {
        appendInput('media');
      } else {
        appendError();
      }
      ch.store[stageObj.inputName] = '';
    }

    // APPEND 'SEND' OVERLAY
    container.append('<div class="ch-sending"><h2 class="alert-text"><i class="el-icon-envelope"></i> Sending...</h2></div>');

    // Initialise all links
    initBtns();

    // STAGE SCAFFOLD

    function stageScaffold(content) {
      var buttonText, buttonHTML;

      // Set button text
      if (i === (ch.stagesLength)) {
        buttonText = options.sendBtnText;
      } else {
        if (stageObj.skippable === true) {
          buttonText = options.skipBtnText;
        } else {
          buttonText = options.nextBtnText;
        }
      }

      // Set if skippable
      if (stageObj.skippable === true) {
        buttonHTML = '<button type="button" class="ch-next skip validated">' + buttonText + '</button>';
      } else {
        buttonHTML = '<button type="button" class="ch-next">' + buttonText + '</button>';
      }

      // If Avatar
      var defaultAvatarIcon = '<div class="default-icon"><i class="el-icon-child"></i></div>',
          yourAvatar = '',
          yourDefaultAvatar = defaultAvatarIcon,
          theirAvatar = '',
          theirDefaultAvatar = defaultAvatarIcon;

      if (typeof options.yourAvatar !== 'undefined') {
        yourDefaultAvatar = '';
        yourAvatar = options.yourAvatar;
      }

      if (typeof options.theirAvatar !== 'undefined') {
        theirDefaultAvatar = '';
        theirAvatar = options.theirAvatar;
      }


      // Bring together the scaffold HTML
      var scaffoldHTML =
        '<section> \
          <div class="section-padding"> \
            <div class="question-container"> \
              <div class="person-icon" style="background-image: url(' + options.yourAvatar + ');"> \
                ' + yourDefaultAvatar + ' \
                <span class="name"><small>' + options.yourName + '</small></span> \
              </div> \
              <p> \
                <span>' + stageObj.question + '</span> \
              </p> \
            </div> \
            <div class="action-container"> \
              <div class="person-icon" style="background-image: url(' + options.theirAvatar + ');"> \
                ' + theirDefaultAvatar + ' \
                <span class="name"><small>' + options.theirName + '</small></span> \
              </div> \
              <div class="action-wrapper">' + content +  '</div> \
              <div class="ch-btns-container"> \
                ' + buttonHTML + ' \
                <button type="button" class="ch-prev"><small><i class="el-icon-caret-up"></i></small> Prev</button> \
              </div> \
            </div> \
          </div> \
        </section>';
      return scaffoldHTML;
    }

    function appendInput(type) {
      var classes, dataAttrs = '', dataAttrName, dataAttrContent;
      // If type is media, do media things with it
      if (type === 'media') {
        var acceptsArray = stageObj.accepts;
        console.log(acceptsArray);
        $.each(acceptsArray, function(i, accepted) { dataAttrs = dataAttrs + ' data-' + accepted + '="true"';});
        type = 'text'; classes = 'ch-media';
      }
      if (type === 'date') {
        type = 'text';
        classes = 'ch-datepicker';
      }
      var input = '<input type="' + type + '" name="' + stageObj.inputName + '" placeholder="' + stageObj.placeholder + '" class="' + classes + '" autocomplete="off"' + dataAttrs + '>';
      container.append(stageScaffold(input));
    }

    function appendTextarea() {
      var textarea = '<textarea name="' + stageObj.inputName + '" placeholder="' + stageObj.placeholder + '"></textarea>';
      container.append(stageScaffold(textarea));
    }

    function appendSelect() {
      var optionsItems = '';
      $.each(stageObj.options, function(i, optionItem) {
        var optionHTML = '<option>' + optionItem + '</option>';
        // Add it to list of options.
        optionsItems = optionsItems + optionHTML;
      });
      // Bring together the select HTML
      var select = ' \
        <select type="text" name="' + stageObj.inputName + '" placeholder="' + stageObj.placeholder + '"> \
          <option value="" disabled selected>' + stageObj.placeholder + '</option> \
          ' + optionsItems + ' \
        </select>';
      container.append(stageScaffold(select));
    }

    function appendCheckboxOrRadio() {
      var checkboxes = '';
      $.each(stageObj.options, function(i, checkbox){
        var checkboxHTML = ' \
          <label class="checkbox-radio"> \
            <input type="' + stageObj.type + '" name="' + stageObj.inputName + '" value="' + checkbox + '"/> \
            <span> \
              <i class="el-icon-check-empty"></i> \
              <i class="el-icon-edit"></i> \
              <i class="el-icon-check"></i> \
              ' + checkbox + ' \
            </span> \
          </label>';
        // Add it to list of options.
        checkboxes = checkboxes + checkboxHTML;
      });
      checkboxes = '<div class="checkbox-group">' + checkboxes + '</div>';
      container.append(stageScaffold(checkboxes));
    }

    function appendRating() {
      var ratingInput = '<input type="hidden" name="' + stageObj.inputName + '">';
      var star = '<li><i class="star el-icon-star"></i></li>';
      var starCount = '<span class="star-count"></span>';
      var rating = '<ul class="rating rating-' + stageObj.inputName + '">' + star + star + star + star + star + starCount + ratingInput + '</ul>';
      container.append(stageScaffold(rating));
    }

    function appendError() {
      console.log("Error: Stage #" + i + " has no valid 'type' set.");
    }

    // RATING WIDGET

    function resetRatings() {
      // Get all ratings
      var ratings = container.find('.rating');
      //Remove valueSelected parameters
      ratings.removeClass('valueSelected');
      // Remove all classes from list items
      ratings.find('li').removeClass();
      // Remove the text representation of any rating selections
      ratings.find('span').html('');
    }

    function chRating() {
      var stageContainer = container.find('section:nth-of-type(' + ch.stage + ')'),
          ratingContainer = stageContainer.find('.rating'),
          stars = ratingContainer.find('li'),
          nextBtn = stageContainer.find('.ch-next');
      // Star hover actions
      stars.unbind('mouseenter mouseleave').bind('mouseenter', function() {
        if (!ratingContainer.hasClass('valueSelected')) {
          ratingContainer.find('li').removeClass('hover');
          var starHovered = $(this).index();
          for (var s = 1; s <= (starHovered + 1); s++) {
            ratingContainer.find('li:nth-child(' + s + ')').addClass('hover');
          }
        }
      });
      // Remove hover actions when mouse leaves the rating container
      ratingContainer.unbind('mouseenter mouseleave').bind('mouseleave', function() {
        ratingContainer.find('li').removeClass('hover');
      });
      // Star click actions
      stars.on('click', function() {
        ratingContainer.find('li').removeClass('selected');
        ratingContainer.addClass('valueSelected');
        // Highlight selected stars
        var starSelected = $(this).index() + 1;
        for (var s = 1; s <= starSelected; s++) {
          ratingContainer.find('li:nth-child(' + s + ')').addClass('selected');
        }
        var ratingInput = ratingContainer.find('input');
        var ratingInputName = ratingInput.attr('name');
        ratingInput.val(starSelected);
        nextBtn.addClass('validated').focus();
        var ratingStarCount = ratingContainer.find('span');
        ratingStarCount.html(starSelected + '/5');
        // Update the store
        ch.store[ratingInputName] = starSelected;
        $('span.ch-' + ratingInputName).html(starSelected);
      });
    }

    // VERTICALLY ALIGN SECTIONS
    function dynamicVerticalAlign(elements) {
      function setVerticalPos(element) {
        var elHeight = element.height();
        element.css({'margin-top': '-' + (elHeight/2) + 'px'});
      }
      $(elements).each(function() {
        setVerticalPos($(this));
      });
      $(window).resize(function(){
         $(elements).each(function() {
           setVerticalPos($(this));
         });
      });
    }
    var sectionPaddings = container.find('.section-padding');
    dynamicVerticalAlign(sectionPaddings);

    // VALIDATIONS
    function validateStage() {
      var stageContainer = container.find('section:nth-of-type(' + ch.stage + ')'),
          inputs = stageContainer.find('input, textarea'),
          selects = stageContainer.find('select'),
          checkboxes = stageContainer.find('.checkbox-group'),
          ratings = stageContainer.find('.rating'),
          dates = stageContainer.find('.ch-datepicker'),
          nextBtn = stageContainer.find('.ch-next');

      function makeValid() {
        if (nextBtn.hasClass('skip')) {
          nextBtn.html('Next');
        } else {
          nextBtn.addClass('validated');
        }
      }

      function makeInvalid() {
        if (nextBtn.hasClass('skip')) {
          nextBtn.html('Skip');
        } else {
          nextBtn.removeClass('validated');
        }
      }

      function validateDate(value) {
        var dateRegEx = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (dateRegEx.test(value)) {
          makeValid();
        } else {
          makeInvalid();
        }
      }

      inputs.keyup(function() {
        var input = $(this);
        var inputName = input.attr('name');
        var inputVal = input.val();
        var emptyFields = inputs.filter(function() {
          return $.trim(this.value) === "";
        });

        if (!emptyFields.length) {
          // Validate Email
          if (input.attr('type') === 'email') {
            var emailRegEx = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
            if (emailRegEx.test(inputVal)) {
              makeValid();
            } else {
              makeInvalid();
            }
          // Validate media
          } else if (input.hasClass('ch-datepicker')) {
             validateDate(inputVal);
          } else if (input.hasClass('ch-media')) {
            if (input.is("[data-youtube]") || input.is("[data-soundcloud]")) {
              var youtubeRegEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
              var soundcloudRegEx = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
              if (youtubeRegEx.test(inputVal) || soundcloudRegEx.test(inputVal)) {
                makeValid();
              } else {
                makeInvalid();
              }
            }
          // Just validate presence
          } else {
            makeValid();
          }
        // If nothing valid, ensure it's invalid
        } else {
          makeInvalid();
        }

        // Push value of input to store
        ch.store[inputName] = inputVal;
        $('span.ch-' + inputName).html(inputVal);

      });

      // Validate select
      selects.each(function() {
        $(this).change(function() {
          makeValid();
        });
      });

      // Validate checkboxes
      checkboxes.on('click', function() {
        var checkedInputs = $(this).find('input:checked');
        if (checkedInputs.length > 0) {
          makeValid();
        } else {
          makeInvalid();
        }
      });

      // If ratings exist, run rating widget
      if (ratings.length > 0) {
        chRating();
      }

      // If datepicker exists, run datepicker
      if (dates.length > 0) {
        var datepickerOptions = ch.stages['stage' + (ch.stage - 1)].datepicker;
        dates.datepicker(datepickerOptions);
        console.log(dates);
        dates.on('change paste', function() {
          validateDate($(this).val());
        });
      }
    }

    function changeTitle() {
      var titleContainer = container.find('.ch-title span');
      var counterContainer = container.find('.ch-counter span');
      if (ch.stage === 1) {
        titleContainer.html(options.welcomeTitle);
        counterContainer.html('-');
      } else {
        titleContainer.html(ch.stages['stage' + (ch.stage - 1)].title);
        counterContainer.html((ch.stage - 1) + '/' + ch.stagesLength);
      }
    }

    // FOCUS

    var keydownEnabled = true;

    function orderFocus() {
      var stageContainer = container.find('section:nth-of-type(' + ch.stage + ')');

      // Get a handle on the types of input
      var input = stageContainer.find('input');
      var textarea = stageContainer.find('textarea');
      var select = stageContainer.find('select');

      // Find the next button
      var nextBtn = stageContainer.find('.ch-next');

      // if it's a textarea or select box, set that.
      if (textarea.length > 0) {
        input = textarea;
      } else if (select.length > 0) {
        input = select;
      }

      // If it's an input we can add focus to...
      if (input.length > 0 || textarea.length > 0 || select.length > 0) {

        // Set the input as focussed
        input.focus();

        input.unbind('keydown').bind('keydown', function(e) {
          if (keydownEnabled === false) {
            e.preventDefault();
          }

          if (e.keyCode === 9) {
            e.preventDefault();
            if (nextBtn.hasClass('validated')) {
              nextBtn.focus();
            }
          } else if (e.keyCode === 13 && keydownEnabled === true) {
            e.preventDefault();
            nextStage.call(nextBtn);
            input.blur();
            nextBtn.blur();
            disableKeydown();
          }

        });

        // Move focus back from next button to input
        nextBtn.bind('keydown', function(e) {
          if (e.which === 9) {
            e.preventDefault();
            input.focus();
          }
        });

      // But if it isn't an input with which you can interact, just set the focus to the nextBtn
      } else {
        // Add focus to the next button instead
        nextBtn.focus();
        nextBtn.unbind('keydown').bind('keydown', function(e){
          if (keydownEnabled === false) {
            e.preventDefault();
          }
          if (e.keyCode === 13 && keydownEnabled) {
            e.preventDefault();
            nextStage.call(nextBtn);
            nextBtn.blur();
            disableKeydown();
          }

        });
      }

      // Prevent skipping through validations with button presses.
      function disableKeydown() {
        keydownEnabled = false;
        setTimeout(function() {
          keydownEnabled = true;
        }, 1000);
      }

      // Ensure focus passes to nextBtn when a checkbox or radio button is selected
      stageContainer.find('.checkbox-radio').on('click', function() {
        nextBtn.focus();
      });

    }

    // SEND FORM

    function sendForm() {

      var sendingContainer = container.find('.ch-sending');

      var sending = function(successFunction) {
        sendingContainer.addClass('show');
        if (options.testMode) {
          setTimeout(function() {
            successFunction();
          }, 2000);
        }
      };

      var success = function() {
        var successText;
        if (options.testMode) {
          successText = 'Sent <i>(in test mode)</i>';
        } else {
          successText = 'Sent';
        }
        sendingContainer.find('h2').html('<i class="el-icon-check"></i> ' + successText);
        setTimeout(function() {
          if (options.modal) {
            $(options.modalContainer).removeClass('open').addClass('close');
            setTimeout(function() {
              $(options.modalContainer).removeClass('close');
              resetForm();
            }, 400);
          } else {
            resetForm();
          }
        }, 2000);
      };

      // If in test mode
      if (options.testMode) {
        sending(function() {
          success();
        });

      // If NOT in test mode
      } else {
        sending();
        $.post($('form[name=' + options.formName + ']').attr('action'), $('form[name=' + options.formName + ']').serialize(), function(res){
          if (res === 'sent') {
            success();
          } else {
            sendingContainer.removeClass('show');
            setTimeout(function() {
              alert('Form sending timed out');
            }, 30000);
          }
        });
        return false; // prevent default action
      }
    }

    // NEXT

    function nextStage() {
      if (this.hasClass('validated')) {
        if (ch.stage === (ch.stagesLength + 1)) {
          sendForm();
        } else {
          container.find('section:nth-of-type(' + ch.stage + ')').removeClass('active').addClass('after');
          container.find('section:nth-of-type(' + (ch.stage + 1) + ')').addClass('active');
          ch.stage++;
          // Change title
          changeTitle();
          // Order Focus
          // Ps. Can't call focus straight away otherwise it messes up CSS animations!!!
          setTimeout(function() {
            orderFocus();
          }, 500);
          // fire validations
          validateStage();
        }
      }
    }

    // PREV

    function previousStage() {
      container.find('section:nth-of-type(' + ch.stage + ')').removeClass('active');
      container.find('section:nth-of-type(' + (ch.stage - 1) + ')').removeClass('after').addClass('active');
      ch.stage--;
      // Change title
      changeTitle();
      // Order Focus
      // Ps. Can't call focus straight away otherwise it messes up CSS animations!!!
      setTimeout(function() {
        orderFocus();
      }, 500);
      // fire validations
      validateStage();
    }

    // BUTTONS

    function initBtns() {
      container.find('.ch-next').on('click', function(e) {
        e.preventDefault();
        nextStage.call($(this));
      });
      container.find('.ch-prev').on('click', function(e) {
        e.preventDefault();
        previousStage.call($(this));
      });
    }

    // RESET

    function resetForm() {
      $('form[name=' + options.formName + ']')[0].reset();
      // Set all next buttons to invalid unless they're skip buttons
      container.find('.ch-next').each(function() {
        if ($(this).hasClass('skip')) {
          $(this).html('Skip');
        } else {
          $(this).removeClass('validated');
        }
      });
      // Reset all sections
      container.find('section').removeClass('after active');
      // Ensure sending container isn't visible
      container.find('.ch-sending').removeClass('show');
      // Setup welcome page
      container.find('section:nth-of-type(1)').addClass('active');
      container.find('section:nth-of-type(1) .ch-next').addClass('validated');
      // Reset any ratings
      resetRatings();
      // Reset stage counter
      ch.stage = 1;
      // Reset titles
      changeTitle();
    }

    // MODAL

    function initModal() {
      // Make modal fullscreen
      if (options.modalFullScreen === true) {
        container.addClass('fullscreen');
      }
      // Open Modal
      $(options.modalOpenBtn).on('click', function() {
        $(options.modalContainer).addClass('open');
      });
      // Close Modal
      container.find('.ch-close').on('click', function() {
        $(options.modalContainer).removeClass('open').addClass('close');
        setTimeout(function() {
          $(options.modalContainer).removeClass('close');
          resetForm();
        }, 400);
      });
    }

    // Init if modal is required
    if (options.modal) {
      initModal();
    }

    // Responsive
    function condenseGUI() {
      var condenseContainer;

      if (options.modal) {
        condenseContainer = $(options.modalContainer);
      } else {
        condenseContainer = container;
      }

      if (condenseContainer.width() <= 700) {
        container.addClass('condensed');
      } else {
        container.removeClass('condensed');
      }
    }
    condenseGUI();
    // Handle GUI style on window resize
    $(window).resize(function() {
      condenseGUI();
    });

  };

}(jQuery));