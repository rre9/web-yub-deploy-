const searchInput = document.getElementById("autoSearchModal");
const resultsContainer = document.getElementById("searchResults");
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelBtn = document.getElementById('cancelBtn');
const customModal = document.getElementById('customModal');

// فتح المودال
openModalBtn.addEventListener('click', () => {
  customModal.style.display = 'flex';
});

// إغلاق المودال
[closeModalBtn, cancelBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    customModal.style.display = 'none';
    searchInput.value = "";
    resultsContainer.innerHTML = "";
  });
});
searchInput.addEventListener("input", function () {
  const query = this.value.toLowerCase().trim();
  const elements = [...document.querySelectorAll("p, a, div, span, h1, h2, h3, h4, h5, h6")];
  const displayedTexts = new Set();
  resultsContainer.innerHTML = "";

  if (query === "") return;

  elements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const isHidden = window.getComputedStyle(el).display === "none";

    if (
      isHidden ||
      ["script", "style", "noscript", "meta", "link"].includes(tag)
    ) return;

    el.childNodes.forEach((node) => {
      if (
        node.nodeType === Node.TEXT_NODE && // يعني نص مباشر داخل العنصر
        node.textContent.toLowerCase().includes(query)
      ) {
        const cleanText = node.textContent.trim();
        if (cleanText && !displayedTexts.has(cleanText)) {
          displayedTexts.add(cleanText);

          const result = document.createElement("div");
          result.textContent = cleanText;

          Object.assign(result.style, {
            borderBottom: "1px solid #ccc",
            padding: "8px 0",
            cursor: "pointer",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: "2",
            WebkitBoxOrient: "vertical",
            lineHeight: "1.2em",
            maxHeight: "2.4em",
          });

          result.addEventListener("click", () => {
            el.scrollIntoView({ behavior: "smooth", block: "center" });
            el.style.backgroundColor = "yellow";
            setTimeout(() => (el.style.backgroundColor = ""), 2000);
            resultsContainer.innerHTML = "";
            customModal.style.display = "none";
            searchInput.value = "";
          });

          resultsContainer.appendChild(result);
        }
      }
    });
  });
});




