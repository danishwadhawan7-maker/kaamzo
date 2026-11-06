const https = require('https');

function check(url) {
  https.get(url, (res) => {
    let data = '';
    res.on('data', c => data += c);
    res.on('end', () => {
      console.log('--- ' + url + ' ---');
      console.log('Status:', res.statusCode);
      const scripts = data.match(/<script[^>]*src="[^"]*"[^>]*>/g);
      console.log('Scripts:', scripts);
      console.log('Title:', data.match(/<title>([^<]*)<\/title>/)?.[1]);
      console.log('Has index-v19.js:', data.includes('index-v19.js'));
    });
  }).on('error', e => console.error(url, e.message));
}

check('https://www.kaamzo.site');
check('https://kaamzo.site');
