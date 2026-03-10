window.showCount = function(data){

  const complete = document.getElementById("complete");
  const completeDetail = document.getElementById("completeDetail");

  completeDetail.innerHTML =
    "<span class='complete-title'>受講数照会</span><br><br>" +
    "会員番号：<b>" + window.escapeHtml(data.member) + "</b><br>" +
    "今月受講：<b>" + window.escapeHtml(data.count) + " 回</b><br>" +
    "最終受講：<b>" + window.escapeHtml(data.last) + "</b>";

  // ⭐これが必要
  complete.style.display="flex";

  setTimeout(()=>{
    complete.style.display="none";
  },5000);

};
