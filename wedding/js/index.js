
// 1. Logic Đồng hồ đếm ngược
const weddingDate = new Date("April 19, 2026 09:00:00").getTime();
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

// Hàm lấy và hiển thị lời chúc (Tối đa 6 cái mới nhất)
async function loadEntries() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Lỗi kết nối Server");
        const allEntries = await response.json();
        
        entriesContainer.innerHTML = '';
        
        // Lấy 6 cái mới nhất
        const recentEntries = allEntries.slice(0, 6);
        
        recentEntries.forEach((entry, index) => {
            const entryDiv = document.createElement('div');
            const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
            
            entryDiv.className = `paper-style p-6 pt-8 rounded-sm ${rotation} hover:z-10 transition-transform duration-300`;
            
            let imgHTML = '';
            if (entry.image_url) {
                const urls = entry.image_url.split(','); // Tách các link ảnh
                if (urls.length === 1) {
                    imgHTML = `<div class="mt-6 flex justify-center"><img src="${urls[0]}" class="polaroid max-h-64 object-cover w-4/5"></div>`;
                } else {
                    // Nếu nhiều ảnh, dàn thành lưới 2 cột
                    let gridHTML = urls.map(url => `<img src="${url}" class="polaroid h-32 w-full object-cover">`).join('');
                    imgHTML = `<div class="mt-6 grid grid-cols-2 gap-4">${gridHTML}</div>`;
                }
            }

            entryDiv.innerHTML = `
                <div class="washi-tape"></div>
                <p class="font-lavishly text-4xl text-gray-700 whitespace-pre-line leading-[38px] min-h-[64px]">
                    "${entry.message}"
                </p>
                <h4 class="font-lavishly text-5xl font-bold text-wedding-dark mt-4 text-right">
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
    } catch (error) {
        console.error("Lỗi khi tải sổ lưu bút:", error);
    }
}

loadEntries();

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    submitBtn.innerHTML = "Đang xử lý ảnh tốc độ cao..."; 
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

        // BƯỚC 2: Gói Tên + Lời chúc + Link ảnh gửi về Database
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

var loveSwiper = new Swiper(".loveSwiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
        delay: 2500,
        disableOnInteraction: false,
    },
});
var weddingSwiper = new Swiper(".weddingSwiper", {
    slidesPerView: "auto",
    spaceBetween: 20,
    freeMode: true,
    autoplay: {
        delay: 3500,
        disableOnInteraction: false,
    },
});

const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    openEffect: 'zoom',
    closeEffect: 'fade'
});