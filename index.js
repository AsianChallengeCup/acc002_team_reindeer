/*const http = require("node:http");

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello, World!\n");
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

/*const http = require("node:http");
let fs = require("fs");
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    fs.readFile("./index.html", "UTF-8", (error, data) => {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(data);
      res.end();
    });
  } else if (req.url === "/test") {
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/plain");
    res.end("Hello, World! root/test\n");
  } else {
    res.statusCode = 400;
    res.setHeader("Content-Type", "text/plain");
    res.end("404 Not Found\n");
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

const http = require("node:http");
const fs = require("fs");
const path = require("path");

const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

const hostname = "127.0.0.1";
const port = 3000;

const server = http.createServer((req, res) => {
  let filePath = "." + req.url; // リクエストされたURLを基にファイルパスを作成

  if (filePath === "./") {
    // デフォルトのルート（トップページの場合はindex.htmlを提供）
    filePath = "./index.html";
  } else if (filePath === "./user_") {
    filePath = "./user_index/user_index.html";
    console.log(filePath);
  }

  // ファイルの拡張子を取得
  const extname = path.extname(filePath);

  // MIMEタイプを決定
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // ファイルを読み込んでレスポンスを送信
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // ファイルが存在しない場合（404エラー）
        /*res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found");*/

        filePath = "./404.html"; // 404.htmlのパスを指定
        fs.readFile(filePath, (err, data) => {
          if (err) {
            //404ページが見つからなかった場合
            // エラーハンドリング
            res.writeHead(500, { "Content-Type": "text/plain" });
            res.end("500 Internal Server Error");
          } else {
            //404ページが見つかった場合
            res.writeHead(404, { "Content-Type": "text/html" });
            res.end(data); // 404.htmlの内容を表示
          }
        });
      } else {
        // その他のエラー（500エラー）
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
      }
    } else {
      // ファイルを正常に読み込めた場合
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
