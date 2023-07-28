(() => {
  // node_modules/js-base64/base64.mjs
  var version = "3.7.5";
  var VERSION = version;
  var _hasatob = typeof atob === "function";
  var _hasbtoa = typeof btoa === "function";
  var _hasBuffer = typeof Buffer === "function";
  var _TD = typeof TextDecoder === "function" ? new TextDecoder() : void 0;
  var _TE = typeof TextEncoder === "function" ? new TextEncoder() : void 0;
  var b64ch = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var b64chs = Array.prototype.slice.call(b64ch);
  var b64tab = ((a) => {
    let tab = {};
    a.forEach((c, i) => tab[c] = i);
    return tab;
  })(b64chs);
  var b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;
  var _fromCC = String.fromCharCode.bind(String);
  var _U8Afrom = typeof Uint8Array.from === "function" ? Uint8Array.from.bind(Uint8Array) : (it) => new Uint8Array(Array.prototype.slice.call(it, 0));
  var _mkUriSafe = (src) => src.replace(/=/g, "").replace(/[+\/]/g, (m0) => m0 == "+" ? "-" : "_");
  var _tidyB64 = (s) => s.replace(/[^A-Za-z0-9\+\/]/g, "");
  var btoaPolyfill = (bin) => {
    let u32, c0, c1, c2, asc = "";
    const pad = bin.length % 3;
    for (let i = 0; i < bin.length; ) {
      if ((c0 = bin.charCodeAt(i++)) > 255 || (c1 = bin.charCodeAt(i++)) > 255 || (c2 = bin.charCodeAt(i++)) > 255)
        throw new TypeError("invalid character found");
      u32 = c0 << 16 | c1 << 8 | c2;
      asc += b64chs[u32 >> 18 & 63] + b64chs[u32 >> 12 & 63] + b64chs[u32 >> 6 & 63] + b64chs[u32 & 63];
    }
    return pad ? asc.slice(0, pad - 3) + "===".substring(pad) : asc;
  };
  var _btoa = _hasbtoa ? (bin) => btoa(bin) : _hasBuffer ? (bin) => Buffer.from(bin, "binary").toString("base64") : btoaPolyfill;
  var _fromUint8Array = _hasBuffer ? (u8a) => Buffer.from(u8a).toString("base64") : (u8a) => {
    const maxargs = 4096;
    let strs = [];
    for (let i = 0, l = u8a.length; i < l; i += maxargs) {
      strs.push(_fromCC.apply(null, u8a.subarray(i, i + maxargs)));
    }
    return _btoa(strs.join(""));
  };
  var fromUint8Array = (u8a, urlsafe = false) => urlsafe ? _mkUriSafe(_fromUint8Array(u8a)) : _fromUint8Array(u8a);
  var cb_utob = (c) => {
    if (c.length < 2) {
      var cc = c.charCodeAt(0);
      return cc < 128 ? c : cc < 2048 ? _fromCC(192 | cc >>> 6) + _fromCC(128 | cc & 63) : _fromCC(224 | cc >>> 12 & 15) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    } else {
      var cc = 65536 + (c.charCodeAt(0) - 55296) * 1024 + (c.charCodeAt(1) - 56320);
      return _fromCC(240 | cc >>> 18 & 7) + _fromCC(128 | cc >>> 12 & 63) + _fromCC(128 | cc >>> 6 & 63) + _fromCC(128 | cc & 63);
    }
  };
  var re_utob = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g;
  var utob = (u) => u.replace(re_utob, cb_utob);
  var _encode = _hasBuffer ? (s) => Buffer.from(s, "utf8").toString("base64") : _TE ? (s) => _fromUint8Array(_TE.encode(s)) : (s) => _btoa(utob(s));
  var encode = (src, urlsafe = false) => urlsafe ? _mkUriSafe(_encode(src)) : _encode(src);
  var encodeURI = (src) => encode(src, true);
  var re_btou = /[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g;
  var cb_btou = (cccc) => {
    switch (cccc.length) {
      case 4:
        var cp = (7 & cccc.charCodeAt(0)) << 18 | (63 & cccc.charCodeAt(1)) << 12 | (63 & cccc.charCodeAt(2)) << 6 | 63 & cccc.charCodeAt(3), offset = cp - 65536;
        return _fromCC((offset >>> 10) + 55296) + _fromCC((offset & 1023) + 56320);
      case 3:
        return _fromCC((15 & cccc.charCodeAt(0)) << 12 | (63 & cccc.charCodeAt(1)) << 6 | 63 & cccc.charCodeAt(2));
      default:
        return _fromCC((31 & cccc.charCodeAt(0)) << 6 | 63 & cccc.charCodeAt(1));
    }
  };
  var btou = (b) => b.replace(re_btou, cb_btou);
  var atobPolyfill = (asc) => {
    asc = asc.replace(/\s+/g, "");
    if (!b64re.test(asc))
      throw new TypeError("malformed base64.");
    asc += "==".slice(2 - (asc.length & 3));
    let u24, bin = "", r1, r2;
    for (let i = 0; i < asc.length; ) {
      u24 = b64tab[asc.charAt(i++)] << 18 | b64tab[asc.charAt(i++)] << 12 | (r1 = b64tab[asc.charAt(i++)]) << 6 | (r2 = b64tab[asc.charAt(i++)]);
      bin += r1 === 64 ? _fromCC(u24 >> 16 & 255) : r2 === 64 ? _fromCC(u24 >> 16 & 255, u24 >> 8 & 255) : _fromCC(u24 >> 16 & 255, u24 >> 8 & 255, u24 & 255);
    }
    return bin;
  };
  var _atob = _hasatob ? (asc) => atob(_tidyB64(asc)) : _hasBuffer ? (asc) => Buffer.from(asc, "base64").toString("binary") : atobPolyfill;
  var _toUint8Array = _hasBuffer ? (a) => _U8Afrom(Buffer.from(a, "base64")) : (a) => _U8Afrom(_atob(a).split("").map((c) => c.charCodeAt(0)));
  var toUint8Array = (a) => _toUint8Array(_unURI(a));
  var _decode = _hasBuffer ? (a) => Buffer.from(a, "base64").toString("utf8") : _TD ? (a) => _TD.decode(_toUint8Array(a)) : (a) => btou(_atob(a));
  var _unURI = (a) => _tidyB64(a.replace(/[-_]/g, (m0) => m0 == "-" ? "+" : "/"));
  var decode = (src) => _decode(_unURI(src));
  var isValid = (src) => {
    if (typeof src !== "string")
      return false;
    const s = src.replace(/\s+/g, "").replace(/={0,2}$/, "");
    return !/[^\s0-9a-zA-Z\+/]/.test(s) || !/[^\s0-9a-zA-Z\-_]/.test(s);
  };
  var _noEnum = (v) => {
    return {
      value: v,
      enumerable: false,
      writable: true,
      configurable: true
    };
  };
  var extendString = function() {
    const _add = (name, body) => Object.defineProperty(String.prototype, name, _noEnum(body));
    _add("fromBase64", function() {
      return decode(this);
    });
    _add("toBase64", function(urlsafe) {
      return encode(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return encode(this, true);
    });
    _add("toBase64URL", function() {
      return encode(this, true);
    });
    _add("toUint8Array", function() {
      return toUint8Array(this);
    });
  };
  var extendUint8Array = function() {
    const _add = (name, body) => Object.defineProperty(Uint8Array.prototype, name, _noEnum(body));
    _add("toBase64", function(urlsafe) {
      return fromUint8Array(this, urlsafe);
    });
    _add("toBase64URI", function() {
      return fromUint8Array(this, true);
    });
    _add("toBase64URL", function() {
      return fromUint8Array(this, true);
    });
  };
  var extendBuiltins = () => {
    extendString();
    extendUint8Array();
  };
  var gBase64 = {
    version,
    VERSION,
    atob: _atob,
    atobPolyfill,
    btoa: _btoa,
    btoaPolyfill,
    fromBase64: decode,
    toBase64: encode,
    encode,
    encodeURI,
    encodeURL: encodeURI,
    utob,
    btou,
    decode,
    isValid,
    fromUint8Array,
    toUint8Array,
    extendString,
    extendUint8Array,
    extendBuiltins
  };

  // test.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  async function v2rayToSing(v2rayAccount) {
    let v2rayArrayUrl = v2rayAccount.split("|");
    //console.log(v2rayArrayUrl)
    let ftpArrayUrl = v2rayArrayUrl.map((urlString) => urlString.replace(/^[^:]+(?=:\/\/)/, "ftp"));
    let resultParse = [];
    function parseVmessUrl(ftpArrayUrl2) {
      let ftpParsedUrl = ftpArrayUrl2.substring(6);
      let decodeResult = gBase64.decode(ftpParsedUrl);
      let parsedJSON = JSON.parse(decodeResult);
      const configResult = {
        tag: parsedJSON.ps || parsedJSON.add,
        type: "vmess",
        server: parsedJSON.add,
        server_port: ~~parsedJSON.port,
        uuid: parsedJSON.id,
        security: "auto",
        alter_id: ~~parsedJSON.aid,
        global_padding: false,
        authenticated_length: true,
        multiplex: {
          enabled: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (parsedJSON.port === "443" || parsedJSON.tls === "tls") {
        configResult.tls = {
          enabled: true,
          server_name: parsedJSON.sni || parsedJSON.add,
          insecure: true,
          disable_sni: false
        };
      }
      if (parsedJSON.net === "ws") {
        configResult.transport = {
          type: parsedJSON.net,
          path: parsedJSON.path,
          headers: {
            Host: parsedJSON.host || parsedJSON.add
          },
          max_early_data: 0,
          early_data_header_name: "Sec-WebSocket-Protocol"
        };
      } else if (parsedJSON.net === "grpc") {
        configResult.transport = {
          type: parsedJSON.net,
          service_name: parsedJSON.path,
          idle_timeout: "15s",
          ping_timeout: "15s",
          permit_without_stream: false
        };
      }
      return configResult;
    }
    function parseVlessUrl(ftpArrayUrl2) {
      let ftpParsedUrl = new URL(ftpArrayUrl2);
      const configResult = {
        tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
        type: "vless",
        server: ftpParsedUrl.hostname,
        server_port: ~~ftpParsedUrl.port,
        uuid: ftpParsedUrl.username,
        flow: "",
        packet_encoding: "xudp",
        multiplex: {
          enabled: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (ftpParsedUrl.port === "443" || ftpParsedUrl.searchParams.get("security") === "tls") {
        configResult.tls = {
          enabled: true,
          server_name: ftpParsedUrl.searchParams.get("sni"),
          insecure: true,
          disable_sni: false
        };
      }
      const transportTypes = {
        ws: {
          type: ftpParsedUrl.searchParams.get("type"),
          path: ftpParsedUrl.searchParams.get("path"),
          headers: {
            Host: ftpParsedUrl.searchParams.get("host")
          },
          max_early_data: 0,
          early_data_header_name: "Sec-WebSocket-Protocol"
        },
        grpc: {
          type: ftpParsedUrl.searchParams.get("type"),
          service_name: ftpParsedUrl.searchParams.get("serviceName"),
          idle_timeout: "15s",
          ping_timeout: "15s",
          permit_without_stream: false
        }
      };
      configResult.transport = transportTypes[ftpParsedUrl.searchParams.get("type")];
      return configResult;
    }
    function parseTrojanUrl(ftpArrayUrl2) {
      let ftpParsedUrl = new URL(ftpArrayUrl2);
      const configResult = {
        tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
        type: "trojan",
        server: ftpParsedUrl.hostname,
        server_port: ~~ftpParsedUrl.port,
        password: ftpParsedUrl.username,
        multiplex: {
          enabled: false,
          protocol: "smux",
          max_streams: 32
        }
      };
      if (ftpParsedUrl.port === "443" || ftpParsedUrl.searchParams.get("security") === "tls") {
        configResult.tls = {
          enabled: true,
          server_name: ftpParsedUrl.searchParams.get("sni"),
          insecure: true,
          disable_sni: false
        };
      }
      const transportTypes = {
        ws: {
          type: ftpParsedUrl.searchParams.get("type"),
          path: ftpParsedUrl.searchParams.get("path"),
          headers: {
            Host: ftpParsedUrl.searchParams.get("host")
          },
          max_early_data: 0,
          early_data_header_name: "Sec-WebSocket-Protocol"
        },
        grpc: {
          type: ftpParsedUrl.searchParams.get("type"),
          service_name: ftpParsedUrl.searchParams.get("serviceName"),
          idle_timeout: "15s",
          ping_timeout: "15s",
          permit_without_stream: false
        }
      };
      configResult.transport = transportTypes[ftpParsedUrl.searchParams.get("type")];
      return configResult;
    }
    function parseShadowsocksUrl(ftpArrayUrl2) {
      let ftpParsedUrl = new URL(ftpArrayUrl2);
      let encoded = decodeURIComponent(ftpParsedUrl.username);
      let decodeResult = atob(encoded);
      let shadowsocksPart = decodeResult.split(":");
      const configResult = {
        tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
        type: "shadowsocks",
        server: ftpParsedUrl.hostname,
        server_port: ~~ftpParsedUrl.port,
        method: shadowsocksPart[0],
        password: shadowsocksPart[1],
        plugin: "",
        plugin_opts: ""
      };
      return configResult;
    }
    function parseShadowsocksRUrl(ftpArrayUrl2) {
      let ftpParsedUrl = ftpArrayUrl2.substring(6);
      let decodeResult = gBase64.decode(ftpParsedUrl);
      let [serverSSR, portSSR, protocolSSR, methodSSR, obfsSSR, passwordSSR] = decodeResult.split(":");
      let params = new URLSearchParams(decodeResult.split("?")[1]);
      let obfs_paramSSR = params.get("obfsparam");
      let tagSSR = params.get("remarks");
      let proto_paramSSR = params.get("protoparam");
      const configResult = {
        tag: gBase64.decode(tagSSR),
        type: "shadowsocksr",
        server: serverSSR,
        server_port: ~~portSSR,
        method: methodSSR,
        password: atob(passwordSSR.split("/")[0]),
        obfs: obfsSSR,
        obfs_param: atob(obfs_paramSSR),
        protocol: protocolSSR,
        protocol_param: atob(proto_paramSSR)
      };
      return configResult;
    }
    function parseSocksUrl(ftpArrayUrl2) {
      let ftpParsedUrl = new URL(ftpArrayUrl2);
      const configResult = {
        tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
        type: "socks",
        server: ftpParsedUrl.hostname,
        server_port: ~~ftpParsedUrl.port,
        password: ftpParsedUrl.username,
        version: "5"
      };
      return configResult;
    }
    function parseHttpUrl(ftpArrayUrl2) {
      let ftpParsedUrl = new URL(ftpArrayUrl2);
      const configResult = {
        tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
        type: "http",
        server: ftpParsedUrl.hostname,
        server_port: ~~ftpParsedUrl.port,
        password: ftpParsedUrl.username
      };
      return configResult;
    }
    const protocolMap = {
      "vmess:": parseVmessUrl,
      "vless:": parseVlessUrl,
      "trojan:": parseTrojanUrl,
      "trojan-go:": parseTrojanUrl,
      "ss:": parseShadowsocksUrl,
      "ssr:": parseShadowsocksRUrl,
      "socks5:": parseSocksUrl,
      "http:": parseHttpUrl
    };
    let v2rayLength = v2rayArrayUrl.length;
    for (let i = 0; i < v2rayLength; i++) {
      let v2rayParsedUrl = new URL(v2rayArrayUrl[i]);
      let configResult;
      const protocolHandler = protocolMap[v2rayParsedUrl.protocol];
      if (protocolHandler) {
        configResult = protocolHandler(ftpArrayUrl[i]);
      } else {
        console.log("Unsupported Protocol!");
      }
      const resultLength = resultParse.length;
      resultParse[resultLength] = configResult;
    }
    return resultParse;
  }
  async function handleRequest(request) {
    const html = `<!DOCTYPE html>
  <html>
    <head>
      <link href="https://raw.githubusercontent.com/iyarivky/sing-ribet-api/main/media/sing-ribet-convert.ico" rel="icon" type="image/x-icon" />
      <title>sing-ribet API</title>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
      <link
        href="https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@600&display=swap"
        rel="stylesheet"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
      />
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
        }
  
        .content {
          text-align: center;
        }
  
        h1 {
          font-family: "Source Serif 4", sans-serif;
          font-size: 4em;
          margin-bottom: 1px;
        }
        p {
          font-family: monospace;
          font-size: 1em;
          margin-top: 1px;
        }
        .fa {
          font-size: 30px;
        }
        a {
          color: black;
          text-decoration: none;
        }
        a:visited {
          color: black;
        }
        a:hover {
          color: blue;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <h1>sing-ribet API</h1>
        <p>convert xray/v2ray url link to sing-box JSON.</p>
        <a href="https://github.com/iyarivky/sing-ribet-api" target="_blank">
          <i class="fa">&#xf09b;</i>
        </a>
      </div>
    </body>
  </html>`;
    const notFound = `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link href="https://raw.githubusercontent.com/iyarivky/sing-ribet-api/main/media/sing-ribet-convert.ico" rel="icon" type="image/x-icon" />
      <title>404 Freedom Not Found</title>
      <link href="https://fonts.cdnfonts.com/css/glitch-goblin" rel="stylesheet">
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 85vh;
          background-color: #1a1a1a;
          color: #ffffff;
          text-align: center;
        }
        h1 {
          font-family: 'Glitch Goblin', sans-serif;
          font-size: 10em;
          margin-bottom: 1px;
        }
        p {
          font-family: monospace;
          font-size: 1.5em;
          margin-top: 1px;
        }
      </style>
    </head>
    <body>
      <h1>404</h1>
      <p>Freedom Not Found</p>
    </body>
  </html>
  `;
    const url = new URL(request.url);
    const path = url.pathname;
    const account = url.searchParams.get("url");
    const target = url.searchParams.get("target");
    if (path === "/" || path === "") {
      return new Response(html, { headers: { "content-type": "text/html;charset=UTF-8" }, status: 200 });
    }
    if (path === "/get") {
      //let splitAccount = account.split("|");
      let convertAccount = await v2rayToSing(decodeURIComponent(account));
      let singStringify = JSON.stringify(convertAccount, null, 4);
      if (singStringify) {
        return new Response(singStringify, { status: 200 });
      }
    }
    return new Response(notFound, { headers: { "content-type": "text/html;charset=UTF-8" }, status: 404 });
  }
})();
