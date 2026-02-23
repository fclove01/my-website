const API_PHOTOS_URL = "https://api.lenguyenkiencuong.id.vn/api/photos";

async function loadPhotos() {
    try {
        const response = await fetch(API_PHOTOS_URL);
        const data = await response.json();
        const gallery = document.getElementById('photo-gallery');
        
        gallery.innerHTML = '';
        
        if (data.images.length === 0) {
            gallery.innerHTML = '<p class="text-center text-gray-500 w-full">Chưa có ảnh nào.</p>';
            return;
        }

        data.images.forEach(url => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'masonry-item';
            
            itemDiv.innerHTML = `
                <a href="${url}" class="glightbox" data-gallery="wedding-album">
                    <img src="${url}" alt="Khoảnh khắc Cường & Thảo" loading="lazy">
                </a>
            `;
            gallery.appendChild(itemDiv);
        });

        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,
            openEffect: 'zoom',
            closeEffect: 'fade'
        });
        
    } catch (error) {
        document.getElementById('photo-gallery').innerHTML = "<p class='text-center text-red-500 w-full'>Lỗi tải ảnh! Kiểm tra lại kết nối.</p>";
    }
}

loadPhotos();