document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".upload-btn").forEach(button => {
        button.addEventListener("click", function () {
            const folderId = this.getAttribute("data-folder-id");
            openUploadForm(folderId);
        });
    });

    document.getElementById("uploadForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const folderId = this.getAttribute("data-folder-id");
        uploadImages(folderId);
    });
});

// Open Bootstrap Modal for Upload
function openUploadForm(folderId) {
    const uploadForm = document.getElementById("uploadForm");
    uploadForm.setAttribute("data-folder-id", folderId);
    $("#uploadModal").modal("show");
}

// Close Bootstrap Modal
function closeUploadForm() {
    $("#uploadModal").modal("hide");
}

async function uploadImages(folderId) {
    const fileInput = document.getElementById("fileInput");
    const files = fileInput.files;

    if (files.length === 0) {
        alert("Please select at least one image.");
        return;
    }

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        if (!files[i].name.endsWith(".webp")) {
            alert("Only .webp files are allowed.");
            return;
        }
        if (files[i].size > 2 * 1024 * 1024) { // 2MB limit
            alert(`File ${files[i].name} exceeds 2MB limit.`);
            return;
        }
        formData.append("files", files[i]);
    }

    const uploadBtn = document.querySelector("button[type='submit']");
    uploadBtn.disabled = true;
    uploadBtn.innerText = "Uploading...";

    try {
        const response = await fetch(`/folder/${folderId}/upload`, {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        if (response.ok) {
            alert("Images uploaded successfully!");
            closeUploadForm();
            window.location.reload();
        } else {
            alert("Error uploading images: " + data.message);
        }
    } catch (error) {
        alert("Failed to upload images. Please try again.");
    } finally {
        uploadBtn.disabled = false;
        uploadBtn.innerText = "Upload";
    }
}
