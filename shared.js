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
    "WS":["WS_3/21キッズ中級","WS_3/22キッズ中級"]
  };

  // ===== 今日の曜日 =====
  window.getTokyoWeekdayLabel = function(){
    const wd = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Tokyo",
      weekday: "short",
    }).format(new Date());

    const map = {
      Sun:"日", Mon:"月", Tue:"火", Wed:"水",
      Thu:"木", Fri:"金", Sat:"土"
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

  // ===== 会員番号整形 =====
  window.normalizeMember = function(value){
    let s = String(value || "").trim();

    try{
      if(/^https?:/i.test(s)){
        const u = new URL(s);
        s = u.searchParams.get("member") || s;
      }
    }catch(e){}

    try{
      s = decodeURIComponent(s);
    }catch(e){}

    s = s.split("?")[0].trim();
    s = s.replace(/[^\d]/g, "");

    return s;
  };

  // ===== 曜日ボタン =====
  window.renderDayButtons = function({ dayButtonsEl, selectedDay, onSelect }){
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

  // ===== 確認UI =====
  window.showSelectionConfirm = function({ member, selectedClasses, duplicateClasses }){
    return new Promise((resolve) => {

      const old = document.getElementById("selectionConfirmOverlay");
      if(old) old.remove();

      const overlay = document.createElement("div");
      overlay.id = "selectionConfirmOverlay";
      overlay.style.position = "fixed";
      overlay.style.inset = "0";
      overlay.style.background = "rgba(0,0,0,0.65)";
      overlay.style.display = "flex";
      overlay.style.alignItems = "center";
      overlay.style.justifyContent = "center";
      overlay.style.zIndex = "9999";

      const box = document.createElement("div");
      box.style.background = "#fff";
      box.style.padding = "36px 22px";
      box.style.borderRadius = "18px";
      box.style.textAlign = "center";
      box.style.width = "92%";
      box.style.maxWidth = "560px";
      box.style.boxSizing = "border-box";
      box.style.lineHeight = "1.6";

      let html =
        "<div style='font-size:44px;font-weight:800;margin-bottom:18px;'>受付確認</div>" +
        "会員番号：<b style='font-size:38px;'>" + window.escapeHtml(member) + "</b><br><br>" +
        "<div style='font-size:24px;text-align:left;display:inline-block;'>" +
        selectedClasses.map(c => "・" + window.escapeHtml(c)).join("<br>") +
        "</div>";

      if(duplicateClasses.length > 0){
        html +=
          "<br><br><div style='font-size:22px;color:#d9534f;font-weight:700;'>⚠️ すでに受付済みの可能性あり</div>" +
          "<div style='font-size:22px;text-align:left;display:inline-block;margin-top:8px;'>" +
          duplicateClasses.map(c => "・" + window.escapeHtml(c)).join("<br>") +
          "</div>";
      }

      html +=
        "<div style='display:flex;gap:14px;margin-top:26px;'>" +
        "<button id='selectionConfirmCancel' style='flex:1;font-size:30px;padding:20px;border:none;border-radius:12px;background:#ddd;color:#000;font-weight:700;'>戻る</button>" +
        "<button id='selectionConfirmOk' style='flex:1;font-size:30px;padding:20px;border:none;border-radius:12px;background:#66adff;color:#fff;font-weight:700;'>受付する</button>" +
        "</div>";

      box.innerHTML = html;
      overlay.appendChild(box);
      document.body.appendChild(overlay);

      document.getElementById("selectionConfirmCancel").onclick = () => {
        overlay.remove();
        resolve(false);
      };

      document.getElementById("selectionConfirmOk").onclick = () => {
        overlay.remove();
        resolve(true);
      };

    });
  };

  // ===== クラス描画（複数選択対応） =====
  window.renderClasses = function({ day, titleEl, containerEl, onSubmit }){

    titleEl.textContent =
      day === "WS"
        ? "本日のクラス（WS）"
        : `本日のクラス（${day}曜日）`;

    containerEl.innerHTML = "";

    const list = window.CLASSES_BY_DAY[day] || [];
    const selectedClasses = [];

    const selectedBox = document.createElement("div");
    selectedBox.style.fontSize = "24px";
    selectedBox.style.margin = "12px 0 20px";
    selectedBox.style.lineHeight = "1.6";

    const confirmBtn = document.createElement("button");
    confirmBtn.type = "button";
    confirmBtn.textContent = "選択したクラスを確認";
    confirmBtn.className = "remain-btn";
    confirmBtn.style.display = "none";

    function refreshSelectedView(){
      if(selectedClasses.length === 0){
        selectedBox.innerHTML = "";
        confirmBtn.style.display = "none";
        return;
      }

      selectedBox.innerHTML =
        "<b>選択中：</b><br>" +
        selectedClasses.map(c => "・" + window.escapeHtml(c)).join("<br>");

      confirmBtn.style.display = "block";
    }

    function toggleClass(btn, cls){
      const idx = selectedClasses.indexOf(cls);

      if(idx >= 0){
        selectedClasses.splice(idx, 1);
        btn.style.opacity = "1";
        btn.style.background = "";
        btn.style.color = "";
        btn.style.fontWeight = "";
      }else{
        selectedClasses.push(cls);
        btn.style.opacity = "1";
        btn.style.background = "#66adff";
        btn.style.color = "#fff";
        btn.style.fontWeight = "bold";
      }

      refreshSelectedView();
    }

    list.forEach((cls) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `受付 ▶ ${cls}`;
      btn.className = "class-btn";

      btn.onclick = () => {
        toggleClass(btn, cls);
      };

      containerEl.appendChild(btn);
    });

    containerEl.appendChild(selectedBox);
    containerEl.appendChild(confirmBtn);

    confirmBtn.onclick = async () => {
      const member = window.normalizeMember(window.currentMember);

      if(!member){
        alert("会員番号が取得できていません");
        return;
      }

      if(selectedClasses.length === 0){
        alert("クラスを選択してください");
        return;
      }

      const duplicateClasses = [];

      for(const cls of selectedClasses){
        const isDup = await window.checkDuplicate(member, cls);
        if(isDup){
          duplicateClasses.push(cls);
        }
      }

      const ok = await window.showSelectionConfirm({
        member,
        selectedClasses,
        duplicateClasses
      });

      if(!ok) return;

      onSubmit(selectedClasses.slice());
    };
  };

  // ===== LIFF初期化 =====
  window.initLiffSafe = async function(){
    try{
      if(typeof liff !== "undefined"){
        await liff.init({ liffId: window.APP_CONFIG.LIFF_ID });
      }
    }catch(e){
      console.log("LIFF init error:", e);
    }
  };

  // ===== 照会中表示 =====
  window.showLoading = function(){
    const complete = document.getElementById("complete");
    const completeDetail = document.getElementById("completeDetail");

    if(!complete || !completeDetail) return;

    completeDetail.innerHTML =
      "<span class='complete-title'>受講数照会</span><br><br>" +
      "照会中…";

    complete.style.display = "flex";
  };

  // ===== 受講数表示 =====
  window.showCount = function(data){
    const complete = document.getElementById("complete");
    const completeDetail = document.getElementById("completeDetail");

    if(!complete || !completeDetail) return;

    completeDetail.innerHTML =
      "<span class='complete-title'>受講数照会</span><br><br>" +
      "会員番号：<b>" + window.escapeHtml(data.member) + "</b><br>" +
      "今月受講：<b>" + window.escapeHtml(data.count) + " 回</b><br>" +
      "最終受講：<b>" + window.escapeHtml(data.last) + "</b>";

    complete.style.display = "flex";

    setTimeout(() => {
      complete.style.display = "none";
    }, 5000);
  };

  // ===== 受講数取得 =====
  window.fetchCount = async function(member){

    const cleanMember = window.normalizeMember(member);

    const now = new Date();
    const ym =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0");

    const key = cleanMember + "_" + ym;

    const url =
      "https://docs.google.com/spreadsheets/d/1Ufestn2VpThowSbCte97Ol60ZIX1ulKg9DLqhejkHwM/gviz/tq?tqx=out:json&gid=879977678" +
      "&tq=" +
      encodeURIComponent("select C,D where E='" + key + "'");

    try{
      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(
        text.substring(
          text.indexOf("{"),
          text.lastIndexOf("}") + 1
        )
      );

      const rows = json.table?.rows || [];

      if(rows.length > 0){
        const count = Number(rows[0].c[0]?.v || 0);

        let last = "";
        if(rows[0].c[1]?.f){
          const f = rows[0].c[1].f;
          const parts = f.split(" ")[0].split("/");
          last = Number(parts[1]) + "/" + Number(parts[2]);
        }

        return {
          member: cleanMember,
          count: count,
          last: last
        };
      }

    }catch(e){
      console.log("fetchCount error:", e);
    }

    return {
      member: cleanMember,
      count: 0,
      last: ""
    };
  };

  // ===== 二重受付チェック =====
  window.checkDuplicate = async function(member, className){

    const cleanMember = window.normalizeMember(member);

    const now = new Date();
    const today =
      now.getFullYear() + "-" +
      String(now.getMonth() + 1).padStart(2, "0") + "-" +
      String(now.getDate()).padStart(2, "0");

    const url =
      "https://docs.google.com/spreadsheets/d/1Ufestn2VpThowSbCte97Ol60ZIX1ulKg9DLqhejkHwM/gviz/tq?tqx=out:json&gid=0";

    try{
      const res = await fetch(url);
      const text = await res.text();

      const json = JSON.parse(
        text.replace("/*O_o*/","")
            .replace("google.visualization.Query.setResponse(","")
            .slice(0,-2)
      );

      const rows = json.table?.rows || [];

      for(const r of rows){
        const m = String(r.c[1]?.v || "").trim();
        const cls = String(r.c[2]?.v || "").trim();

        const rawDate = r.c[3]?.v;
        let date = "";

        if(rawDate instanceof Date){
          date =
            rawDate.getFullYear() + "-" +
            String(rawDate.getMonth() + 1).padStart(2, "0") + "-" +
            String(rawDate.getDate()).padStart(2, "0");
        }else{
          date = String(rawDate || "").trim();
        }

        if(m === cleanMember && cls === className && date === today){
          return true;
        }
      }

      return false;

    }catch(e){
      return false;
    }
  };

})();
