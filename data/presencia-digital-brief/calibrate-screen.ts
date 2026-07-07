#!/usr/bin/env bun
/** Calibrador visual — abre en browser y ajusta SCREEN en composite-phone-screen.ts */
import { writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const html = `<!DOCTYPE html>
<html><head><style>
  body{margin:0;background:#111;display:flex;justify-content:center;padding:20px}
  .wrap{position:relative;width:896px;height:1200px}
  .wrap img.base{width:896px;height:1200px;display:block}
  .screen{position:absolute;left:225px;top:564px;width:446px;height:512px;overflow:hidden;border-radius:11px;outline:2px solid rgba(255,0,0,.6)}
  .screen img{width:100%;height:100%;object-fit:cover;object-position:top center}
</style></head><body>
<div class="wrap">
  <img class="base" src="promo-latam-holding-phone.jpg"/>
  <div class="screen"><img src="promo-mobile-ui-vibrant.jpg"/></div>
</div></body></html>`;
writeFileSync(resolve(dir, '_calibrate-screen.html'), html);
console.log('Written _calibrate-screen.html');
