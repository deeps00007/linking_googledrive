const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbz12p85E56Mwh_Sj1jjUyIN7nhg-mGg05o_khGLpyiigLRRWMZ7InCKONaA6vM6GXce/exec"; // Replace with your Google Apps Script Web App URL
const MAX_FILE_SIZE = 1024 * 1024; // 1MB

async function uploadFile() {
  const fileInput = document.getElementById("profile-input").files[0];
  const contactName = document.getElementById("contact").value;
  const statusElement = document.getElementById("status");

  if (!fileInput) {
    alert("Select a file first!");
    return;
  }
  if (fileInput.size > MAX_FILE_SIZE) {
    alert("File size must be less than 1MB.");
    return;
  }

  try {
    if (statusElement) {
      statusElement.textContent = "Uploading...";
    }

    const reader = new FileReader();
    reader.readAsDataURL(fileInput);

    reader.onloadend = async function () {
      const base64String = reader.result.split(",")[1];

      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          image: base64String,
          mimeType: fileInput.type,
          fileName: contactName,
        }),
      });

      const data = await response.json();
    };
  } catch (error) {
    console.error("Error uploading file:", error);
    alert("Upload failed: " + error.message);
    if (statusElement) {
      statusElement.textContent = "Upload failed!";
    }
  }
}

async function fetchImages() {
  try {
    const response = await fetch(WEB_APP_URL);
    const data = await response.json();

    if (!data.images || data.images.length === 0) {
      console.error("No images found.");
      return;
    }

    const contactName = document.getElementById("contact").value;
    const image = data.images.find((img) => img.name.includes(contactName));

    if (image) {
     const urlVar = document.getElementById("profile-picture").src = image.url;
    }
  } catch (error) {
    console.error("Error fetching images:", error);
  }
}

const fileName = document.getElementById("contact").value; // Contact number as filename

