const EXTENSION_ID = "fcbemldagpjfajbaldealnjcnpdmcebc"; // Điền ID extension ở đây nếu cần
const FILE_URL = "https://drive.google.com/uc?export=download&id=17CKkQRTQhHsxZ5nGrZtpdQrEbapr2f_6"; // Link trực tiếp

async function fetchKeywords() {
  const res = await fetch(FILE_URL);
  const text = await res.text();
  return text.split("\n").filter(Boolean);
}

function getRandomUnusedIndex(keywords, usedIndexes) {
  if (usedIndexes.length / keywords.length > 0.95) {
    chrome.storage.local.set({ usedLines: [] });
    usedIndexes = [];
    console.log("Reset usedLines");
  }

  let idx;
  do {
    idx = Math.floor(Math.random() * keywords.length);
  } while (usedIndexes.includes(idx) && usedIndexes.length < keywords.length);
  return idx;
}

document.getElementById("start").addEventListener("click", async () => {
  document.getElementById("status").innerText = "Loading...";
  const keywords = await fetchKeywords();

  chrome.storage.local.get(["usedLines"], (data) => {
    let used = data.usedLines || [];
    const idx = getRandomUnusedIndex(keywords, used);
    const keyword = keywords[idx];

    used.push(idx);
    chrome.storage.local.set({ usedLines: used });

    chrome.runtime.sendMessage(EXTENSION_ID, { action: "startSearch", keyword }, (response) => {
      document.getElementById("status").innerText = "Sent: " + keyword;
    });
  });
});
