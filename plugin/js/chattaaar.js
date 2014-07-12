(function( $, window, document, undefined ){

  // our plugin constructor
  var Chattaaar = function( elem, options, stages ){
      this.elem = elem;
      this.$elem = $(elem);
      this.options = options;
      this.stages = stages;
      this.store = {};
    };

  // the plugin prototype
  Chattaaar.prototype = {
    // Initialize
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    init: function() {

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

      this.setup.main.call(this);
      this.scaffold.main.call(this);
      this.scaffold.welcome.call(this);
      this.setup.stages.call(this);
      this.links.init.call(this);
      this.utilities.init.call(this);

      if (!this.options.modal === false) {
        this.utilities.initModal.call(this);
      }
      return this;
    },

    // Setup
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    setup: {

      // Main Setup
      ///////////////////////////////////////////////////////

      main: function() {
        // Add form name & action
        this.$elem.attr({
          name: options.formName,
          action: options.formAction
        });

        // Add theme
        if (typeof options.theme !== 'undefined') {
          this.$elem.addClass(this.options.theme);
        }
      },

      // Stages Setup
      ///////////////////////////////////////////////////////

      stages: function() {
        this.stage = 1;
        this.stages = stages;
        this.stagesLength = Object.keys(this.stages).length;
        this.sss = 0;

        // SET UP EACH INDIVIDUAL STAGE
        // sss is stage setup stage
        for (this.sss = 1; this.sss < (this.stagesLength + 1); this.sss++) {
          // Get a handle on the stageObj
          var stageObj = this.stages['stage' + this.sss];
          // Append the appropriate HTML
          if (stageObj.type === 'input') {
            this.append.input.call(this, stageObj, stageObj.type);
          } else if (stageObj.type === 'email') {
            this.append.input.call(this, stageObj, stageObj.type);
          } else if (stageObj.type === 'textarea') {
            this.append.textarea.call(this, stageObj);
          } else if (stageObj.type === 'select') {
            this.append.select.call(this, stageObj);
          } else if (stageObj.type === 'country') {
            this.append.select.call(this, stageObj, 'country');
          } else if (stageObj.type === 'checkbox' || stageObj.type === 'radio') {
            this.append.checkboxradio.call(this, stageObj);
          } else if (stageObj.type === 'date') {
            this.append.input.call(this, stageObj, stageObj.type);
          } else if (stageObj.type === 'rating') {
            this.append.rating.call(this, stageObj);
          } else if (stageObj.type === 'media') {
            this.append.input.call(this, stageObj, stageObj.type);
          } else {
            console.log("Error: Stage #" + this.sss + " has no valid 'type' set.");
          }
          // Add empty store variable
          this.store[stageObj.inputName] = '';
        }

        // Append Send overlay
        this.$elem.append('<div class="ch-sending"><h2 class="alert-text"><i class="el-icon-envelope"></i> Sending...</h2></div>');
      },

      // Focus Setup
      ///////////////////////////////////////////////////////

      focus: function() {
        var keydownEnabled = true;
        var stageContainer = this.$elem.find('section:nth-of-type(' + this.stage + ')');
        var that = this;

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
              that.links.nextStage.call(that, nextBtn);
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
              that.links.nextStage.call(that, nextBtn);
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
    },

    // Scaffold
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    scaffold: {

      // Main Scaffold
      ///////////////////////////////////////////////////////

      main: function() {
        var titlearea = '<div class="ch-title"><span>' + options.welcomeTitle + '</span></div>',
            counter = '<div class="ch-counter"><span>-</span></div>',
            closeBtn = '',
            topbar = '',
            theme = '',
            modalContainerParsed = '';

        if (this.options.modal) {
          closeBtn = '<div class="ch-close"><i class="el-icon-remove"></i></div>';
        }
        topbar = '<div class="chattaaar-topbar">' + titlearea + counter +  closeBtn  + ' </div>';

        this.$elem.append(topbar);

        // Wrap everything a modal if it exists
        if (this.options.modal) {
          modalContainerParsed = this.options.modalContainer;
          modalContainerParsed = modalContainerParsed.replace(/\./g, "");
          if (typeof this.options.theme !== 'undefined') { theme = ' ' + options.theme;  }
          this.$elem.wrap('<div class="chattaaar-modal ' + modalContainerParsed + theme + '"></div>');
        }
      },

      // Stage Scaffold
      ///////////////////////////////////////////////////////

      stage: function(content, stageObj) {
        var buttonText, buttonHTML;
        this.stagesLength = Object.keys(this.stages).length;
        // Set button text
        if (this.sss === (this.stagesLength)) {
          buttonText = this.options.sendBtnText;
        } else {
          if (stageObj.skippable === true) {
            buttonText = this.options.skipBtnText;
          } else {
            buttonText = this.options.nextBtnText;
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

        if (typeof stageObj.useDifferentPerson !== 'undefined') {
          if (typeof stageObj.useDifferentPerson.avatar !== 'undefined') {
            yourDefaultAvatar = '';
            yourAvatar = stageObj.useDifferentPerson.avatar;
          }
        } else {
          if (typeof this.options.yourAvatar !== 'undefined') {
            yourDefaultAvatar = '';
            yourAvatar = this.options.yourAvatar;
          }
        }

        if (typeof this.options.theirAvatar !== 'undefined') {
          theirDefaultAvatar = '';
          theirAvatar = this.options.theirAvatar;
        }

        // If Name Change

        var yourName;

        if (typeof stageObj.useDifferentPerson !== 'undefined') {
          if (typeof stageObj.useDifferentPerson.name !== 'undefined') { yourName = stageObj.useDifferentPerson.name; }
        } else {
          yourName = this.options.yourName;
        }


        // Bring together the scaffold HTML
        var scaffoldHTML =
          '<section> \
            <div class="section-padding"> \
              <div class="question-container"> \
                <div class="person-icon" style="background-image: url(' + yourAvatar + ');"> \
                  ' + yourDefaultAvatar + ' \
                  <span class="name"><small>' + yourName + '</small></span> \
                </div> \
                <p> \
                  <span>' + stageObj.question + '</span> \
                </p> \
              </div> \
              <div class="action-container"> \
                <div class="person-icon" style="background-image: url(' + this.options.theirAvatar + ');"> \
                  ' + theirDefaultAvatar + ' \
                  <span class="name"><small>' + this.options.theirName + '</small></span> \
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
      },

      // Welcome Scaffold
      ///////////////////////////////////////////////////////

      welcome: function() {
        var image = '';

        if (typeof this.options.welcomeImage !== 'undefined') {
          image = '<div style="background-image: url(' + this.options.welcomeImage + '); height: ' + this.options.welcomeImageHeight + '; width: ' + this.options.welcomeImageWidth + '; background-size: ' + this.options.welcomeImageWidth + ' ' + this.options.welcomeImageHeight + ';" class="welcome-image"></div>';
        }

        this.$elem.append(' \
          <section class="welcome active"> \
            <div class="section-padding"> \
              ' + image + ' \
              <h2>' + this.options.welcomeText + '</h2> \
              <p>' + this.options.welcomeStrapline + '</p> \
              <div class="ch-next validated"><h4>' + this.options.startBtnText + '</h4></div> \
            </div> \
          </section>'
        );
      }
    },

    // Append Inputs
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    append: {

      // Input
      ///////////////////////////////////////////////////////

      input: function(stageObj, type) {
        var classes, dataAttrs = '', dataAttrName, dataAttrContent;
        // If type is media, do media things with it
        if (type === 'media') {
          var acceptsArray = stageObj.accepts;
          $.each(acceptsArray, function(i, accepted) { dataAttrs = dataAttrs + ' data-' + accepted + '="true"';});
          type = 'text'; classes = 'ch-media';
        }
        if (type === 'date') {
          type = 'text';
          classes = 'ch-datepicker';
        }
        var input = '<input type="' + type + '" name="' + stageObj.inputName + '" placeholder="' + stageObj.placeholder + '" class="' + classes + '" autocomplete="off"' + dataAttrs + '>';

        this.$elem.append(this.scaffold.stage.call(this, input, stageObj));
      },

      // Textarea
      ///////////////////////////////////////////////////////

      textarea: function(stageObj) {
        var limit = '',
            limitUpdate = '',
            limitUpdateScaffold = function(valueToUpdate) {
              return '<div class="limit-update"><p><span class="limit-count">0</span>/' + valueToUpdate + '</p></div>'
            };

        // If there's a character limit
        if (stageObj.charlimit !== undefined) {
          limit = 'data-charlimit="' + stageObj.charlimit + '"';
          limitUpdate = limitUpdateScaffold(stageObj.charlimit);
        } else if (stageObj.wordlimit !== undefined) {
          limit = 'data-wordlimit="' + stageObj.wordlimit + '"';
          limitUpdate = limitUpdateScaffold(stageObj.wordlimit);
        }

        var textarea = '<textarea name="' + stageObj.inputName + '" placeholder="' + stageObj.placeholder + '"' + limit + '></textarea>' + limitUpdate;
        this.$elem.append(this.scaffold.stage.call(this, textarea, stageObj));
      },

      // Checkbox/Radio
      ///////////////////////////////////////////////////////

      checkboxradio: function(stageObj) {
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
        this.$elem.append(this.scaffold.stage.call(this, checkboxes, stageObj));
      },

      // Select
      ///////////////////////////////////////////////////////

      select: function(stageObj, type) {
        var optionsItems = '';
        if (type === 'country') {
          optionsItems = this.utilities.arrays.country();
        } else {
          optionsItems = stageObj.options
        }
        $.each(optionsItems, function(i, optionItem) {
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
        this.$elem.append(this.scaffold.stage.call(this, select, stageObj));
      },

      // Rating
      ///////////////////////////////////////////////////////

      rating: function(stageObj) {
        var ratingInput = '<input type="hidden" name="' + stageObj.inputName + '">';
        var star = '<li><i class="star el-icon-star"></i></li>';
        var starCount = '<span class="star-count"></span>';
        var rating = '<ul class="rating rating-' + stageObj.inputName + '">' + star + star + star + star + star + starCount + ratingInput + '</ul>';
        this.$elem.append(this.scaffold.stage.call(this, rating, stageObj));
      }
    },

    // Links
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    links: {

      // Next Stage
      ///////////////////////////////////////////////////////

      nextStage: function(button) {
        if (button.hasClass('validated')) {
          if (this.stage === (this.stagesLength + 1)) {
            this.send.call(this);
          } else {
            this.$elem.find('section:nth-of-type(' + this.stage + ')').removeClass('active').addClass('after');
            this.$elem.find('section:nth-of-type(' + (this.stage + 1) + ')').addClass('active');
            this.stage++;
            // Change title
            this.utilities.changeTitle.call(this);
            // Order Focus
            // Ps. Can't call focus straight away otherwise it messes up CSS animations!!!
            var that = this;
            if (!this.utilities.isMobile()) {
              setTimeout(function() {
                that.setup.focus.call(that);
              }, 500);
            }
            // Fire validations
            this.validations.validate.call(this);
          }
        }
      },

      // Previous stage
      ///////////////////////////////////////////////////////

      previousStage: function(button) {
        this.$elem.find('section:nth-of-type(' + this.stage + ')').removeClass('active');
        this.$elem.find('section:nth-of-type(' + (this.stage - 1) + ')').removeClass('after').addClass('active');
        this.stage--;
        // Change title
        this.utilities.changeTitle.call(this);
        // Order Focus
        // Ps. Can't call focus straight away otherwise it messes up CSS animations!!!
        var that = this;
        if (!this.utilities.isMobile()) {
          setTimeout(function() {
            that.setup.focus.call(that);
          }, 500);
        }
        // Fire validations
        this.validations.validate.call(this);
      },

      // Init Links
      ///////////////////////////////////////////////////////

      init: function() {
        var that = this;
        this.$elem.find('.ch-next').on('click', function(e) {
          e.preventDefault();
          that.links.nextStage.call(that, $(this));
        });
        this.$elem.find('.ch-prev').on('click', function(e) {
          e.preventDefault();
          that.links.previousStage.call(that, $(this));
        });
      }

    },

    // Validations
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    validations: {

      // Make Valid
      ///////////////////////////////////////////////////////

      makeValid: function(nextBtn) {
        if (nextBtn.hasClass('skip')) {
          nextBtn.html('Next');
        } else {
          nextBtn.addClass('validated');
        }
      },

      // Make Invalid
      ///////////////////////////////////////////////////////

      makeInvalid: function(nextBtn) {
        if (nextBtn.hasClass('skip')) {
          nextBtn.html('Skip');
        } else {
          nextBtn.removeClass('validated');
        }
      },

      // Init validations
      ///////////////////////////////////////////////////////

      validate: function() {
        var stageContainer = this.$elem.find('section:nth-of-type(' + this.stage + ')'),
            inputs = stageContainer.find('input, textarea'),
            selects = stageContainer.find('select'),
            checkboxes = stageContainer.find('.checkbox-group'),
            ratings = stageContainer.find('.rating'),
            dates = stageContainer.find('.ch-datepicker'),
            nextBtn = stageContainer.find('.ch-next'),
            that = this;

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
              that.validations.types.email.call(that, inputVal, nextBtn);

            // Validate date
            } else if (input.hasClass('ch-datepicker')) {
              that.validations.types.date(value);

            // Validate media
            } else if (input.hasClass('ch-media')) {
              that.validations.types.media.call(that, inputVal, input, nextBtn);

            // Validate textarea character limit
            } else if (input.is("[data-charlimit]") || input.is("[data-wordlimit]")) {
              that.validations.types.limit.call(that, inputVal, input, nextBtn);

            // Just validate presence
            } else {
              that.validations.makeValid(nextBtn);
            }
          // If nothing valid, ensure it's invalid
          } else {
            that.validations.makeInvalid(nextBtn);
            // Fixes charlimit bug
            if (input.is("[data-charlimit]") || input.is("[data-wordlimit]")) {
              that.validations.types.limit.call(that, inputVal, input, nextBtn);
            }
          }

          // Push value of input to store
          that.store[inputName] = inputVal;
          $('span.ch-' + inputName).html(inputVal);

        });

        // Validate select
        selects.each(function() {
          that.validations.types.select.call(that, $(this), nextBtn);
        });

        // Validate checkboxes
        checkboxes.on('click', function() {
          that.validations.types.checkboxradio.call(that, $(this), nextBtn);
        });

        // If ratings exist, run rating widget
        if (ratings.length > 0) {
          this.plugins.rating.init.call(this);
        }

        // If datepicker exists, run datepicker
        if (dates.length > 0) {
          this.plugins.date.init.call(this, dates);
        }
      },

      // Validation Types
      ///////////////////////////////////////////////////////

      types: {

        // Email Validation
        ///////////////////////////////////////////////////////

        email: function(inputVal, nextBtn) {
          var emailRegEx = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
          if (emailRegEx.test(inputVal)) {
            this.validations.makeValid(nextBtn);
          } else {
            this.validations.makeInvalid(nextBtn);
          }
        },

        // Select Validation
        ///////////////////////////////////////////////////////

        select: function(select, nextBtn) {
          var that = this;
          select.change(function() {
            that.validations.makeValid(nextBtn);
            var selectName = $(this).attr('name');
            var selectVal = $(this).val();
            that.store[selectName] = selectVal;
            $('span.ch-' + selectName).html(selectVal);
          });
        },

        checkboxradio: function(clicked, nextBtn) {
          var checkedInputs = clicked.find('input:checked');
          if (checkedInputs.length > 0) {
            this.validations.makeValid(nextBtn);
          } else {
            this.validations.makeInvalid(nextBtn);
          }
        },

        media: function(inputVal, input, nextBtn) {
          if (input.is("[data-youtube]") || input.is("[data-soundcloud]")) {
            var youtubeRegEx = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
            var soundcloudRegEx = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;

            if (youtubeRegEx.test(inputVal) || soundcloudRegEx.test(inputVal)) {
              this.validations.makeValid(nextBtn);
            } else {
              this.validations.makeInvalid(nextBtn);
            }
          }
        },

        limit: function(inputVal, input, nextBtn) {
          var charlimit = input.attr('data-charlimit'),
              wordlimit = input.attr('data-wordlimit'),
              updateContainer = input.closest('.action-wrapper').find('.limit-update'),
              updateCount = updateContainer.find('.limit-count'),
              charlength = inputVal.length,
              words = inputVal.split(' '),
              wordslength = words.length - 1;

          if (charlimit !== undefined) { updateCount.html(charlength); }
          else if (wordlimit !== undefined) { updateCount.html(wordslength); }

          if (charlength <= charlimit || wordslength <= wordlimit) {
            updateContainer.removeClass('invalid');
            this.validations.makeValid(nextBtn);
          } else {
            updateContainer.addClass('invalid');
            this.validations.makeInvalid(nextBtn);
          }
        }
      }
    },

    // Plugins
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    plugins: {

      // Rating Plugin
      ///////////////////////////////////////////////////////

      rating: {

        // Init Rating
        ///////////////////////////////////////////////////////

        init: function() {
          var stageContainer = this.$elem.find('section:nth-of-type(' + this.stage + ')'),
              ratingContainer = stageContainer.find('.rating'),
              stars = ratingContainer.find('li'),
              nextBtn = stageContainer.find('.ch-next'),
              that = this;

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
            that.store[ratingInputName] = starSelected;
            $('span.ch-' + ratingInputName).html(starSelected);
          });
        },

        // Reset Rating
        ///////////////////////////////////////////////////////

        reset: function() {
          // Get all ratings
          var ratings = this.$elem.find('.rating');
          //Remove valueSelected parameters
          ratings.removeClass('valueSelected');
          // Remove all classes from list items
          ratings.find('li').removeClass();
          // Remove the text representation of any rating selections
          ratings.find('span').html('');
        }
      },

      // Date Plugin
      ///////////////////////////////////////////////////////
      date: {
        init: function(dates) {
          var datepickerOptions = this.stages['stage' + (this.stage - 1)].datepicker,
              that = this;
          dates.datepicker(datepickerOptions);
          dates.on('change paste', function() {
            var inputVal = $(this).val();
            that.plugins.date.validate.call(that, inputVal);
          });
        },
        validate: function(inputVal) {
          var stageContainer = this.$elem.find('section:nth-of-type(' + this.stage + ')'),
              nextBtn = stageContainer.find('.ch-next'),
              dateRegEx = /^(?:(?:(?:0?[13578]|1[02])(\/|-|\.)31)\1|(?:(?:0?[1,3-9]|1[0-2])(\/|-|\.)(?:29|30)\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:0?2(\/|-|\.)29\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:(?:0?[1-9])|(?:1[0-2]))(\/|-|\.)(?:0?[1-9]|1\d|2[0-8])\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

          if (dateRegEx.test(inputVal)) {
            this.validations.makeValid(nextBtn);
          } else {
            this.validations.makeInvalid(nextBtn);
          }
        }
      }

    },

    // Send
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    send: function() {
      var sendingContainer = this.$elem.find('.ch-sending'),
          that = this;

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
        if (that.options.testMode) {
          successText = 'Sent <i>(in test mode)</i>';
        } else {
          successText = 'Sent';
        }
        sendingContainer.find('h2').html('<i class="el-icon-check"></i> ' + successText);
        setTimeout(function() {
          if (that.options.modal) {
            $(that.options.modalContainer).removeClass('open').addClass('close');
            setTimeout(function() {
              $(that.options.modalContainer).removeClass('close');
              resetForm();
            }, 400);
          } else {
            that.utilities.resetForm.call(that);
          }
        }, 2000);
      };

      // If in test mode
      if (that.options.testMode) {
        sending(function() {
          success();
        });

      // If NOT in test mode
      } else {
        sending();
        $.post($('form[name=' + that.options.formName + ']').attr('action'), $('form[name=' + that.options.formName + ']').serialize(), function(res){
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
    },

    // Utilities
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////
    ///////////////////////////////////////////////////////

    utilities: {

      // Init utilities
      ///////////////////////////////////////////////////////

      init: function() {
        this.utilities.verticalAlign.call(this);
        this.utilities.responsive.call(this);
        this.utilities.changeTitle.call(this);
        this.utilities.initModal.call(this);
      },

      // Vertical Align
      ///////////////////////////////////////////////////////

      verticalAlign: function() {
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
        var sectionPaddings = this.$elem.find('.section-padding');
        dynamicVerticalAlign(sectionPaddings);
      },

      // Responsive
      ///////////////////////////////////////////////////////

      responsive: function() {

        var that = this;
        function condenseGUI() {
          var condenseContainer;

          if (that.options.modal) {
            condenseContainer = $(that.options.modalContainer);
          } else {
            condenseContainer = that.$elem;
          }

          if (condenseContainer.width() <= 700) {
            that.$elem.addClass('condensed');
          } else {
            that.$elem.removeClass('condensed');
          }
        }
        condenseGUI();

        // Handle GUI style on window resize
        $(window).resize(function() {
          condenseGUI();
        });
      },

      // Change Title
      ///////////////////////////////////////////////////////

      changeTitle: function() {
        var titleContainer = this.$elem.find('.ch-title span');
        var counterContainer = this.$elem.find('.ch-counter span');
        if (this.stage === 1) {
          titleContainer.html(this.options.welcomeTitle);
          counterContainer.html('-');
        } else {
          titleContainer.html(this.stages['stage' + (this.stage - 1)].title);
          counterContainer.html((this.stage - 1) + '/' + this.stagesLength);
        }
      },

      // Init Modal
      ///////////////////////////////////////////////////////

      initModal: function() {
        var that = this;
        // Make modal fullscreen
        if (that.options.modalFullScreen) {
          that.$elem.addClass('fullscreen');
        }
        // Open Modal
        $(document).on('click', that.options.modalOpenBtn, function() {
          $(that.options.modalContainer).addClass('open');
        });
        // Close Modal
        that.$elem.find('.ch-close').on('click', function() {
          $(that.options.modalContainer).removeClass('open').addClass('close');
          setTimeout(function() {
            $(that.options.modalContainer).removeClass('close');
            that.utilities.resetForm.call(that);
          }, 400);
        });
      },

      // Reset Form
      ///////////////////////////////////////////////////////

      resetForm: function() {
        $('form[name=' + this.options.formName + ']')[0].reset();
        // Set all next buttons to invalid unless they're skip buttons
        this.$elem.find('.ch-next').each(function() {
          if ($(this).hasClass('skip')) {
            $(this).html('Skip');
          } else {
            $(this).removeClass('validated');
          }
        });
        // Reset all sections
        this.$elem.find('section').removeClass('after active');
        // Ensure sending container isn't visible
        this.$elem.find('.ch-sending').removeClass('show');
        // Setup welcome page
        this.$elem.find('section:nth-of-type(1)').addClass('active');
        this.$elem.find('section:nth-of-type(1) .ch-next').addClass('validated');
        // Reset any ratings
        this.plugins.rating.reset.call(this);
        // Reset stage counter
        this.stage = 1;
        // Reset titles
        this.utilities.changeTitle.call(this);
      },

      // Check device
      ///////////////////////////////////////////////////////

      isMobile: function() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      },

      // Default arrays for select boxes and options
      ///////////////////////////////////////////////////////

      arrays: {
        country: function() {
          return ["Afghanistan", "Albania", "Algeria", "American Samoa", "Andorra", "Angola", "Anguilla", "Antarctica", "Antigua and Barbuda", "Argentina", "Armenia", "Aruba", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bermuda", "Bhutan", "Bolivia", "Bosnia and Herzegowina", "Botswana", "Bouvet Island", "Brazil", "British Indian Ocean Territory", "Brunei Darussalam", "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Cayman Islands", "Central African Republic", "Chad", "Chile", "China", "Christmas Island", "Cocos (Keeling) Islands", "Colombia", "Comoros", "Congo", "Congo, the Democratic Republic of the", "Cook Islands", "Costa Rica", "Cote d'Ivoire", "Croatia (Hrvatska)", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Falkland Islands (Malvinas)", "Faroe Islands", "Fiji", "Finland", "France", "France Metropolitan", "French Guiana", "French Polynesia", "French Southern Territories", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Gibraltar", "Greece", "Greenland", "Grenada", "Guadeloupe", "Guam", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Heard and Mc Donald Islands", "Holy See (Vatican City State)", "Honduras", "Hong Kong", "Hungary", "Iceland", "India", "Indonesia", "Iran (Islamic Republic of)", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, Democratic People's Republic of", "Korea, Republic of", "Kuwait", "Kyrgyzstan", "Lao, People's Democratic Republic", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libyan Arab Jamahiriya", "Liechtenstein", "Lithuania", "Luxembourg", "Macau", "Macedonia, The Former Yugoslav Republic of", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Martinique", "Mauritania", "Mauritius", "Mayotte", "Mexico", "Micronesia, Federated States of", "Moldova, Republic of", "Monaco", "Mongolia", "Montserrat", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "Netherlands Antilles", "New Caledonia", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Niue", "Norfolk Island", "Northern Mariana Islands", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Pitcairn", "Poland", "Portugal", "Puerto Rico", "Qatar", "Reunion", "Romania", "Russian Federation", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Seychelles", "Sierra Leone", "Singapore", "Slovakia (Slovak Republic)", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Georgia and the South Sandwich Islands", "Spain", "Sri Lanka", "St. Helena", "St. Pierre and Miquelon", "Sudan", "Suriname", "Svalbard and Jan Mayen Islands", "Swaziland", "Sweden", "Switzerland", "Syrian Arab Republic", "Taiwan, Province of China", "Tajikistan", "Tanzania, United Republic of", "Thailand", "Togo", "Tokelau", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Turks and Caicos Islands", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "United States Minor Outlying Islands", "Uruguay", "Uzbekistan", "Vanuatu", "Venezuela", "Vietnam", "Virgin Islands (British)", "Virgin Islands (U.S.)", "Wallis and Futuna Islands", "Western Sahara", "Yemen", "Yugoslavia", "Zambia", "Zimbabwe"];
        }
      }

    }
  } // End of all functions

  Chattaaar.options = Plugin.prototype.options;

  $.fn.newChattaaar = function(options, stages) {
    return this.each(function() {
      new Chattaaar(this, options, stages).init();
    });
  };

})( jQuery, window , document );