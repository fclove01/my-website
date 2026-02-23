const API_URL = "https://api.lenguyenkiencuong.id.vn/api/guestbook"; 
        
async function loadAllEntries() {
    try {
        const response = await fetch(API_URL);
        const entries = await response.json();
        
        const container = document.getElementById('full-guestbook-entries');
        container.innerHTML = '';
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center text-gray-400">Chưa có lời chúc nào.</p>';
            return;
        }

        entries.forEach((entry, index) => {
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
            container.appendChild(entryDiv);
        });
    } catch (error) {
        document.getElementById('loader').innerText = "Không thể tải dữ liệu. Vui lòng thử lại sau.";
    }
}

loadAllEntries();