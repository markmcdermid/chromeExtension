// Todo Remove Lodash
(function() {
  console.log('Content Script Is Running');
  // This object is 🔥🔥🔥🔥🔥
  var emojis = {
    joy: '😂',
    info: '💁',
    annoyed: '😒',
    sob: '😭',
    cry: '😢',
    kiss: '😘',
    fire: '🔥',
    nerd: '🤓',
    roll: '🙄',
    ok: '👌🏽',
    halo: '😇',
    innocent: '😇',
    fuk: '😳'
  };

  var mmcEmoji = function mmcEmoji(element) {
    console.log('In constructor');
    this.emojis = emojis;
    this.emojiKeys = _.keys(emojis);
    this.emojiChecks = this.emojiKeys.map((k) => ':' + k + ':');
    this.fb = false;
    this.acceptingInput = false;
    this.target = null;

    this.init = function() {
      this.addEventListener();
    }
    this.init();
  }
  var p = mmcEmoji.prototype;

/*
  Gets the actual target element to replace text in (Because of facebook);
 */
  p.setTarget = function(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      console.log('running as normal');
      this.target = e.target;
      return;
    }

    if (e.target.classList.contains('_5rpu')) {
      console.log('we facebook now boys')

      var span = $(e.target).find('span[data-text="true"]')[0];
      this.target = span;
      this.fb = true;
    }
  };

 /*
  Gets the actual text to replace in the string.
 */
  p.getTheEmojiCodeFromString = function(text) {

    // TODO: Add selection start to this.
    var index = text.lastIndexOf(':');
    return {
      emoji: text.substring(index + 1).trim(),
      text: text.substring(0, index)
    }
  }

  p.addEventListener = function() {
    var self = this;
    document.addEventListener('keypress', function (e) {

      console.log(self.target);

      self.setTarget(e);
      if (e.key !== ':' && self.inEmojiMode) {
        return;
      };

      if (e.key === ':' && self.inEmojiMode) {
        self.quitEmojiMode(e);
      } else {
        self.inEmojiMode = true;
      }
    }, true);
  };

/*
  Adds the emoji
 */
  p.addTheEmoji = function(target) {
    console.log('adding the emoji');

    var text = target.value || target.innerHTML;
    var obj = this.getTheEmojiCodeFromString(text);

    console.log(obj);

    var textReplacement;
    console.log(obj);
    if (emojis[obj.emoji]) {
      console.log('that emoji does exist')
      textReplacement = obj.text + emojis[obj.emoji] + ' ';
    } else {
      console.log('that emoji does not exist')
      textReplacement = text + ':';
    }

    this.actuallyAddTheEmoji(target, textReplacement);
  };

  p.actuallyAddTheEmoji = function(target, replaceText) {
    if (this.fb) {
      target.innerHTML = replaceText;
    } else {
      target.value = replaceText;
    }
  }

  p.quitEmojiMode = function(e) {
    console.log('Quitting Emoji Mode.');
    this.addTheEmoji(this.target);
    this.inEmojiMode = false;
    e.preventDefault();
  };

  new mmcEmoji();

}());
