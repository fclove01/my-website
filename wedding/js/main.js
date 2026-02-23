
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

const API_URL = "http://160.25.168.183:8000/api/guestbook"; 
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
                imgHTML = `
                    <div class="mt-6 flex justify-center">
                        <img src="${entry.image_url}" alt="Kỷ niệm" class="polaroid max-h-64 object-cover w-4/5">
                    </div>
                `;
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

        // Hiển thị nút "Mở Toàn Bộ Sổ Lưu Bút" nếu có nhiều hơn 6 lời chúc
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

// Xử lý gửi form lên API

form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Đổi trạng thái nút bấm
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.innerHTML = "Đang Gửi...";
    submitBtn.disabled = true;

    const formData = new FormData();
    formData.append("name", document.getElementById('gb-name').value);
    formData.append("message", document.getElementById('gb-message').value);
    
    const imageFile = document.getElementById('gb-image').files[0];
    if (imageFile) formData.append("image", imageFile);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: formData
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            alert("Cảm ơn bạn! Lời chúc đã được gửi đi và đang chờ Cường & Thảo xem qua nhé ❤️");
            form.reset();
        } else {
            alert("Có lỗi xảy ra, vui lòng thử lại sau.");
        }
    } catch (error) {
        console.error("Lỗi khi gửi:", error);
        alert("Không thể kết nối đến máy chủ. Bạn thử lại nha!");
    } finally {
        // Khôi phục nút bấm
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
});

// Tải dữ liệu lần đầu khi mở trang
loadEntries();

function autoSlide(sliderId) {
const slider = document.getElementById(sliderId);
if (!slider) return;

let scrollAmount = 0;
const speed = 2; // Tốc độ trượt
const step = 336; // Chiều rộng ảnh (320px) + gap (16px)

setInterval(() => {
    slider.style.transition = "transform 0.5s ease-in-out";
    scrollAmount += step;
    
    // Nếu cuộn hết thì quay lại đầu
    if (scrollAmount >= slider.scrollWidth - slider.clientWidth) {
        setTimeout(() => {
            slider.style.transition = "none";
            scrollAmount = 0;
            slider.style.transform = `translateX(0px)`;
        }, 500); // Đợi animation xong rồi reset
    } else {
        slider.style.transform = `translateX(-${scrollAmount}px)`;
    }
}, 3000); // 3 giây trượt 1 lần
}

// Kích hoạt cho các mục
autoSlide('slider-anhcuoi');
autoSlide('slider-lehoi');

// Thay thế đoạn tạo entryDiv cũ bằng đoạn này:
