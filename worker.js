addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

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
  const simpleSfaConfig = url.searchParams.get('simpleSFA');
  const simpleBfmConfig = url.searchParams.get('simpleBFM');
  const baseSfaConfig = url.searchParams.get('baseSFA');
  const baseBfmConfig = url.searchParams.get('baseBFM');
  
  // HomePage
  if (path === '/' || path === '') {
    return new Response(html, {headers: {"content-type": "text/html;charset=UTF-8"}, status:200});
  }

  if (path === '/get') {
    let responseText = '';
    if (simpleSfaConfig) {
      const accounts = simpleSfaConfig.split('|');
      accounts.forEach(account => {
        responseText += `${account} Hallo SFA Simple\n`;
      });
    } else if (simpleBfmConfig) {
      const accounts = simpleBfmConfig.split('|');
      accounts.forEach(account => {
        responseText += `${account} Hallo BFM Simple\n`;
      });
    } else if (baseSfaConfig) {
      const accounts = baseSfaConfig.split('|');
      accounts.forEach(account => {
        responseText += `${account} Hallo SFA Base\n`;
      });
    } else if (baseBfmConfig) {
      const accounts = baseBfmConfig.split('|');
      accounts.forEach(account => {
        responseText += `${account} Hallo BFM Base\n`;
      });
    }
    if (responseText) {
      return new Response(responseText, {status: 200});
    }
  }
  
  // 404 Not Found Page
  return new Response(notFound, {headers: {"content-type": "text/html;charset=UTF-8"},status : 404});
}
