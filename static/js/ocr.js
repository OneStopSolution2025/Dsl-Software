Dropzone.autoDiscover = false;

var myDropzone = new Dropzone("#myDropzone", { 
    url: "/upload", 
    autoProcessQueue: false,
    uploadMultiple: true,
    parallelUploads: 5,
    maxFilesize: 50
});

const steps = document.querySelectorAll(".step");
const startBtn = document.getElementById("startProcessBtn");
const previewSection = document.getElementById("preview-section");
const docPreview = document.getElementById("docPreview");

function updateStep(stepNum, status) {
    steps.forEach(step => {
        if (step.dataset.step == stepNum) {
            step.classList.remove("active");
            step.classList.remove("completed");
            if (status === "completed") step.classList.add("completed");
            if (status === "active") step.classList.add("active");
        }
    });
}

startBtn.addEventListener("click", function () {
    if (myDropzone.getAcceptedFiles().length === 0) {
        alert("Please upload at least one file.");
        return;
    }

    updateStep(1, "completed");
    updateStep(2, "active");

    myDropzone.processQueue();

    myDropzone.on("queuecomplete", function() {
        fetch("/process_files",{ method: "POST" })
            .then(response => response.json())
            .then(data => {
                updateStep(2, "completed");
                updateStep(3, "completed");
                updateStep(4, "active");

                previewSection.classList.remove("hidden");
                docPreview.src = "/preview_doc";
            });
    });
});

document.getElementById("confirmBtn").addEventListener("click", function () {
    updateStep(4, "completed");
    updateStep(5, "active");

    window.location.href = "/download_doc";
    updateStep(5, "completed");
});
