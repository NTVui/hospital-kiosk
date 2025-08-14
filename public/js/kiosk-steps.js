document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("checkCccdForm");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();
    const cccd = document.getElementById("cccd").value.trim();

    const res = await fetch("/kiosk/step1/check-cccd", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cccd })
    });

    const data = await res.json();

    if (data.success) {
      if (data.hasBhyt) {
        // Đánh dấu step 1 completed và chuyển sang step 2
        document.querySelector('.step[data-step="1"]').classList.remove("active");
        document.querySelector('.step[data-step="1"]').classList.add("completed");

        document.querySelector('.step[data-step="2"]').classList.add("active");

        // Chuyển trang sang step 2
        window.location.href = "/kiosk/step-2";
      } else {
        alert(data.message);
      }
    } else {
      alert("Có lỗi xảy ra, vui lòng thử lại.");
    }
  });
});
