const DEFAULT_FALLBACK = '/placeholder.svg';

function applyFallback(img) {
    if (img.dataset.fallbackApplied) {
        return;
    }
    img.dataset.fallbackApplied = '1';
    img.removeAttribute('srcset');
    img.src = img.dataset.fallback || DEFAULT_FALLBACK;
}

function isBroken(img) {
    return img.complete && img.naturalWidth === 0 && img.getAttribute('src');
}

export default () => {
    // Ошибки загрузки не всплывают, поэтому слушаем в фазе перехвата
    document.addEventListener('error', (event) => {
        if (event.target instanceof HTMLImageElement) {
            applyFallback(event.target);
        }
    }, true);

    // Картинки из SSR-разметки могли упасть до подключения плагина
    const checkExisting = () => {
        document.querySelectorAll('img').forEach((img) => {
            if (isBroken(img)) {
                applyFallback(img);
            }
        });
    };
    if (document.readyState === 'complete') {
        checkExisting();
    } else {
        window.addEventListener('load', checkExisting);
    }
};
