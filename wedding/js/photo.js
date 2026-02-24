const API_PHOTOS_URL = "https://api.lenguyenkiencuong.id.vn/api/photos";

let allImages = {
    wedding: [],
    love: [],
    guest: []
};

let currentLightbox = null;

// Fetch toàn bộ ảnh 1 lần khi load
async function fetchAllPhotos() {
    const gallery = document.getElementById('photo-gallery');
    const loader = document.getElementById('loader');

    try {
        const response = await fetch(API_PHOTOS_URL);
        const data = await response.json();

        if (data.status === "success" && data.images) {
            allImages = data.images;
            switchTab('love');
        } else {
            gallery.innerHTML = `<div class="loader">Không có dữ liệu ảnh.</div>`;
        }

    } catch (error) {
        gallery.innerHTML = `<div class="loader">Lỗi kết nối. Vui lòng tải lại trang.</div>`;
    }
}


// Chuyển tab
function switchTab(category) {

    // Đổi active button
    document.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.remove("active");
    });

    const activeBtn = document.getElementById(`btn-${category}`);
    if (activeBtn) activeBtn.classList.add("active");

    const gallery = document.getElementById('photo-gallery');
    const imagesToRender = allImages[category] || [];

    if (imagesToRender.length === 0) {
        gallery.innerHTML = `<div class="loader">Chưa có ảnh nào trong mục này.</div>`;
        return;
    }

    gallery.innerHTML = imagesToRender.map(url => `
        <div class="gallery-item">
            <a href="${url}" class="glightbox" data-gallery="${category}">
                <img src="${url}" loading="lazy" alt="photo">
            </a>
        </div>
    `).join('');

    // Reset Lightbox
    if (currentLightbox) {
        currentLightbox.destroy();
    }

    currentLightbox = GLightbox({
        selector: '.glightbox',
        touchNavigation: true,
        loop: true,
        openEffect: 'zoom',
        closeEffect: 'fade'
    });
}


// Khởi động
document.addEventListener("DOMContentLoaded", fetchAllPhotos);