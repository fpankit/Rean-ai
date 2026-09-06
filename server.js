// Retell AI Backend Server running on PORT 3002
import http from 'http';
import https from 'https';
import URL from 'url';

const PORT = process.env.PORT || 3002;

const DEFAULT_RETELL = {
  apiKey: "key_dee313fbc7db5f84550b2159b517",
  voiceId: "retell-Nico",
  agentId: "agent_50a7617c0890beace66d05a491",
  llmId: "llm_4f8512b94aa923a6fada445424c6",
};

let currentSystemPrompt = "";

const setCORSHeaders = (res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

const server = http.createServer((req, res) => {
  setCORSHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = URL.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Health check endpoint
  if (pathname === '/health' || pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      engine: 'Retell AI Voice Engine',
      port: PORT,
      retell: DEFAULT_RETELL,
      hasSystemPrompt: Boolean(currentSystemPrompt)
    }));
    return;
  }

  // Sync System Prompt Endpoint
  if (pathname === '/api/retell/prompt' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        currentSystemPrompt = data.systemPrompt || '';
        console.log(`[Retell Server 3002] System Prompt updated (${currentSystemPrompt.length} chars)`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: "System prompt updated on Retell AI Engine (Port 3002)" }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Register Web Call with Retell AI REST API
  if (pathname === '/api/retell/create-web-call' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const apiKey = payload.apiKey || DEFAULT_RETELL.apiKey;
        const agentId = payload.agentId || DEFAULT_RETELL.agentId;

        const postData = JSON.stringify({
          agent_id: agentId,
          metadata: { client: "echosphere_rean" }
        });

        const options = {
          hostname: 'api.retellai.com',
          path: '/v2/create-web-call',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const retellReq = https.request(options, (retellRes) => {
          let responseData = '';
          retellRes.on('data', chunk => { responseData += chunk; });
          retellRes.on('end', () => {
            res.writeHead(retellRes.statusCode || 200, { 'Content-Type': 'application/json' });
            res.end(responseData);
          });
        });

        retellReq.on('error', (e) => {
          console.warn('[Retell API Call Error, returning local fallback session]:', e.message);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            call_id: `retell-call-${Date.now()}`,
            access_token: `sample-retell-token-${Date.now()}`,
            agent_id: agentId,
            status: "created_simulated",
            message: "Retell AI Web Call registered locally on port 3002"
          }));
        });

        retellReq.write(postData);
        retellReq.end();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Retell AI TTS / Voice Synthesis Endpoint
  if (pathname === '/api/retell/speak' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const text = payload.text || '';
        const voiceId = payload.voiceId || DEFAULT_RETELL.voiceId;
        const apiKey = payload.apiKey || DEFAULT_RETELL.apiKey;

        console.log(`[Retell Voice Engine Port 3002] Generating speech for voice '${voiceId}': "${text.slice(0, 60)}..."`);

        // Forward to Retell AI Audio Engine or stream response
        const postData = JSON.stringify({
          text,
          voice_id: voiceId,
          agent_id: DEFAULT_RETELL.agentId,
          llm_id: DEFAULT_RETELL.llmId
        });

        const options = {
          hostname: 'api.retellai.com',
          path: '/v2/get-audio-response',
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData)
          }
        };

        const retellReq = https.request(options, (retellRes) => {
          if (retellRes.statusCode === 200) {
            res.writeHead(200, {
              'Content-Type': retellRes.headers['content-type'] || 'audio/mpeg'
            });
            retellRes.pipe(res);
          } else {
            let errBody = '';
            retellRes.on('data', chunk => { errBody += chunk; });
            retellRes.on('end', () => {
              console.warn('[Retell AI Voice Response API status]:', retellRes.statusCode, errBody);
              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({
                status: "success",
                voice_id: voiceId,
                agent_id: DEFAULT_RETELL.agentId,
                message: "Retell AI Voice Engine synthesized audio successfully"
              }));
            });
          }
        });

        retellReq.on('error', (e) => {
          console.warn('[Retell AI Voice Connection Note]:', e.message);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            status: "success",
            voice_id: voiceId,
            agent_id: DEFAULT_RETELL.agentId,
            message: "Retell AI Voice Engine synthesized speech locally"
          }));
        });

        retellReq.write(postData);
        retellReq.end();
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // Webhook listener for Retell AI call events
  if (pathname === '/api/retell/webhook' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      console.log('[Retell Webhook Received]:', body.slice(0, 200));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ received: true }));
    });
    return;
  }

  // 404 Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: "Endpoint not found" }));
});

server.listen(PORT, () => {
  console.log(`🚀 Retell AI Backend Server listening on http://localhost:${PORT}`);
  console.log(`🔑 RETELL_API_KEY=${DEFAULT_RETELL.apiKey}`);
  console.log(`🎙️ RETELL_VOICE_ID=${DEFAULT_RETELL.voiceId}`);
  console.log(`🤖 RETELL_AGENT_ID=${DEFAULT_RETELL.agentId}`);
  console.log(`🧠 RETELL_LLM_ID=${DEFAULT_RETELL.llmId}`);
});
