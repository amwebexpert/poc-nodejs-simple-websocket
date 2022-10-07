const http = new require('http');
const ws = new require("ws");
const wss = new ws.Server({ noServer: true });

const clients = new Set();

const httpServer = http.createServer((req, _res) => {
  wss.handleUpgrade(req, req.socket, Buffer.alloc(0), onSocketConnect);
});

function onSocketConnect(ws) {
  console.log('Connection with new socket');
  clients.add(ws);

  ws.on("message", function (message) {
    console.log('Message received', message);
    for (let client of clients) {
      client.send(`server echo: ${message}`);
    }
  });

  ws.on("close", function () {
    clients.delete(ws);
  });
}

console.log('server starting');
httpServer.listen(8080);
console.log('server started');
