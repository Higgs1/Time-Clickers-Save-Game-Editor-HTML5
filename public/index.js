var join$ = [].join, slice$ = [].slice;
(function($){
  var bin2hex, hex2bin, key, iv, keyhash, hex_chars, iv_regex, keyshift;
  bin2hex = function(bin){
    var c;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = bin).length; i$ < len$; ++i$) {
        c = ref$[i$];
        results$.push(('0' + c.charCodeAt().toString(16)).slice(-2));
      }
      return results$;
    }()).join('');
  };
  hex2bin = function(hex){
    var h;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = hex.match(/.{1,2}/g)).length; i$ < len$; ++i$) {
        h = ref$[i$];
        results$.push(String.fromCharCode(parseInt(h, 16)));
      }
      return results$;
    }()).join('');
  };
  key = 'l5FUP7guJYYz7vBVuFTNuLqZmS2dD5j0';
  iv = false;
  keyhash = md5(key);
  hex_chars = '0123456789abcdef'.split('');
  iv_regex = /^[0-9A-F]{64}$/i;
  keyshift = function(data, shift){
    var d, i, c;
    shift == null && (shift = false);
    d = shift
      ? 1
      : -1;
    return (function(){
      var i$, ref$, len$, results$ = [];
      for (i$ = 0, len$ = (ref$ = data).length; i$ < len$; ++i$) {
        i = i$;
        c = ref$[i$];
        results$.push(String.fromCharCode((c.charCodeAt() + keyhash.charCodeAt(i % 32) * d + 256) % 256));
      }
      return results$;
    }()).join('');
  };
  $(function(){
    var input_iv, btn_rndiv, text_b64, text_json, div_iv, div_json;
    (input_iv = $('input')).on('keyup change', function(){
      var that;
      if (that = input_iv.val().match(iv_regex)) {
        div_iv.removeClass('has-error');
        iv = hex2bin(that[0]);
        return text_json.change();
      } else {
        div_iv.addClass('has-error');
        return iv = false;
      }
    });
    (btn_rndiv = $('button')).on('click', function(){
      var iv_hex, x;
      iv_hex = (function(){
        var i$, results$ = [];
        for (i$ = 0; i$ < 64; ++i$) {
          x = i$;
          results$.push(hex_chars[Math.floor(Math.random() * 16)]);
        }
        return results$;
      }()).join('');
      input_iv.val(iv_hex);
      iv = hex2bin(iv_hex);
      text_json.change();
      return false;
    });
    (text_b64 = $('textarea').eq(0)).on('keyup change', function(){
      var data, iv;
      data = atob(text_b64.val());
      data = keyshift(data);
      input_iv.val(bin2hex(iv = [data[0], data[1], data[2], data[3], data[4], data[5], data[6], data[7], data[8], data[9], data[10], data[11], data[12], data[13], data[14], data[15], data[16], data[17], data[18], data[19], data[20], data[21], data[22], data[23], data[24], data[25], data[26], data[27], data[28], data[29], data[30], data[31]].join('')));
      data = mcrypt.Decrypt(join$.call(slice$.call(data, 32), ''), iv, key, 'rijndael-256', 'cbc').replace(/\0+$/, '');
      return text_json.val(JSON.stringify(JSON.parse(data), false, 2));
    });
    (text_json = $('textarea').eq(1)).on('keyup change', function(){
      var data, e;
      try {
        data = JSON.stringify(JSON.parse(text_json.val()));
        div_json.removeClass('has-error');
        if (iv) {
          data = mcrypt.Encrypt(data, iv, key, 'rijndael-256', 'cbc');
          data = keyshift(join$.call(iv + data, ''), true);
          return text_b64.val(btoa(data));
        }
      } catch (e$) {
        e = e$;
        return div_json.addClass('has-error');
      }
    });
    div_iv = input_iv.parent();
    return div_json = text_json.parent();
  });
}.call(this, $.noConflict(true)));
