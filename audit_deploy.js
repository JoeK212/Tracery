const fs=require('fs');
const path=require('path');
const dir=__dirname;
const html=fs.readFileSync(path.join(dir,'index.html'),'utf8');
const changelog=fs.readFileSync(path.join(dir,'CHANGELOG.md'),'utf8');
let failures=0;
let passes=0;
function sectionHeader(name){console.log('\n'+name);}
function check(label,cond,detail){
  if(cond){passes++;console.log('  ok   '+label);}
  else{failures++;console.log('  FAIL '+label+(detail?' — '+detail:''));}
}

sectionHeader('v1.0.0 — structure and conventions');
const verMatch=html.match(/const APP_VERSION='([^']+)'/);
check('APP_VERSION constant present',!!verMatch);
const topEntry=changelog.match(/^v(\d+\.\d+\.\d+) - (\d{4}-\d{2}-\d{2}) - (.+)/);
check('CHANGELOG.md top entry matches "vX.Y.Z - YYYY-MM-DD - description"',!!topEntry);
check('CHANGELOG top version equals APP_VERSION',!!(topEntry&&verMatch&&topEntry[1]===verMatch[1]),topEntry&&verMatch?topEntry[1]+' vs '+verMatch[1]:'');
check('footer rendered through template literal referencing APP_VERSION',/\$\{APP_VERSION\}/.test(html)&&/TRACERY · v\$\{APP_VERSION\} · Joe\.K · axisbim\.io/.test(html));
check('footer not hardcoded in static HTML',!/<footer[^>]*>[^<]*v\d+\.\d+\.\d+/.test(html));
check('header comment present before <html>',/<!DOCTYPE html>\s*<!--\s*TRACERY\n[^\n]+\nJoe\.K · axisbim\.io\n-->\s*<html lang="en">/.test(html));
check('header comment has no CHANGELOG block',!/<!--[\s\S]*?CHANGELOG[\s\S]*?-->/.test(html));
check('escapeHtml defined',/function escapeHtml\(/.test(html));
check('escapeAttr defined',/function escapeAttr\(/.test(html));
check('confirmDialog defined',/function confirmDialog\(/.test(html));
check('toast defined and no native alert/confirm',/function toast\(/.test(html)&&!/\balert\(/.test(html.replace(/function confirmDialog[\s\S]*?\n}\n/,''))&&!/[^.\w]confirm\(/.test(html));
check('toast element class and id literally "toast"',/<div class="toast" id="toast"><\/div>/.test(html));
check('theme-color meta with id themeColorMeta',/<meta name="theme-color" id="themeColorMeta"/.test(html));
check('meta description present',/<meta name="description"/.test(html));
check('viewport-fit=cover',/viewport-fit=cover/.test(html));
check('both web-app-capable metas',/apple-mobile-web-app-capable/.test(html)&&/name="mobile-web-app-capable"/.test(html));
check('overscroll-behavior-y: contain on body',/body\{[^}]*overscroll-behavior-y:contain/.test(html));
check('safe-area insets used',/env\(safe-area-inset-top\)/.test(html));
check('Axis BIM Dark baseline tokens',/--paper:#0E1220/.test(html)&&/--card:#141829/.test(html)&&/--ink:#E7E4F4/.test(html)&&/--accent:#7C5CFC/.test(html));
check('light theme under :root[data-theme="light"]',/:root\[data-theme="light"\]/.test(html));
check('zero border-radius reset',/\*\{box-sizing:border-box;border-radius:0\}/.test(html));
const textInputs=html.match(/<input[^>]*type="(text|url)"[^>]*>/g);
check('no text/url inputs, or each styled font-size:16px',!textInputs||/input\[type=(text|url)\][^}]*font-size:16px/.test(html));
check('760px block screen present',/innerWidth<760/.test(html)&&/id="block"/.test(html));
check('seeded PRNG (mulberry32) defined and used',/function mulberry32\(/.test(html)&&/mulberry32\(Math\.round\(S\.seed\)/.test(html));

sectionHeader('v1.0.0 — index.html stays comment-free beyond the header');
const body=html.replace(/<!DOCTYPE html>\s*<!--[\s\S]*?-->/,'');
check('no further HTML comments',!/<!--/.test(body));
const scriptText=(html.match(/<script>([\s\S]*?)<\/script>/)||[])[1]||'';
const stripped=scriptText.replace(/'(?:\\.|[^'\\\n])*'|"(?:\\.|[^"\\\n])*"|`(?:\\.|[^`\\])*`|\/(?:\\.|\[(?:\\.|[^\]\\])*\]|[^/\\\n\[])+\/[gimsuy]*/g,'""');
check('no // or /* */ comments in inline script',!/\/\/|\/\*/.test(stripped));
const styleText=(html.match(/<style>([\s\S]*?)<\/style>/)||[])[1]||'';
check('no comments in CSS',!/\/\*/.test(styleText));

sectionHeader('v1.0.0 — script ordering and geometry invariants');
const startIdx=scriptText.lastIndexOf('start();');
const firstConstUse=scriptText.indexOf('const cv2d=');
check('start() is the last statement, after every top-level declaration',startIdx>firstConstUse&&scriptText.trim().endsWith('start();'));
check('cells offset individually, not as a union',/r\.cells\.forEach\(cp=>\{\s*offsetPaths\(cp,-hw\)/.test(html));
check('lights clipped to frame-inset opening',/offsetPaths\(op\.O,-fEff\)/.test(html)&&/ctIntersection\);\s*const minA/.test(html));
check('edge lines drawn from outlines, not EdgesGeometry',!/EdgesGeometry/.test(html));
check('no hardcoded hex colour inside CSS component rules',!/\}\s*[^{}]*\{[^}]*(?<!--[\w-]+:)#[0-9a-fA-F]{6}[^}]*\}/.test(styleText.replace(/:root\{[^}]*\}/g,'').replace(/:root\[data-theme="light"\]\{[^}]*\}/g,'')));

sectionHeader('v1.1.0 — Modulor series, Mondrian and Compare');
check('Red and Blue series arrays defined from the printed values',/const RED=\[4,6,10,16,27,43,70,113,183,296/.test(html)&&/const BLUE=\[8,13,20,33,53,86,140,226,366,592/.test(html));
check('legacy "modulor" scheme only appears in the state migration',(html.replace(/\{id:'modulor'/g,'').match(/'modulor'/g)||[]).length===2&&/S\.scheme==='modulor'\)S\.scheme='modBlue'/.test(html));
check('modTerms reports the fit scale',/best\.scale=L\/best\.sum/.test(html));
check('Mondrian never splits at one half',/const RAT=\[1\/4,1\/3,2\/5,3\/5,2\/3,3\/4\]/.test(html)&&!/RAT=\[[^\]]*0\.5[^\]]*\]/.test(html));
check('Mondrian generator is seeded',/mulberry32\(Math\.round\(seed\)\*104729\+17\)/.test(html));
check('light colours matched to cells by centroid test',/function lightColor\(/.test(html)&&/PointInPolygon/.test(html));
check('Compare table written before canvases are sized',/cmTab'\)\.innerHTML=cmpTableHtml[\s\S]*?cmpScene\(document\.getElementById\('cvB'\)/.test(html));
check('Compare Modulor aspect uses nominal series values',/c\.nw\|\|/.test(html));
check('Compare overlay present and hidden by default',/<div class="cmp" id="cmp" hidden>/.test(html));
check('Compare states generated study, not a painting',/not a measurement of any painting/.test(html));

sectionHeader('v1.2.0 — imperial units');
check('fmtImp, fmtLen and fmtLenS defined',/function fmtImp\(/.test(html)&&/function fmtLen\(/.test(html)&&/function fmtLenS\(/.test(html));
check('units stored under their own localStorage key, not in S',/const UNITS_KEY='tracery\.units'/.test(html)&&!/units:'metric'/.test(html));
check('analysis strip, slider readouts and 2D dims go through fmtLen',/kv\('Span',fmtLen\(span\)\)/.test(html)&&/if\(p\.u==='mm'\)return fmtLen\(v\)/.test(html)&&/'span '\+fmtLenS\(S\.span\)/.test(html));
check('no hardcoded " mm" suffix left in display strings',!/\+' mm'/.test(html.replace(/fmtLen\(mm\)[\s\S]*?\n}/,'')));
check('unit toggle recomputes geometry so baked notes refresh',/function toggleUnits\(\)\{[\s\S]*?schedule\(true\)/.test(html));
check('SVG export still in millimetres',/SVG exported in millimetres/.test(html));

sectionHeader('v1.3.0 — help guide');
check('help overlay present and hidden by default',/<div class="help" id="help" hidden>/.test(html));
const topicIds=[...html.matchAll(/\{id:'([a-z0-9-]+)',t:'/g)].map(m=>m[1]);
check('at least 18 help topics defined',topicIds.length>=18,String(topicIds.length));
check('every help topic id is unique',new Set(topicIds).size===topicIds.length);
const mapped=[...((html.match(/function helpTopicFor[\s\S]*?\n}\n/)||[''])[0].matchAll(/'([a-z0-9]+(?:-[a-z0-9]+)*)'/g))].map(m=>m[1]).filter(x=>['open','trac','bars','three'].indexOf(x)<0&&!/^(round|segmental|horseshoe|pointed|tudor|ogee|multifoil|ellipse|parabola|catenary|flat|circle|plain|mullions|geometric|rose|grid|mondrian|lattice)$/.test(x));
check('every topic the ? buttons and Help links can open exists',mapped.every(x=>topicIds.indexOf(x)>=0),mapped.filter(x=>topicIds.indexOf(x)<0).join(', '));
check('Compare Help button opens an existing topic',topicIds.indexOf('compare')>=0&&/openHelp\('math','compare'\)/.test(html));
check('help ? button stops the click reaching the summary',/\.info'\);\s*if\(!b\)return;\s*e\.preventDefault\(\);\s*e\.stopPropagation\(\)/.test(html));
check('help sits above the block screen',/\.help\{[^}]*z-index:120/.test(html)&&/\.block\{[^}]*z-index:100/.test(html));
check('search input styled at 16px',/input\[type=search\][^}]*font-size:16px/.test(html));
check('help level stored under its own key',/const HELP_LVL_KEY='tracery\.helplevel'/.test(html));

sectionHeader('v1.0.0 — deploy files');
check('netlify.toml publishes "."',/publish = "\."/.test(fs.readFileSync(path.join(dir,'netlify.toml'),'utf8')));
check('netlify.toml no-cache on index.html',/\/index\.html[\s\S]*no-cache/.test(fs.readFileSync(path.join(dir,'netlify.toml'),'utf8')));
check('README.md present without emoji or badges',(()=>{const r=fs.readFileSync(path.join(dir,'README.md'),'utf8');return !/[\u{1F300}-\u{1FAFF}]/u.test(r)&&!/shields\.io|badge/.test(r);})());

console.log('\n'+passes+' passed, '+failures+' failed');
process.exit(failures?1:0);
