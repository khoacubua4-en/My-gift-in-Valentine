const images = Array.from({ length: 12 }, (_, i) => `img${i + 1}.jpg`);

const imageCanvas = document.getElementById("imageCanvas");
const scratchCanvas = document.getElementById("scratchCanvas");
const imgCtx = imageCanvas.getContext("2d");
const sc = scratchCanvas.getContext("2d");

const password = document.getElementById("password");
const login = document.getElementById("login");
const content = document.getElementById("content");
const error = document.getElementById("error");

let drawing = false;
let unlocked = false;

/* LOGIN */
function checkPassword() {
    if (password.value === "051008") {
        login.classList.add("hidden");
        content.classList.remove("hidden");
        initScratch();
    } else {
        error.innerText = "Sai mật khẩu 😝";
    }
}

/* INIT SCRATCH */
function initScratch() {
    // 1. RESET CANVAS
    imgCtx.clearRect(0, 0, 300, 300);
    sc.clearRect(0, 0, 300, 300);

    // 2. VẼ ẢNH DƯỚI
    const img = new Image();
    img.src = "love.jpg";
    img.onload = () => {
        imgCtx.drawImage(img, 0, 0, 300, 300);

        // 3. PHỦ LỚP CÀO (QUAN TRỌNG)
        sc.globalCompositeOperation = "source-over";

        sc.fillStyle = "#ffb6c1";
        sc.fillRect(0, 0, 300, 300);

        sc.fillStyle = "rgba(255,255,255,0.5)";
        sc.font = "40px serif";
        sc.fillText("❤", 135, 165);

        sc.font = "14px Arial";
        sc.fillText("Cào nhẹ nha 💕", 95, 200);
    };
}

/* SCRATCH */
function scratch(x, y) {
    sc.globalCompositeOperation = "destination-out";
    sc.beginPath();
    sc.arc(x, y, 24, 0, Math.PI * 2);
    sc.fill();
}

/* CHECK DONE */
function checkDone() {
    if (unlocked) return;

    const data = sc.getImageData(0, 0, 300, 300).data;
    let clear = 0;

    for (let i = 3; i < data.length; i += 4) {
        if (data[i] === 0) clear++;
    }

    if (clear / (300 * 300) > 0.4) {
        unlocked = true;
        sc.clearRect(0, 0, 300, 300);
        launchGallery();
    }
}

/* EVENTS PC */
scratchCanvas.addEventListener("mousedown", () => drawing = true);
scratchCanvas.addEventListener("mouseup", () => {
    drawing = false;
    checkDone();
});
scratchCanvas.addEventListener("mousemove", e => {
    if (!drawing) return;
    const r = scratchCanvas.getBoundingClientRect();
    scratch(e.clientX - r.left, e.clientY - r.top);
});

/* EVENTS MOBILE */
scratchCanvas.addEventListener("touchstart", () => drawing = true);
scratchCanvas.addEventListener("touchend", () => {
    drawing = false;
    checkDone();
});
scratchCanvas.addEventListener("touchmove", e => {
    if (!drawing) return;
    const r = scratchCanvas.getBoundingClientRect();
    const t = e.touches[0];
    scratch(t.clientX - r.left, t.clientY - r.top);
});

/* IMAGE BAY */
function launchGallery() {
    images.forEach((src, i) => {
        setTimeout(() => {
            const img = document.createElement("img");
            img.src = src;
            img.className = "float-img";
            img.style.left = Math.random() * 90 + "vw";
            img.style.bottom = "-150px";
            document.getElementById("gallery").appendChild(img);
            setTimeout(() => img.remove(), 4500);
        }, i * 250);
    });
}