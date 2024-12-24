document.addEventListener("DOMContentLoaded", function () {
  fetchFaves(5);
});

function likePost() {
  alert("仮");
}

function fetchFaves(count) {
  let faves = null;

  //サーバーとの通信の処理
  fetch("http://127.0.0.1:3000/faves", {
    headers: {
      Accept: "application/json", // JSONリクエストであることを示す
    },
  })
    .then((response) => {
      console.log("なにかのデータが帰ってきたよ");
      if (!response.ok) {
        // ステータスコードが200番台でない場合（200番は正常なレスポンスのとき）
        // 代わりのデータを設定
        const fallbackData = {
          faves: [
            {
              fave_id: 1,
              details: {
                group: "写実主義",
                name: "斎藤茂吉",
                description: "私はアララギ派の重鎮でございます。",
                sub_description: "真面目に生きることで、文学の進歩を目指しています。",
              },
            },
            {
              fave_id: 2,
              details: {
                group: "写実主義",
                name: "test",
                description: "私はアララギ派の重鎮でございます。",
                sub_description: "真面目に生きることで、文学の進歩を目指しています。",
              },
            },
            {
              fave_id: 3,
              details: {
                group: "青春派",
                name: "与謝野晶子",
                description: "恋愛など理想追及の姿勢を堂々と歌います。",
                sub_description: "女性の独立と自由な生き方をテーマにした作品を書いています。",
              },
            },
          ],
        };
        return fallbackData; // fallbackDataを返すことで次のthenで使えるようにする
      }
      console.log("1"); //ログ
      console.log(response);
      console.log(response.json);
      return response.json(); //正常なデータはそのまま返す
    })
    .then((data) => {
      console.log("2"); //ログ
      console.log(data);
      faves = JSON.parse(data).faves; // 取得したユーザー情報
      console.log("3"); //ログ

      //favesContainer = document.getElementById("faves-container"); // ユーザー情報を表示する要素

      //取得された推しの数だけ繰り返す
      faves.forEach((fave) => {
        const faveId = fave.fave_id; // ユーザーの fave_id
        const group = fave.details.group; // 所属名
        const name = fave.details.name; // 名前
        const description = fave.details.description; // 説明1
        const subDescription = fave.details.sub_description; // 説明2

        // ユーザー情報を表示する処理
        console.log(`ID: ${faveId}`);
        console.log(`Group: ${group}`);
        console.log(`Name: ${name}`);
        console.log(`Description: ${description}`);
        console.log(`Sub Description: ${subDescription}`);
      });
    })
    .then(() => {
      //コピーするときの処理
      var originalElement = document.getElementById("original");
      originalElement.style.display = "none"; //コピー元を非表示

      console.log(faves);

      faves.forEach((fave) => {
        console.log(fave);
        var clonedElement = originalElement.cloneNode(true); // 複製
        clonedElement.style.display = "block"; // display設定

        var clonedName = clonedElement.querySelector(".card-media-body-heading");
        var clonedGroup = clonedElement.querySelector(".data");
        var clonedText = clonedElement.querySelector(".card-media-body-supporting-bottom-text");
        var clonedHoverText = clonedElement.querySelector(".card-media-body-supporting-bottom.card-media-body-supporting-bottom-reveal .card-media-body-supporting-bottom-text.subtle");

        clonedElement.id = fave.fave_id; // id変更
        clonedName.textContent = fave.details.name; // 名前
        clonedGroup.textContent = fave.details.group; // 所属名
        clonedText.textContent = fave.details.description; // 説明1
        clonedHoverText.textContent = fave.details.sub_description; // 説明2（ホバー時のテキスト）

        document.getElementById("newContainer").appendChild(clonedElement); // 新しい要素を追加

        // debug: 複製された要素が正しく追加されているかを確認
        console.log(clonedElement);
      });

      // クリックイベント
      document.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          const clickedId = event.currentTarget.id;
          console.log(`Clicked text: ${clickedId}`);
          window.location.href = "http://127.0.0.1:3000/faves_" + clickedId;
          //alert(`Clicked text: ${clickedId}`);
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching faves:", error);
    });
}
