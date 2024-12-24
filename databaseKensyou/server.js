// server.js
const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");
const sqlite3 = require("sqlite3").verbose();

// データベース接続とテーブルの作成
const db = new sqlite3.Database("users.db", (err) => {
  if (err) {
    console.error("データベース接続エラー:", err.message);
  } else {
    console.log("SQLite データベースに接続しました。");
  }
});

db.serialize(() => {
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL
    )
  `,
    (err) => {
      if (err) {
        console.error("テーブル作成エラー:", err.message);
      } else {
        console.log("`users` テーブルが準備できました。");
      }
    }
  );
});

// MIMEタイプの設定
const mimeTypes = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

// サーバー設定
const hostname = "127.0.0.1";
const port = 3000;

// 静的ファイルを提供する関数
function serveStaticFile(filePath, res) {
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        // 404 エラー
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found", "utf-8");
      } else {
        // 500 エラー
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error", "utf-8");
      }
    } else {
      // 正常にファイルを返す
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
}

// HTTP サーバーの作成
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // 静的ファイルのパスを決定
  let filePath = path.join(
    __dirname,
    "public",
    pathname === "/" ? "index.html" : pathname
  );

  // 拡張子がない場合は.htmlを追加
  if (path.extname(filePath) === "") {
    filePath += ".html";
  }

  // ファイルの存在をチェック
  fs.exists(filePath, (exists) => {
    if (exists) {
      // 静的ファイルを提供
      serveStaticFile(filePath, res);
    } else {
      // APIエンドポイントの処理
      if (req.method === "POST" && pathname === "/add-user") {
        let body = "";

        // データ受信
        req.on("data", (chunk) => {
          body += chunk;
        });

        // データ受信完了
        req.on("end", () => {
          const parsedBody = querystring.parse(body);
          const name = parsedBody.name;
          const email = parsedBody.email;

          if (!name || !email) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("名前とメールアドレスは必須です。");
            return;
          }

          // データベースに挿入
          const stmt = db.prepare(
            "INSERT INTO users (name, email) VALUES (?, ?)"
          );
          stmt.run(name, email, function (err) {
            if (err) {
              console.error("データ挿入エラー:", err.message);
              res.writeHead(500, { "Content-Type": "text/plain" });
              res.end("ユーザーの追加に失敗しました。");
            } else {
              console.log(
                `新しいユーザーが追加されました: ID=${this.lastID}, Name=${name}, Email=${email}`
              );
              res.writeHead(302, { Location: "/" }); // リダイレクト
              res.end();
            }
          });

          stmt.finalize();
        });
      } else {
        // 404 エラー
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Found", "utf-8");
      }
    }
  });
});

// サーバーを起動
server.listen(port, hostname, () => {
  console.log(`サーバーが http://${hostname}:${port}/ で起動しました。`);
});
