// shared.js
(() => {
  // ===== 共通設定 =====
  window.APP_CONFIG = {
    LIFF_ID: "2008912129-TQRCpL9d",
    FORM_RESPONSE:
      "https://docs.google.com/forms/d/e/1FAIpQLSfZeKs2ZPJ0iIOxg6L7UZUr7fUmZy-E5OwA7aq93Uu7VaysBA/formResponse",
    ENTRY_MEMBER: "entry.71375240",
    ENTRY_CLASS: "entry.403922703",
  };

  // ===== 共通データ（ここだけ更新すればOK）=====
  window.DAY_MAP = ["月", "火", "水", "木", "金", "土", "WS"];

  window.CLASSES_BY_DAY = {
    "月": ["UCCHY初級", "UCCHY中級", "SHINYA", "あすぴ", "K×G中村キッズ", "K×G中村オープン", "K×G長久手"],
    "火": ["SHO-TA", "KIBE初級", "KIBE中級", "MIZUKI", "K×G茶屋ヶ坂"],
    "水": ["NC_スターター","AIRI初級", "AIRI中級", "ruchica", "K×G高針キッズ", "K×G高針オープン"],
    "木": ["SERINAキッズ", "SERINA初中級", "Shogo", "RIN", "心", "K×G瀬戸"],
    "金": ["manaキッズ", "mana初級", "KANAMI", "RYUYA", "SAMURAI"],
    "土": ["幼児", "nikoキッズ", "SAORI", "TAKUEI", "愛梨", "MAHIRO初級", "MAHIRO中級"],
    "WS": ["WS_3/14konoka練習会","WS_3/21キッズ中級”,"WS_3/22キッズ中級"]
  };

  // ===== 共通関数 =====
  window.getTokyoWeekdayLabel = function getTokyoWeekdayLabel() {
    const wd = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      weekday: "short",
    }).format(new Date());

    const map = { Sun: "日", Mon: "月", Tue: "火", Wed: "水", Thu: "木", Fri: "金", Sat: "土" };
    return map[wd] || "月";
  };

  window.escapeHtml = function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  };

  // 曜日ボタン描画（WSだけラベル例外、selectedが青）
  window.renderDayButtons = function renderDayButtons({
    dayButtonsEl,
    selectedDay,
    onSelect,
  }) {
    dayButtonsEl.innerHTML = "";
    window.DAY_MAP.forEach((day) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = day === "WS" ? "WS" : `${day}曜`;
      btn.className = "day-btn" + (day === selectedDay ? " today" : "");
      btn.onclick = () => onSelect(day);
      dayButtonsEl.appendChild(btn);
    });
  };

  // クラス一覧描画
  window.renderClasses = function renderClasses({
    day,
    titleEl,
    containerEl,
    onSubmit,
  }) {
    titleEl.textContent = day === "WS" ? "本日のクラス（WS）" : `本日のクラス（${day}曜日）`;
    containerEl.innerHTML = "";

    const list = window.CLASSES_BY_DAY[day] || [];
    list.forEach((cls) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `受付 ▶ ${cls}`;
      btn.className = "class-btn";
      btn.onclick = () => onSubmit(cls);
      containerEl.appendChild(btn);
    });
  };

  // LIFF init（失敗しても止めない）
  window.initLiffSafe = async function initLiffSafe() {
    try {
      await liff.init({ liffId: window.APP_CONFIG.LIFF_ID });
    } catch (e) {
      // LINE外でも動かす/止めない
    }
  };
})();

window.fetchRemain = async function(member){

  const res = await fetch(
    "https://script.google.com/macros/s/AKfycbxjn3MSpYYdk6Je8SrZlEC0yx7qgcr0374rblaj6kdp95gW8qn19IkdAkW0dWZ7_jQ3/exec?member=" 
    + encodeURIComponent(member)
  );

  return await res.json();

};

window.showRemain = function(data){

  const complete = document.getElementById("complete");
  const completeDetail = document.getElementById("completeDetail");

  completeDetail.innerHTML =
    "<span class='complete-title'>残回数照会</span><br><br>" +
    "会員番号：<b>" + escapeHtml(data.member) + "</b><br>" +
    "コース：<b>" + escapeHtml(data.course) + "</b><br>" +
    "残回数：<b>" + escapeHtml(data.remain) + " 回</b>";

  complete.style.display = "flex";

};

// ===== 残回数取得 =====
window.fetchRemain = async function(member){

  const url =
  "https://script.google.com/macros/s/AKfycbxjn3MSpYYdk6Je8SrZlEC0yx7qgcr0374rblaj6kdp95gW8qn19IkdAkW0dWZ7_jQ3/exec"
  + "?member=" + encodeURIComponent(member);

  const res = await fetch(url);
  return await res.json();

}


// ===== 残回数表示 =====
window.showRemain = function(data){

  const complete = document.getElementById("complete");
  const detail = document.getElementById("completeDetail");

  detail.innerHTML =
  "<span class='complete-title'>残回数</span><br><br>" +
  "コース：<b>"+escapeHtml(data.コース)+"</b><br>" +
  "残り：<b>"+escapeHtml(data.残り)+"回</b>";

  complete.style.display="flex";

}
