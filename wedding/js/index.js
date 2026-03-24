
const weddingDate = new Date("April 19, 2026 11:30:00").getTime();
const countdownTimer = setInterval(() => {
    const now = new Date().getTime();
    const distance = weddingDate - now;
    if (distance < 0) {
        clearInterval(countdownTimer);
        document.getElementById("countdown").innerHTML = "<h2 class='text-3xl font-serif'>Đã đến ngày chung đôi!</h2>";
        return;
    }
    document.getElementById("days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
    document.getElementById("hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
    document.getElementById("minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
    document.getElementById("seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');
}, 1000);

const API_URL = "https://api.lenguyenkiencuong.id.vn/api/guestbook"; 
const form = document.getElementById('guestbook-form');
const entriesContainer = document.getElementById('guestbook-entries');
const submitBtn = form.querySelector('button[type="submit"]');



// Hàm lấy và hiển thị lời chúc
let globalIndexEntries = [];
async function loadEntries(maxEntries) {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Lỗi kết nối Server");
        
        const allEntries = await response.json();
        
        entriesContainer.innerHTML = '';
        const recentEntries = allEntries.slice(0, maxEntries);
        
        globalIndexEntries = recentEntries; 

        recentEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
            
            entryDiv.className = `paper-style p-6 pt-8 rounded-sm ${rotation} hover:z-10 transition-transform duration-300 flex flex-col`;
            
            const lines = entry.message.split('\n').length;
            const isLong = entry.message.length > 200 || lines > 8;

            let images = [];
            if (entry.image_url) {
                if (typeof entry.image_url === 'string') {
                    images = entry.image_url.split(',').map(img => img.trim()).filter(Boolean);
                } else if (Array.isArray(entry.image_url)) {
                    images = entry.image_url;
                }
            }

            let imgHTML = '';
            if (images.length > 0) {
                const imgElements = images.map((imgSrc, i) => {
                    const rotations = ['-rotate-3', 'rotate-2', '-rotate-6', 'rotate-4', '-rotate-1'];
                    const offsets = ['top-0 left-0', 'top-3 left-3', 'top-5 -left-2', '-top-2 left-4', 'top-4 left-5'];
                    
                    const rot = images.length > 1 ? rotations[i % rotations.length] : '-rotate-2';
                    const offset = images.length > 1 ? offsets[i % offsets.length] : 'top-0 left-0';
                    
                    return `
                        <a href="${imgSrc}" class="glightbox polaroid absolute ${offset} w-full ${rot} hover:!z-50 hover:scale-105 hover:!rotate-0 transition-all cursor-pointer duration-300 shadow-md hover:shadow-2xl origin-center" 
                           style="z-index: ${10 + i};" 
                           data-gallery="gallery-index-${index}">
                            <img src="${imgSrc}" alt="Kỷ niệm" class="w-full h-48 object-cover">
                            ${images.length > 1 ? `<div class="absolute bottom-2 right-4 text-xs text-gray-400 font-sans font-medium">${i + 1}/${images.length}</div>` : ''}
                        </a>
                    `;
                }).join('');

                imgHTML = `<div class="relative w-4/5 mx-auto h-72 mt-8 mb-2">${imgElements}</div>`;
            }

            entryDiv.innerHTML = `
                <div class="washi-tape"></div>
                
                <div class="flex-grow">
                    <p class="font-lavishly text-2xl text-gray-700 whitespace-pre-line leading-[38px] ${isLong ? 'line-clamp-5' : 'min-h-[64px]'}">
                        "${entry.message}"
                    </p>
                    ${isLong ? `<button class="read-more-btn text-wedding-accent mt-2 text-sm italic hover:underline font-sans font-semibold" data-index="${index}">Xem đầy đủ...</button>` : ''}
                </div>

                <h4 class="font-lavishly text-2xl font-bold text-wedding-dark mt-4 text-right">
                    - ${entry.name} -
                </h4>
                
                ${imgHTML}
                
                <p class="text-xs text-gray-400 mt-6 text-right font-sans">${entry.date}</p>
            `;
            entriesContainer.appendChild(entryDiv);
        });

        const viewAllBtn = document.getElementById('view-all-guestbook');
        if (allEntries.length > 6) {
            viewAllBtn.classList.remove('hidden');
        } else {
            viewAllBtn.classList.add('hidden');
        }

        if (window.mainLightbox) {
            window.mainLightbox.reload();
        } else {
            window.mainLightbox = GLightbox({ touchNavigation: true, loop: true, openEffect: 'zoom', closeEffect: 'fade' });
        }

    } catch (error) {
        console.error("Lỗi khi tải sổ lưu bút:", error);
    }
}

const maxEntries = 6;
loadEntries(maxEntries);

function openMessageModal(index) {
    const entry = globalIndexEntries[index];
    document.getElementById('modalMessage').innerText = `"${entry.message}"`;
    document.getElementById('modalName').innerText = `- ${entry.name} -`;
    document.getElementById('modalDate').innerText = entry.date;
    
    document.getElementById('messageModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeMessageModal() {
    document.getElementById('messageModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

document.getElementById('closeMsgBtn')?.addEventListener('click', closeMessageModal);
document.getElementById('messageModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeMessageModal();
});
document.addEventListener('keydown', function(e) {
    if (document.getElementById('messageModal') && !document.getElementById('messageModal').classList.contains('hidden') && e.key === 'Escape') {
        closeMessageModal();
    }
});
document.getElementById('guestbook-entries')?.addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more-btn')) {
        const index = e.target.getAttribute('data-index');
        openMessageModal(index);
    }
});

const MAX_IMAGES = 5; 

const fileInput = document.getElementById('gb-image');

if (fileInput) {
    fileInput.addEventListener('change', function(e) {
        if (this.files.length > MAX_IMAGES) {
            Swal.fire({
                icon: 'info',
                title: 'Úi, nhiều ảnh quá!',
                text: 'Gửi 5 tấm thui, chọn tấm nào đẹp đẹp gửi nha, còn lại bắn qua Zalo cho tui đi! 😂',
                confirmButtonText: 'Oke luôn',
                confirmButtonColor: '#d4af37', 
                backdrop: `rgba(0,0,0,0.6)`
            });
            this.value = '';
        }
    });
}


form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Đang xử lý ảnh..."; 
    submitBtn.disabled = true;

    try {
        const imageFiles = document.getElementById('gb-image').files;
        let uploadedUrls = [];  
        if (imageFiles.length > 0) {
            
            const uploadPromises = Array.from(imageFiles).map(async (file) => {
                try {
                    const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
                    const compressedFile = await imageCompression(file, options);
                    
                    const imgData = new FormData();
                    imgData.append("image", compressedFile, compressedFile.name.replace(/[^a-zA-Z0-9.]/g, "_"));
                    
                    const uploadRes = await fetch("https://api.lenguyenkiencuong.id.vn/api/upload", {
                        method: "POST", body: imgData
                    });
                    
                    const uploadResult = await uploadRes.json();
                    if (uploadResult.status === "success") return uploadResult.url;
                    return null;
                } catch (err) {
                    console.error("Lỗi nén/upload file:", err);
                    return null;
                }
            });

            const results = await Promise.all(uploadPromises);
            uploadedUrls = results.filter(url => url !== null);
        }

        submitBtn.innerHTML = "Đang đóng gói yêu thương...";
        
        const finalData = new FormData();
        finalData.append("name", document.getElementById('gb-name').value);
        finalData.append("message", document.getElementById('gb-message').value);
        if (uploadedUrls.length > 0) finalData.append("image_urls", uploadedUrls.join(','));

        const response = await fetch("https://api.lenguyenkiencuong.id.vn/api/guestbook", { 
            method: "POST", body: finalData 
        });
        const result = await response.json();

        if (result.status === "success") {
            Swal.fire({
                title: 'Cảm ơn bạn!',
                text: 'Lời chúc đã được gửi đi và đang chờ Cường & Thảo xem qua nhé ❤️',
                icon: 'success',
                confirmButtonColor: '#d4af37',
                confirmButtonText: 'Tuyệt vời'
            });
            form.reset();
            const labelSpan = document.getElementById('gb-image').parentElement.querySelector('span');
            labelSpan.innerText = 'Đính kèm ảnh';
            labelSpan.parentElement.classList.remove('text-wedding-dark', 'font-semibold');
        } else {
            throw new Error("Lỗi từ máy chủ");
        }
    } catch (error) {
        Swal.fire({
            title: 'Ôi hỏng!',
            text: 'Mạng có vẻ yếu. Bạn thử lại nha!',
            icon: 'error',
            confirmButtonColor: '#2c2c2c',
            confirmButtonText: 'Đóng'
        });
    } finally {
        submitBtn.innerHTML = "Gửi Yêu Thương";
        submitBtn.disabled = false;
    }
});


const imageInput = document.getElementById('gb-image');
imageInput.addEventListener('change', function(e) {
    const files = e.target.files;
    const labelSpan = imageInput.parentElement.querySelector('span'); 
    
    if (files.length > 0) {
        labelSpan.innerText = `Đã chọn ${files.length} ảnh`; // Báo số lượng ảnh
        labelSpan.parentElement.classList.add('text-wedding-dark', 'font-semibold');
    } else {
        labelSpan.innerText = 'Đính kèm ảnh';
        labelSpan.parentElement.classList.remove('text-wedding-dark', 'font-semibold');
    }
});

async function loadDynamicSliders() {
    try {
        const res = await fetch("https://api.lenguyenkiencuong.id.vn/api/photos");
        const data = await res.json();

        if (data.status === "success") {
            const randomWedding = data.images.wedding.sort(() => 0.5 - Math.random()).slice(0, 10);
            const randomLove = data.images.love.sort(() => 0.5 - Math.random()).slice(0, 10);

            const weddingWrapper = document.getElementById('slider-wedding-wrapper');
            weddingWrapper.innerHTML = randomWedding.map(url => `
                <div class="swiper-slide w-80">
                    <a href="${url}" class="glightbox" data-gallery="anh-cuoi">
                        <img src="${url}" class="w-80 h-96 object-cover rounded-xl cursor-pointer">
                    </a>
                </div>
            `).join('');

            const loveWrapper = document.getElementById('slider-love-wrapper');
            loveWrapper.innerHTML = randomLove.map(url => `
                <div class="swiper-slide w-80">
                    <a href="${url}" class="glightbox" data-gallery="luc-yeu-nhau">
                        <img src="${url}" class="w-80 h-96 object-cover rounded-xl cursor-pointer">
                    </a>
                </div>
            `).join('');

            new Swiper(".loveSwiper", {
                slidesPerView: "auto", spaceBetween: 20, freeMode: true, loop: true,
                autoplay: { delay: 2500, disableOnInteraction: false }
            });

            new Swiper(".weddingSwiper", {
                slidesPerView: "auto", spaceBetween: 20, freeMode: true, loop: true,
                autoplay: { delay: 3500, disableOnInteraction: false, reverseDirection: true }
            });

            GLightbox({ touchNavigation: true, loop: true, openEffect: 'zoom', closeEffect: 'fade' });
        }
    } catch (e) {
        console.error("Lỗi tải ảnh slider:", e);
    }
}

loadDynamicSliders();

