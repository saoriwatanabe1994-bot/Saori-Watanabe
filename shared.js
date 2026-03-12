(() => {

  // ===== 共通設定 =====
  window.APP_CONFIG = {
    LIFF_ID: "2008912129-TQRCpL9d",
    FORM_RESPONSE:
      "https://docs.google.com/forms/d/e/1FAIpQLSfZeKs2ZPJ0iIOxg6L7UZUr7fUmZy-E5OwA7aq93Uu7VaysBA/formResponse",
    ENTRY_MEMBER: "entry.71375240",
    ENTRY_CLASS: "entry.403922703",
  };

  // ===== 共通データ =====
  window.DAY_MAP = ["月","火","水","木","金","土","WS"];

  window.CLASSES_BY_DAY = {
    "月":["UCCHY初級","UCCHY中級","SHINYA","あすぴ","K×G中村キッズ","K×G中村オープン","K×G長久手"],
    "火":["SHO-TA","KIBE初級","KIBE中級","MIZUKI","K×G茶屋ヶ坂"],
    "水":["NC_スターター","AIRI初級","AIRI中級","ruchica","K×G高針キッズ","K×G高針オープン"],
    "木":["SERINAキッズ","SERINA初中級","Shogo","RIN","心","K×G瀬戸"],
    "金":["manaキッズ","mana初級","KANAMI","RYUYA","SAMURAI"],
    "土":["幼児","nikoキッズ","SAORI","TAKUEI","愛梨","MAHIRO初級","MAHIRO中級"],
    "WS":["WS_3/14konoka練習会","WS_3/21キッズ中級","WS_3/22キッズ中級"]
  };

  // ===== 今日の曜日 =====
  window.getTokyoWeekdayLabel = function(){

    const wd = new Intl.DateTimeFormat("en-US",{
      timeZone:"Asia/Tokyo",
      weekday:"short",
    }).format(new Date());

    const map = {
      Sun:"日",
      Mon:"月",
      Tue:"火",
      Wed:"水",
      Thu:"木",
      Fri:"金",
      Sat:"土"
    };

    return map[wd] || "月";
  };

  // ===== HTMLエスケープ =====
  window.escapeHtml = function(str){
    return String(str)
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  };

  // ===== 曜日ボタン =====
  window.renderDayButtons = function({
    dayButtonsEl,
    selectedDay,
    onSelect
  }){

    dayButtonsEl.innerHTML="";

    window.DAY_MAP.forEach((day)=>{

      const btn=document.createElement("button");

      btn.type="button";
      btn.textContent=day==="WS"?"WS":`${day}曜`;
      btn.className="day-btn"+(day===selectedDay?" today":"");

      btn.onclick=()=>onSelect(day);

      dayButtonsEl.appendChild(btn);

    });

  };

  // ===== クラス描画 =====
  window.renderClasses = function({
    day,
    titleEl,
    containerEl,
    onSubmit
  }){

    titleEl.textContent =
      day==="WS"
      ? "本日のクラス（WS）"
      : `本日のクラス（${day}曜日）`;

    containerEl.innerHTML="";

    const list = window.CLASSES_BY_DAY[day] || [];

    list.forEach((cls)=>{

      const btn=document.createElement("button");

      btn.type="button";
      btn.textContent=`受付 ▶ ${cls}`;
      btn.className="class-btn";

      btn.onclick=()=>onSubmit(cls);

      containerEl.appendChild(btn);

    });

  };

  // ===== LIFF初期化 =====
  window.initLiffSafe = async function(){

    try{
      await liff.init({liffId:window.APP_CONFIG.LIFF_ID});
    }
    catch(e){
      // LINE外でも止めない
    }

  };

// ===== 受講数取得 =====
window.fetchCount = async function(member){

  const ym = new Date().toISOString().slice(0,7);
  const key = member + "_" + ym;

  const url =
  "https://docs.google.com/spreadsheets/d/1Ufestn2VpThowSbCte97Ol60ZIX1ulKg9DLqhejkHwM/gviz/tq?tqx=out:json&tq=" +
  encodeURIComponent("select C,D where E='" + key + "'") +
  "&sheet=照会用";

  const res = await fetch(url);
  const text = await res.text();

  const json = JSON.parse(text.substring(47).slice(0,-2));

  const rows = json.table.rows;

 if(rows.length > 0){

  const count = rows[0].c[0]?.v || 0;

  let last = "";

  if(rows[0].c[1]?.f){

    const f = rows[0].c[1].f; // "2026/02/23 16:54:19"

    const parts = f.split(" ")[0].split("/");

    last = Number(parts[1]) + "/" + Number(parts[2]);

  }

  return {
    member: member,
    count: count,
    last: last
  };

}
  // ===== 照会中 =====
  window.showLoading = function(){

    const complete=document.getElementById("complete");
    const completeDetail=document.getElementById("completeDetail");

    completeDetail.innerHTML=
      "<span class='complete-title'>受講数照会</span><br><br>"+
      "照会中…";

    complete.style.display="flex";

  };

  // ===== 受講数表示 =====
  window.showCount = function(data){

    const complete=document.getElementById("complete");
    const completeDetail=document.getElementById("completeDetail");

    completeDetail.innerHTML=
      "<span class='complete-title'>受講数照会</span><br><br>"+
      "会員番号：<b>"+window.escapeHtml(data.member)+"</b><br>"+
      "今月受講：<b>"+window.escapeHtml(data.count)+" 回</b><br>"+
      "最終受講：<b>"+window.escapeHtml(data.last)+"</b>";

    complete.style.display="flex";

    setTimeout(()=>{
      complete.style.display="none";
    },5000);

  };

})();
