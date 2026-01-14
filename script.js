const gallery = document.getElementById('gallery');
const urlInput = document.getElementById('image-url');
const addUrlBtn = document.getElementById('add-url-btn');
const fileInput = document.getElementById('file-upload');
const emptyState = document.getElementById('empty-state');
const toast = document.getElementById('toast');

// --- State Management ---
let images = [];
let isDefaultState = true;

function updateEmptyState() {
    if (images.length > 0) {
        emptyState.style.display = 'none';
        gallery.style.display = 'flex';
    } else {
        emptyState.style.display = 'block';
        gallery.style.display = 'block';
    }
}

function clearDefaultIfPresent() {
    if (isDefaultState) {
        images = [];
        gallery.innerHTML = ''; // Clear the DOM
        isDefaultState = false;
    }
}

// --- Image Handling ---

function addImage(src) {
    const id = Date.now();
    const imageObj = { id, src };
    images.push(imageObj);
    
    renderImage(imageObj);
    updateEmptyState();
}

function renderImage(imageObj) {
    const card = document.createElement('div');
    card.className = 'image-card';
    card.dataset.id = imageObj.id;

    const img = document.createElement('img');
    img.src = imageObj.src;
    img.alt = "Uploaded image";
    
    img.addEventListener('click', handleImageClick);

    const info = document.createElement('div');
    info.className = 'card-info';
    info.innerHTML = `<span>Click to copy 1920x1080 coordinates</span>`;

    card.appendChild(img);
    card.appendChild(info);
    gallery.appendChild(card);
}

// --- Event Handlers ---

function handleImageClick(e) {
    const img = e.target;
    const rect = img.getBoundingClientRect();
    
    // Virtual resolution
    const TARGET_WIDTH = 1920;
    const TARGET_HEIGHT = 1080;

    // Get natural image dimensions
    const naturalWidth = img.naturalWidth;
    const naturalHeight = img.naturalHeight;

    // Get the actual rendered dimensions of the image
    const renderedWidth = img.offsetWidth;
    const renderedHeight = img.offsetHeight;

    // Calculate click position within the displayed element (pixels)
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // First, convert click position to natural image coordinates
    const naturalX = (clickX / renderedWidth) * naturalWidth;
    const naturalY = (clickY / renderedHeight) * naturalHeight;

    // Then scale from natural dimensions to target resolution
    const scaledX = Math.round((naturalX / naturalWidth) * TARGET_WIDTH);
    const scaledY = Math.round((naturalY / naturalHeight) * TARGET_HEIGHT);

    const coordinateString = `${scaledX}, ${scaledY}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(coordinateString).then(() => {
        showToast(`Copied: ${coordinateString} (1920x1080)`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });

    // Ripple effect
    createRipple(e);
}

function createRipple(e) {
    const card = e.target.closest('.image-card');
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    // Position ripple relative to the card/image
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    e.target.parentElement.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function showToast(message) {
    toast.innerText = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// --- Input Handlers ---

addUrlBtn.addEventListener('click', () => {
    const url = urlInput.value.trim();
    if (url) {
        clearDefaultIfPresent();
        addImage(url);
        urlInput.value = '';
    }
});

urlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const url = urlInput.value.trim();
        if (url) {
            clearDefaultIfPresent();
            addImage(url);
            urlInput.value = '';
        }
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            clearDefaultIfPresent();
            addImage(event.target.result);
        };
        reader.readAsDataURL(file);
    }
});

// Add some default images if empty (optional, but makes it look nice)
addImage('https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80');
