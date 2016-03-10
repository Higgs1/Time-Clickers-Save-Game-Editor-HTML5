let $ = $.noConflict yes
  bin2hex = (bin) ->
    [('0' + c.char-code-at!to-string 16).slice -2 for c in bin] * ''
  hex2bin = (hex) ->
    [String.from-char-code parse-int h, 16 for h in hex.match /.{1,2}/g] * ''
  
  key = \l5FUP7guJYYz7vBVuFTNuLqZmS2dD5j0
  iv = no
  keyhash = md5 key
  
  hex_chars = '0123456789abcdef'.split ''
  iv_regex = /^[0-9A-F]{64}$/i
  
  keyshift = (data, shift = no) ->
    d = if shift then 1 else -1
    [String.from-char-code (c.char-code-at! + keyhash.char-code-at(i % 32) * d + 256) % 256 for c, i in data] * ''
  
  <- $
  
  (input_iv = $ \input) .on 'keyup change' ->
    if input_iv.val!match iv_regex
      div_iv.remove-class \has-error
      iv := hex2bin that.0
      text_json.change!
    else
      div_iv.add-class \has-error
      iv := no
  
  (btn_rndiv = $ \button) .on 'click' ->
    iv_hex = [hex_chars[Math.floor Math.random! * 16] for x til 64] * ''
    input_iv.val iv_hex
    iv := hex2bin iv_hex
    text_json.change!; no
    
  (text_b64 = $ \textarea .eq 0) .on 'keyup change' ->
    # Decryption
    data = atob text_b64.val!
    data = keyshift data
    input_iv.val bin2hex(iv = data[til 32] * '')
    data = mcrypt.Decrypt data[32 to] * '', iv, key, \rijndael-256, \cbc .replace /\0+$/, ''
    text_json.val JSON.stringify JSON.parse(data), no, 2
    
  (text_json = $ \textarea .eq 1) .on 'keyup change' ->
    try
      data = JSON.stringify JSON.parse text_json.val!
      div_json.remove-class \has-error
      if iv
        # Encryption
        data = mcrypt.Encrypt data, iv, key, \rijndael-256, \cbc
        data = keyshift (iv + data) * '', yes
        text_b64.val btoa data
    catch
      div_json.add-class \has-error
  
  div_iv = input_iv.parent!
  div_json = text_json.parent!
