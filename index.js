const http = require("http");
const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const util = require("util");
const url = require("url");
const querystring = require("querystring");

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

// データベースに接続
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("データベース接続エラー:", err.message);
    return;
  }
  console.log("データベースに接続しました。");
});

// db.all を Promise 化
const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

// db.close を Promise 化
const dbClose = () => {
  /*return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });*/
};

// favoritesJson 関数を修正
async function getFavoritesJson() {
  const favoritesJson = {
    faves: [],
  };

  try {
    // クエリの実行
    const rows = await dbAll("SELECT * FROM Favorites");

    // rows をマッピングして details をネスト
    favoritesJson.faves = rows.map((row) => ({
      fave_id: row.fave_id,
      details: {
        group: row.group_name,
        name: row.name,
        description: row.description, // 'desctiption' のスペルミスに注意
        sub_description: row["sub-description"] || row.sub_description, // カラム名に注意
      },
    }));

    // データベースをクローズ
    await dbClose();

    // JSON を返す
    return JSON.stringify(favoritesJson);
  } catch (err) {
    console.error("エラー:", err.message);
    // データベースをクローズ（エラー発生時でも）
    try {
      await dbClose();
      console.log("データベースが正常にクローズされました。");
    } catch (closeErr) {
      console.error("データベースのクローズ時にエラー:", closeErr.message);
    }
    throw err; // エラーを再スロー
  }
}

const hostname = "127.0.0.1";
const port = 3000;

function serveStaticFile(filePath, res) {
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || "application/octet-stream";

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code == "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("404 Not Fount", "utf-8");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error", "utf-8");
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
}

const server = http.createServer((req, res) => {
  let filePath = "." + req.url; // リクエストされたURLを基にファイルパスを作成
  console.log("\n" + filePath);

  if (filePath === "./faves") {
    filePath = "./index.html";
  } else if (filePath === "./") {
    filePath = "./404.html";
    console.log(filePath);
  } else if (req.url === "/add-user" && req.method === "POST") {
    let body = "";
  }

  console.log(filePath);

  // ファイルの拡張子を取得
  const extname = path.extname(filePath);

  // MIMEタイプを決定
  const contentType = mimeTypes[extname] || "application/octet-stream";

  // クライアントがJSONをリクエストしているかを判定
  //一般的なアクセスではacceptヘッダーにtext/htmlが含まれるが、JavaScriptのfetchリクエストではacceptヘッダーにapplication/jsonを指定することで、JSONを返すようにできます。
  const isJsonRequest = req.headers["accept"] && req.headers["accept"].includes("application/json"); //boolean
  console.log(isJsonRequest);

  if (isJsonRequest) {
    // JSONリクエストの場合
    console.log(filePath + "Jsonがリクエストされました");
    getFavoritesJson()
      .then((json) => {
        //正常に送信できた場合
        res.writeHead(200, { "Content-Type": "application/json" });
        console.log(JSON.stringify(json));
        res.end(JSON.stringify(json));
      })
      .catch((err) => {
        //エラーハンドリング
        console.error("Error fetching JSON:", err);
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("500 Internal Server Error");
      });
  } else {
    //HTMLリクエストの場合
    console.log(filePath + "HTMLがリクエストされました");
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
          console.log(error.code);
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
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
