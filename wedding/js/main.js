
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

// 2. Logic Guestbook (Giả lập bằng LocalStorage)
const form = document.getElementById('guestbook-form');
const entriesContainer = document.getElementById('guestbook-entries');

// Hàm hiển thị lời chúc ra màn hình
function renderEntries() {
    // Lấy dữ liệu (Từ LocalStorage hoặc API)
    const allEntries = JSON.parse(localStorage.getItem('wedding_guestbook')) || [];
    
    const entriesContainer = document.getElementById('guestbook-entries');
    entriesContainer.innerHTML = '';
    
    const reversedEntries = allEntries.reverse();
    const recentEntries = reversedEntries.slice(0, 6);
    
    recentEntries.forEach((entry, index) => {
        const entryDiv = document.createElement('div');
        const rotation = index % 2 === 0 ? 'rotate-1' : '-rotate-1';
        
        entryDiv.className = `paper-style p-6 pt-8 rounded-sm ${rotation} hover:z-10 transition-transform duration-300`;
        
        let imgHTML = '';
        if (entry.image) {
            imgHTML = `
                <div class="mt-6 flex justify-center">
                    <img src="${entry.image}" alt="Kỷ niệm" class="polaroid max-h-64 object-cover w-4/5">
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

    // Logic hiển thị nút "Mở Toàn Bộ Sổ Lưu Bút"
    const viewAllBtn = document.getElementById('view-all-guestbook');
    if (allEntries.length > 6) {
        viewAllBtn.classList.remove('hidden'); // Hiện nút nếu có nhiều hơn 6 lời chúc
    } else {
        viewAllBtn.classList.add('hidden'); // Ẩn nút nếu chưa tới 6 lời chúc
    }
}

// Xử lý khi submit form
form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('gb-name').value;
    const message = document.getElementById('gb-message').value;
    const imageFile = document.getElementById('gb-image').files[0];
    const date = new Date().toLocaleString('vi-VN');

    const saveEntry = (imageData = null) => {
        const newEntry = { name, message, image: imageData, date };
        const entries = JSON.parse(localStorage.getItem('wedding_guestbook')) || [];
        entries.push(newEntry);
        localStorage.setItem('wedding_guestbook', JSON.stringify(entries));
        
        form.reset();
        renderEntries();
    };

    // Nếu có ảnh, chuyển ảnh thành Base64 (DataURL) để lưu tạm
    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function(event) {
            saveEntry(event.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        saveEntry();
    }
});

// Load dữ liệu khi mới mở trang
renderEntries();
// Hàm xử lý tự động trượt ảnh

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
