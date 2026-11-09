import assert from 'node:assert/strict';
import handler from '../api/history-guide.mjs';
const originalFetch=globalThis.fetch;
const originalKey=process.env.GEMINI_API_KEY,originalModel=process.env.GEMINI_MODEL;
const response=()=>({code:200,body:null,setHeader(){},status(code){this.code=code;return this},json(body){this.body=body;return this}});
try {
 delete process.env.GEMINI_API_KEY;delete process.env.GEMINI_MODEL;
 let res=response();await handler({method:'GET'},res);assert.equal(res.code,405);
 res=response();await handler({method:'POST'},res);assert.equal(res.code,503);
 process.env.GEMINI_API_KEY='test-only';process.env.GEMINI_MODEL='test-model';
 res=response();await handler({method:'POST',body:{question:'x'.repeat(501),mode:'explore'}},res);assert.equal(res.code,400);
 res=response();await handler({method:'POST',body:{question:'test',mode:'explore',taskId:'missing'}},res);assert.equal(res.code,400);
 globalThis.fetch=async(url,options)=>{assert.ok(String(url).endsWith('test-model:generateContent'));assert.equal(options.headers['x-goog-api-key'],'test-only');return {ok:true,json:async()=>({candidates:[{content:{parts:[{text:'Giải thích kiểm thử'}]}}]})}};
 res=response();await handler({method:'POST',body:{question:'test',mode:'explore',taskId:'c1-t1'}},res);assert.equal(res.code,200);assert.equal(res.body.text,'Giải thích kiểm thử');assert.ok(res.body.source);
 globalThis.fetch=async()=>({ok:false});res=response();await handler({method:'POST',body:{question:'test',mode:'explain',taskId:'c1-t1'}},res);assert.equal(res.code,503);
 console.log('6 API checks passed: method, configuration, validation, missing task, success, upstream failure. No live API requests.');
} finally {globalThis.fetch=originalFetch;if(originalKey===undefined)delete process.env.GEMINI_API_KEY;else process.env.GEMINI_API_KEY=originalKey;if(originalModel===undefined)delete process.env.GEMINI_MODEL;else process.env.GEMINI_MODEL=originalModel}
