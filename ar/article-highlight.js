// article-highlight.js - سكريبت تمييز الكلمات في المقالات

(function() {
    'use strict';

    // الحصول على معامل البحث من الرابط
    function getSearchQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('q');
    }

    // البحث عن النص في العقدة
    function findTextInNode(node, searchText) {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const index = text.toLowerCase().indexOf(searchText.toLowerCase());
            if (index !== -1) {
                return {
                    node: node,
                    index: index,
                    length: searchText.length
                };
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // تجاهل العناصر التي لا نريد البحث فيها
            const skipTags = ['SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME'];
            if (skipTags.includes(node.tagName)) {
                return null;
            }

            for (let child of node.childNodes) {
                const result = findTextInNode(child, searchText);
                if (result) {
                    return result;
                }
            }
        }
        return null;
    }

    // تمييز النص
    function highlightText(textNode, startIndex, length) {
        const text = textNode.textContent;
        const beforeText = text.substring(0, startIndex);
        const highlightedText = text.substring(startIndex, startIndex + length);
        const afterText = text.substring(startIndex + length);

        // إنشاء عنصر التمييز
        const highlightSpan = document.createElement('span');
        highlightSpan.className = 'search-highlight';
        highlightSpan.style.cssText = `
            background-color: #ffeb3b !important;
            padding: 2px 4px !important;
            border-radius: 3px !important;
            font-weight: bold !important;
            color: #333 !important;
            box-shadow: 0 2px 4px rgba(255, 235, 59, 0.3) !important;
            transition: all 0.3s ease !important;
        `;
        highlightSpan.textContent = highlightedText;

        // استبدال النص الأصلي
        const parent = textNode.parentNode;

        if (beforeText) {
            parent.insertBefore(document.createTextNode(beforeText), textNode);
        }

        parent.insertBefore(highlightSpan, textNode);

        if (afterText) {
            parent.insertBefore(document.createTextNode(afterText), textNode);
        }

        parent.removeChild(textNode);

        return highlightSpan;
    }

    // التمرير إلى العنصر
    function scrollToElement(element) {
        const rect = element.getBoundingClientRect();
        const absoluteTop = window.pageYOffset + rect.top;
        const middle = absoluteTop - (window.innerHeight / 2);

        window.scrollTo({
            top: middle,
            behavior: 'smooth'
        });
    }

    // إزالة التمييز بعد فترة
    function removeHighlightAfterDelay(element, delay = 2000) {
        setTimeout(() => {
            if (element && element.parentNode) {
                // تأثير الاختفاء التدريجي
                element.style.transition = 'all 0.5s ease';
                element.style.backgroundColor = 'transparent';
                element.style.boxShadow = 'none';

                setTimeout(() => {
                    // استبدال العنصر بالنص العادي
                    const textNode = document.createTextNode(element.textContent);
                    element.parentNode.replaceChild(textNode, element);
                }, 500);
            }
        }, delay);
    }

    // إضافة أنماط CSS للتمييز
    function addHighlightStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-highlight {
                animation: highlightPulse 1s ease-in-out;
            }
            
            @keyframes highlightPulse {
                0% { 
                    background-color: #ffeb3b;
                    transform: scale(1);
                }
                50% { 
                    background-color: #ffc107;
                    transform: scale(1.05);
                }
                100% { 
                    background-color: #ffeb3b;
                    transform: scale(1);
                }
            }
            
            .search-highlight:hover {
                background-color: #ffc107 !important;
                transform: scale(1.02) !important;
            }
        `;
        document.head.appendChild(style);
    }

    // البحث والتمييز
    function searchAndHighlight(searchQuery) {
        if (!searchQuery || searchQuery.trim() === '') {
            return;
        }

        console.log('البحث عن:', searchQuery);

        // البحث في محتوى الصفحة
        const bodyElement = document.body;
        const result = findTextInNode(bodyElement, searchQuery.trim());

        if (result) {
            console.log('تم العثور على النص في:', result.node.parentNode);

            // تمييز النص
            const highlightedElement = highlightText(result.node, result.index, result.length);

            // التمرير إلى النص
            setTimeout(() => {
                scrollToElement(highlightedElement);
            }, 100);

            // إزالة التمييز بعد ثانيتين
            removeHighlightAfterDelay(highlightedElement, 2000);

            return true;
        } else {
            console.log('لم يتم العثور على النص:', searchQuery);
            return false;
        }
    }

    // إضافة رسالة إعلامية


    // تشغيل السكريبت عند تحميل الصفحة
    function init() {
        // إضافة الأنماط
        addHighlightStyles();

        // الحصول على كلمة البحث
        const searchQuery = getSearchQuery();

        if (searchQuery) {
            console.log('تم استلام طلب البحث:', searchQuery);

            // انتظار تحميل المحتوى بالكامل
            setTimeout(() => {
                const found = searchAndHighlight(searchQuery);
                showSearchMessage(searchQuery, found);
            }, 500);
        }
    }

    // تشغيل السكريبت
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();