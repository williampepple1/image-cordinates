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

const TARGET_WIDTH = 1920;
const TARGET_HEIGHT = 1080;

/**
 * Resizes an image to 1920x1080 using canvas
 * @param {string} src - The source URL or data URL of the image
 * @returns {Promise<string>} - A promise that resolves to the resized image data URL
 */
function resizeImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous'; // Allow cross-origin images
        
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = TARGET_WIDTH;
            canvas.height = TARGET_HEIGHT;
            
            const ctx = canvas.getContext('2d');
            
            // Fill with black background (in case of transparent images)
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, TARGET_WIDTH, TARGET_HEIGHT);
            
            // Draw image stretched to fit exactly 1920x1080
            ctx.drawImage(img, 0, 0, TARGET_WIDTH, TARGET_HEIGHT);
            
            // Convert to data URL
            const resizedDataUrl = canvas.toDataURL('image/png');
            resolve(resizedDataUrl);
        };
        
        img.onerror = () => {
            reject(new Error('Failed to load image for resizing'));
        };
        
        img.src = src;
    });
}

async function addImage(src) {
    try {
        // Resize the image to 1920x1080
        const resizedSrc = await resizeImage(src);
        
        const id = Date.now();
        const imageObj = { id, src: resizedSrc };
        images.push(imageObj);
        
        renderImage(imageObj);
        updateEmptyState();
    } catch (error) {
        console.error('Failed to resize image:', error);
        showToast('Failed to load image. Check URL or try another image.');
    }
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
    info.innerHTML = `<span>Resized to 1920x1080 • Click to copy coordinates</span>`;

    card.appendChild(img);
    card.appendChild(info);
    gallery.appendChild(card);
}

// --- Event Handlers ---

function handleImageClick(e) {
    const img = e.target;
    const rect = img.getBoundingClientRect();

    // Get the actual rendered dimensions of the image
    const renderedWidth = img.offsetWidth;
    const renderedHeight = img.offsetHeight;

    // Calculate click position within the displayed element (pixels)
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    // Since images are always resized to 1920x1080, we just need to scale
    // from rendered size to the actual 1920x1080 dimensions
    const scaledX = Math.round((clickX / renderedWidth) * TARGET_WIDTH);
    const scaledY = Math.round((clickY / renderedHeight) * TARGET_HEIGHT);

    // DEBUG LOGGING
    console.group('🎯 Coordinate Calculation Debug');
    console.log('Image Size (always):', `${TARGET_WIDTH} x ${TARGET_HEIGHT}`);
    console.log('Rendered Size:', `${renderedWidth} x ${renderedHeight}`);
    console.log('Click Position (relative to image):', `${clickX.toFixed(2)}, ${clickY.toFixed(2)}`);
    console.log('Coordinates:', `${scaledX}, ${scaledY}`);
    console.groupEnd();

    const coordinateString = `${scaledX}, ${scaledY}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(coordinateString).then(() => {
        showToast(`Copied: ${coordinateString}`);
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
