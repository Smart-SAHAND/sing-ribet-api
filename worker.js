import { Base64 } from "js-base64"

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function v2rayToSing(v2rayAccount) {
  let v2rayArrayUrl = v2rayAccount.split('|');
  let ftpArrayUrl = v2rayArrayUrl.map(urlString => urlString.replace(/^[^:]+(?=:\/\/)/, 'ftp')); //convert v2ray urls to ftp url since WHATWG URL API is suck when dealing with other protocol

  let resultParse = []

  function parseVmessUrl(ftpArrayUrl) {
    let ftpParsedUrl = ftpArrayUrl.substring(6)
    let decodeResult = Base64.decode(ftpParsedUrl);
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

  function parseVlessUrl(ftpArrayUrl) {
    let ftpParsedUrl = new URL(ftpArrayUrl)
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

  function parseTrojanUrl(ftpArrayUrl) {
    let ftpParsedUrl = new URL(ftpArrayUrl)
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

  function parseShadowsocksUrl(ftpArrayUrl) {
    let ftpParsedUrl = new URL(ftpArrayUrl)
    let encoded = decodeURIComponent(ftpParsedUrl.username);
    let decodeResult = atob(encoded);
    let shadowsocksPart = decodeResult.split(':');
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

  function parseShadowsocksRUrl(ftpArrayUrl) {
    let ftpParsedUrl = ftpArrayUrl.substring(6)
    let decodeResult = Base64.decode(ftpParsedUrl);
    let [serverSSR, portSSR, protocolSSR, methodSSR, obfsSSR, passwordSSR] = decodeResult.split(':');
    let params = new URLSearchParams(decodeResult.split('?')[1]);
    let obfs_paramSSR = params.get('obfsparam');
    let tagSSR = params.get('remarks');
    let proto_paramSSR = params.get('protoparam');
    const configResult = {
      tag: Base64.decode(tagSSR),
      type: "shadowsocksr",
      server: serverSSR,
      server_port: ~~portSSR,
      method: methodSSR,
      password: atob(passwordSSR.split('/')[0]),
      obfs: obfsSSR,
      obfs_param: atob(obfs_paramSSR),
      protocol: protocolSSR,
      protocol_param: atob(proto_paramSSR),
    };
    return configResult;
  }

  function parseSocksUrl(ftpArrayUrl) {
    let ftpParsedUrl = new URL(ftpArrayUrl)
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

  function parseHttpUrl(ftpArrayUrl) {
    let ftpParsedUrl = new URL(ftpArrayUrl)
    const configResult = {
      tag: ftpParsedUrl.hash.substring(1) || ftpParsedUrl.hostname,
      type: "http",
      server: ftpParsedUrl.hostname,
      server_port: ~~ftpParsedUrl.port,
      password: ftpParsedUrl.username,
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

  let v2rayLength = v2rayArrayUrl.length
  for (let i = 0; i < v2rayLength; i++) {
    let v2rayParsedUrl = new URL(v2rayArrayUrl[i])
    //let ftpParsedUrl = new URL(ftpArrayUrl[i])

    let configResult
    const protocolHandler = protocolMap[v2rayParsedUrl.protocol];
    if (protocolHandler) {
      configResult = protocolHandler(ftpArrayUrl[i]);
    } else {
      console.log("Unsupported Protocol!")
    }
    const resultLength = resultParse.length;
    resultParse[resultLength] = configResult;
  }
  return resultParse
  //let singStringify = JSON.stringify(resultParse, null, 4);
  //return singStringify
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
  `
  const url = new URL(request.url);
  const path = url.pathname;
  const account = url.searchParams.get("url")
  const target = url.searchParams.get("target")
  
  // HomePage
  if (path === '/' || path === '') {
    return new Response(html, {headers: {"content-type": "text/html;charset=UTF-8"}, status:200});
  }

  if (path === '/get') {
    //let responseText = '';
    //let splitAccount = account.split('|');
    let convertAccount = await v2rayToSing(decodeURIComponent(account))
    //if (target === "SFA"){}
    let singStringify = JSON.stringify(convertAccount, null, 4);
    if (singStringify) {
      return new Response(singStringify, {status: 200});
    }
  }
  
  // 404 Not Found Page
  return new Response(notFound, {headers: {"content-type": "text/html;charset=UTF-8"},status : 404});
}
