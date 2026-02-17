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
    "WS": ["WS_2/1キッズ中級", "WS_2/15キッズ中級","WS_2/7cocona練習会","WS_2/14cocona練習会","WS_2/21Rena練習会","WS_2/27Rena練習会","WS_3/7konoka練習会","WS_3/14konoka練習会"]
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
