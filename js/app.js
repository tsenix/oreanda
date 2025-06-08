(() => {
    "use strict";
    const iframe = document.getElementById("externalContent");
    if (iframe) iframe && window.addEventListener("message", (({origin, data}) => {
        if (origin !== "https://module.roomster.com.ua") return;
        if (data === "scrollToTop") iframe.scrollIntoView(); else if (data?.action === "redirect") window.open(data.url, "_blank"); else iframe.style.height = data + "px";
    }));
    const buttonMenuOpen = document.querySelector(".header__menu-button");
    const buttonMenuClose = document.querySelector(".menu-close");
    const menu = document.querySelector(".menu");
    buttonMenuOpen.addEventListener("click", (() => {
        menu.classList.add("active");
        document.documentElement.classList.add("lock");
    }));
    buttonMenuClose.addEventListener("click", (() => {
        menu.classList.remove("active");
        document.documentElement.classList.remove("lock");
    }));
    const imageItems = document.querySelectorAll(".fond__item-image");
    let currentIndex = 0;
    let popup = null;
    let galleryData = [];
    if (imageItems.length) for (const item of imageItems) item.addEventListener("click", (() => openGallery(item)));
    function openGallery(item) {
        const galleryAttr = item.dataset.gallery;
        if (!galleryAttr) return;
        galleryData = JSON.parse(galleryAttr);
        document.documentElement.classList.add("lock");
        popup = document.createElement("div");
        popup.classList.add("gallery-popup");
        popup.innerHTML = `\n\t\t<div class="gallery-popup__overlay"></div>\n\n\t\t<div class="gallery-popup__content">\n\t\t\t<button class="gallery-popup__close">×</button>\n\t\t\t\n\t\t\t<div class="gallery-popup__image-wrapper">\n\t\t\t\t<img src="${galleryData[currentIndex]}" class="gallery-popup__image" alt="Gallery photo">\n\t\t\t</div>\n\n\t\t\t<div class="gallery-popup__controls">\n\t\t\t\t<button class="gallery-popup__prev gallery-popup__button">←</button>\n\t\t\t\n\t\t\t\t<button class="gallery-popup__next gallery-popup__button">→</button>\n\t\t\t</div>\n\n\t\t\t<div class="gallery-popup__pagination-dots">\n\t\t\t\t${galleryData.map(((_, i) => `<span class="${i === currentIndex ? "active" : ""}"></span>`)).join("")}\n\t\t\t</div>\n\t\t</div>\n\t`;
        document.body.appendChild(popup);
        popup.querySelector(".gallery-popup__close").onclick = closeGallery;
        popup.querySelector(".gallery-popup__overlay").onclick = closeGallery;
        popup.querySelector(".gallery-popup__prev").onclick = () => navigateGallery(-1);
        popup.querySelector(".gallery-popup__next").onclick = () => navigateGallery(1);
        addDotListeners();
    }
    function navigateGallery(direction) {
        currentIndex = (currentIndex + direction + galleryData.length) % galleryData.length;
        const img = popup.querySelector(".gallery-popup__image");
        const dotsContainer = popup.querySelector(".gallery-popup__pagination-dots");
        img.src = galleryData[currentIndex];
        dotsContainer.querySelectorAll("span").forEach(((dot, i) => {
            dot.classList.toggle("active", i === currentIndex);
        }));
    }
    function closeGallery() {
        if (popup) {
            popup.remove();
            popup = null;
            document.documentElement.classList.remove("lock");
        }
    }
    function addDotListeners() {
        const dots = popup.querySelectorAll(".gallery-popup__pagination-dots span");
        dots.forEach(((dot, i) => {
            dot.addEventListener("click", (() => {
                currentIndex = i;
                popup.querySelector(".gallery-popup__image").src = galleryData[currentIndex];
                dots.forEach(((d, j) => d.classList.toggle("active", j === currentIndex)));
            }));
        }));
    }
})();