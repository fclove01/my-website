
const API_URL = "https://api.lenguyenkiencuong.id.vn/api/guestbook"; 
let globalEntries = []; 

async function loadAllEntries() {
    try {
        const response = await fetch(API_URL);
        const entries = await response.json();
       
        globalEntries = entries; 
        const container = document.getElementById('full-guestbook-entries');
        container.innerHTML = '';
        
        if (entries.length === 0) {
            container.innerHTML = '<p class="col-span-full text-center text-gray-400">Chưa có lời chúc nào.</p>';
            return;
        }

        entries.forEach((entry, index) => {
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
                           data-gallery="gallery-${index}">
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
                    <p class="text-2xl text-gray-700 whitespace-pre-line leading-[38px] ${isLong ? 'line-clamp-5' : ''}">
                        "${entry.message}"
                    </p>
                    ${isLong ? `<button class="read-more-btn text-wedding-accent mt-2 text-sm italic hover:underline font-semibold" data-index="${index}">Xem toàn bộ lời chúc...</button>` : ''}
                </div>

                <h4 class="text-xl md:text-2xl font-bold text-wedding-dark mt-6 text-right font-serif">
                    - ${entry.name} -
                </h4>
                
                ${imgHTML}
                
                <p class="text-xs text-gray-400 mt-6 text-right font-sans">${entry.date}</p>
            `;
            container.appendChild(entryDiv);
        });

        const lightbox = GLightbox({
            touchNavigation: true,
            loop: true,         
            zoomable: true     
        });

    } catch (error) {
        document.getElementById('loader').innerText = "Không thể tải dữ liệu. Vui lòng thử lại sau.";
    }
}

function openMessageModal(index) {
    const entry = globalEntries[index];
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

document.getElementById('closeMsgBtn').addEventListener('click', closeMessageModal);
document.getElementById('messageModal').addEventListener('click', function(e) {
    if (e.target === this) closeMessageModal();
});

document.addEventListener('keydown', function(e) {
    if (!document.getElementById('messageModal').classList.contains('hidden') && e.key === 'Escape') {
        closeMessageModal();
    }
});
document.getElementById('full-guestbook-entries').addEventListener('click', function(e) {
    if (e.target.classList.contains('read-more-btn')) {
        const index = e.target.getAttribute('data-index');
        openMessageModal(index);
    }
});

loadAllEntries();