const API_PHOTOS_URL = "https://api.lenguyenkiencuong.id.vn/api/photos";
let allImages = { wedding: [], love: [], guest: [] };
let currentLightbox = null;

// Gọi API 1 lần duy nhất khi mở trang
async function fetchAllPhotos() {
    try {
        const response = await fetch(API_PHOTOS_URL);
        const data = await response.json();
        if (data.status === "success") {
            allImages = data.images;
            switchTab('wedding'); // Mặc định mở tab Ảnh Cưới đầu tiên
        }
    } catch (error) {
        document.getElementById('photo-gallery').innerHTML = "<p class='text-center text-red-500 w-full'>Lỗi kết nối. Vui lòng tải lại trang.</p>";
    }
}

// Hàm chuyển đổi Tab
function switchTab(category) {
    // Đổi màu nút bấm (Active / Inactive)
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.className = "tab-btn px-2 py-2 font-serif text-lg md:text-xl text-gray-400 hover:text-gray-800 transition border-b-2 border-transparent";
    });
    const activeBtn = document.getElementById(`btn-${category}`);
    activeBtn.className = "tab-btn px-2 py-2 font-serif text-lg md:text-xl text-[#d4af37] border-b-2 border-[#d4af37] transition";

    // Đổ HTML ảnh tương ứng vào khung
    const gallery = document.getElementById('photo-gallery');
    const imagesToRender = allImages[category];

    if (imagesToRender.length === 0) {
        gallery.innerHTML = '<p class="text-center text-gray-500 w-full mt-10">Chưa có ảnh nào trong mục này.</p>';
        return;
    }

    gallery.innerHTML = imagesToRender.map(url => `
        <div class="masonry-item">
            <a href="${url}" class="glightbox" data-gallery="${category}-gallery">
                <img src="${url}" loading="lazy" class="w-full rounded-lg object-cover hover:scale-[1.02] transition">
            </a>
        </div>
    `).join('');

    // Hủy Lightbox cũ (nếu có) và khởi tạo lại cái mới cho bộ ảnh mới
    if (currentLightbox) { currentLightbox.destroy(); }
    currentLightbox = GLightbox({ touchNavigation: true, loop: true, openEffect: 'zoom', closeEffect: 'fade' });
}

// Khởi động
fetchAllPhotos();