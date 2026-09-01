// ============================================================
// 設定
// ============================================================
// 問い合わせフォームのURL(Tally)
const FORM_URL = "https://tally.so/r/1Aabkg";

// このLPで見せる会話デモ（宿泊者の質問例に基づく）
const DEMO_CONVERSATION = [
  { role: "guest", text: "Wi-Fiのパスワード教えて" },
  { role: "ai", text: "Wi-Fi名は「Sunny201」です。パスワードは「welcome2024」です。" },
  { role: "guest", text: "チェックアウトは？" },
  { role: "ai", text: "午前10時までです。鍵は玄関横のキーボックスへ戻してください。" },
  { role: "guest", text: "近くにコンビニありますか？" },
  { role: "ai", text: "徒歩3分の場所にセブンイレブンがあります。Google Mapsはこちらです。詳しい道順はハウスマニュアルの周辺地図もご覧ください。" },
];

// ============================================================
// FORM_URL を該当リンクへ反映
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('a[href="FORM_URL"]').forEach((el) => {
    el.setAttribute("href", FORM_URL);
  });

  initChatDemo();
  initTracking();
});

// ============================================================
// チャットデモ：吹き出しを順番に表示する
// ============================================================
function initChatDemo() {
  const container = document.getElementById("demoChat");
  if (!container) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let hasPlayed = false;

  const playDemo = () => {
    if (hasPlayed) return;
    hasPlayed = true;
    container.innerHTML = "";

    DEMO_CONVERSATION.forEach((turn, i) => {
      const bubble = document.createElement("div");
      bubble.className = `demo-msg demo-msg--${turn.role === "guest" ? "guest" : "ai"}`;

      const tag = document.createElement("span");
      tag.className = "demo-msg-tag";
      tag.textContent = turn.role === "guest" ? "Guest" : "AI";

      const body = document.createElement("span");
      body.textContent = turn.text;

      bubble.appendChild(tag);
      bubble.appendChild(body);

      if (prefersReducedMotion) {
        bubble.style.opacity = "1";
        bubble.style.animation = "none";
      } else {
        bubble.style.animationDelay = `${i * 0.55}s`;
      }
      container.appendChild(bubble);
    });
  };

  if (prefersReducedMotion) {
    playDemo();
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          playDemo();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(container);
}

// ============================================================
// 計測：CTAクリック / フォーム遷移を Google Analytics に送る
// gtag が読み込まれていない場合は何もしない（安全に無視）
// ============================================================
function initTracking() {
  document.querySelectorAll("[data-track]").forEach((el) => {
    el.addEventListener("click", () => {
      const eventName = el.getAttribute("data-track");
      if (typeof window.gtag === "function") {
        window.gtag("event", eventName, {
          event_category: "engagement",
          event_label: el.textContent.trim(),
        });
      }
      // Google Ads コンバージョン計測を行う場合はここに send_to を追加
      // 例:
      // if (eventName === "cta_form_submit" && typeof window.gtag === "function") {
      //   window.gtag("event", "conversion", { send_to: "AW-XXXXXXXXX/XXXXXXXX" });
      // }
    });
  });
}
