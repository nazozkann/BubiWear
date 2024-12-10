document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('upload-trigger-front').addEventListener('click', function () {
        document.getElementById('file-input-front').click();
    });

    document.getElementById('file-input-front').addEventListener('change', function (event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'uploaded-image';
                img.style.width = '50%'; // Set width to half of the design border
                img.style.height = 'auto'; // Maintain aspect ratio
                img.style.position = 'absolute';
                img.style.top = '0px';
                img.style.left = '0px';

                const container = document.getElementById('uploaded-image-container-front');
                container.innerHTML = ''; // Clear any existing images
                container.appendChild(img);

                // Add resize handle
                const resizeHandle = document.createElement('div');
                resizeHandle.className = 'resize-handle';
                img.parentElement.appendChild(resizeHandle);

                // Position resize handle relative to the image
                updateResizeHandlePosition(img, resizeHandle);

                // Add drag functionality to the uploaded image
                addDragFunctionality(img, resizeHandle);

                // Add resize functionality
                addResizeFunctionality(img, resizeHandle);

                // Hide the upload instructions
                const uploadInfo = document.querySelector('.upload-image-bottom-info');
                if (uploadInfo) {
                    uploadInfo.style.display = 'none';
                }
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('back-btn').addEventListener('click', function () {
        document.getElementById('image-upload-front').style.display = 'none';
        document.getElementById('image-upload-back').style.display = 'block';
    });

    document.getElementById('front-btn').addEventListener('click', function () {
        document.getElementById('image-upload-back').style.display = 'none';
        document.getElementById('image-upload-front').style.display = 'block';
    });

    function updateResizeHandlePosition(img, resizeHandle) {
        resizeHandle.style.top = `${img.offsetTop + img.offsetHeight - 10}px`;
        resizeHandle.style.left = `${img.offsetLeft + img.offsetWidth - 10}px`;
    }

    function addDragFunctionality(img, resizeHandle) {
        let startX = 0, startY = 0, offsetX = 0, offsetY = 0, isDragging = false;

        img.addEventListener('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX;
            startY = e.clientY;
            offsetX = parseInt(img.style.left || 0, 10);
            offsetY = parseInt(img.style.top || 0, 10);

            isDragging = true;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);

            // Ensure image is above everything else while dragging
            img.style.zIndex = '10';
            resizeHandle.style.zIndex = '11';
        });

        function mouseMove(e) {
            if (!isDragging) return;

            const designBorder = document.getElementById('front-border');
            const rect = designBorder.getBoundingClientRect();

            let newLeft = offsetX + (e.clientX - startX);
            let newTop = offsetY + (e.clientY - startY);

            newLeft = Math.max(0, Math.min(newLeft, rect.width - img.offsetWidth));
            newTop = Math.max(0, Math.min(newTop, rect.height - img.offsetHeight));

            img.style.left = `${newLeft}px`;
            img.style.top = `${newTop}px`;

            updateResizeHandlePosition(img, resizeHandle);
        }

        function mouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);

            // Reset z-index after dragging
            img.style.zIndex = '1';
            resizeHandle.style.zIndex = '2';
        }
    }

    function addResizeFunctionality(img, resizeHandle) {
        let startX = 0, startWidth = 0, aspectRatio = img.offsetWidth / img.offsetHeight, isResizing = false;

        resizeHandle.addEventListener('mousedown', function (e) {
            e.preventDefault();
            startX = e.clientX;
            startWidth = img.offsetWidth;
            isResizing = true;

            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);

            // Ensure resize handle is active
            resizeHandle.style.zIndex = '12';
            img.style.zIndex = '11';
        });

        function mouseMove(e) {
            if (!isResizing) return;

            const designBorder = document.getElementById('front-border');
            const rect = designBorder.getBoundingClientRect();

            const widthChange = e.clientX - startX;
            const newWidth = Math.max(50, startWidth + widthChange); // Minimum width: 50px
            const newHeight = newWidth / aspectRatio;

            if (
                img.offsetLeft + newWidth <= rect.width &&
                img.offsetTop + newHeight <= rect.height
            ) {
                img.style.width = `${newWidth}px`;
                img.style.height = `${newHeight}px`;

                updateResizeHandlePosition(img, resizeHandle);
            }
        }

        function mouseUp() {
            isResizing = false;
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);

            // Reset z-index after resizing
            img.style.zIndex = '1';
            resizeHandle.style.zIndex = '2';
        }
    }
});