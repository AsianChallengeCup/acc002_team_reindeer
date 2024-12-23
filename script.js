document.addEventListener("DOMContentLoaded", function () {
  duplicateElements(5); // 例えば5回複製
});

function likePost() {
  alert("仮");
}

function duplicateElements(count) {
  var originalElement = document.getElementById("original");
  originalElement.style.display = "none"; //コピー元を非表示

  var names = ["斎藤茂吉", "与謝野晶子", "高浜虚子", "石川啄木", "正岡子規"];
  var namesID = ["SaitouMokichi", "YosanoAkiko", "TakahamaKyosi", "IshikawaTakuboku", "MasaokaShiki"];
  var descriptions = ["写実主義", "明星派", "俳句の革新者", "青春の悩み", "文学の進歩"];
  var additionalTexts = ["私はアララギ派の重鎮でございます。", "恋愛など理想追及の姿勢を堂々と歌います。", "俳句に革命をもたらす作品を。", "若き日の情熱と悩みが詠み込まれています。", "日本文学に革新を求め続けた生涯。"];
  var famousPoems = ["あらざらむ　この世のほかの　思ひ出に　今ひとたびの　逢ひ見むためも", "君死にたまふことなかれ　わがために　心をかけて　いざ生きよ", "春風に　花の色もゆる　夜のこと　日も暮れかけぬ　あたりをさまよふ", "ああ、青春の日々よ　やすらかに　悩みの中にも　喜びを感じて", "柿の木の　大木に座して　泣くやうに　涙をひとしずく　落としにけり"];

  for (var i = 0; i < count; i++) {
    var clonedElement = originalElement.cloneNode(true); // 複製
    clonedElement.id = namesID[i]; // id変更
    clonedElement.style.display = "block"; // display設定

    var clonedName = clonedElement.querySelector(".card-media-body-heading");
    var clonedDescription = clonedElement.querySelector(".data");
    var clonedText = clonedElement.querySelector(".card-media-body-supporting-bottom-text");
    var clonedHoverText = clonedElement.querySelector(".card-media-body-supporting-bottom.card-media-body-supporting-bottom-reveal .card-media-body-supporting-bottom-text.subtle");

    clonedName.textContent = names[i];
    clonedDescription.textContent = descriptions[i];
    clonedText.textContent = additionalTexts[i];
    clonedHoverText.textContent = famousPoems[i]; //ホバーテキストの変更

    document.getElementById("newContainer").appendChild(clonedElement); // 新しい要素を追加

    // debug: 複製された要素が正しく追加されているかを確認
    console.log(clonedElement);
  }

  // クリックイベント
  document.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const clickedId = event.currentTarget.id;
      console.log(`Clicked text: ${clickedId}`);
      window.location.href = "http://127.0.0.1:3000/user_" + clickedId;
      //alert(`Clicked text: ${clickedId}`);
    });
  });
}
