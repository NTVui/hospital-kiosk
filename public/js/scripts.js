//Show Alert
const showAlert = document.querySelector("[show-alert]")
//console.log(showAlert)
if(showAlert){
  const time = parseInt(showAlert.getAttribute("data-time"))
  const closeAlert = showAlert.querySelector("[close-alert]")

  setTimeout(()=>{
    showAlert.classList.add("alert-hidden")
  }, time)

  closeAlert.addEventListener("click", ()=>{
    showAlert.classList.add("alert-hidden")
  })
}

//Button go back
const buttonGoBack = document.querySelectorAll("[button-go-back]")
if(buttonGoBack.length > 0){
  buttonGoBack.forEach(button=>{
    button.addEventListener("click",()=>{
      history.back()
    })
  })
}

// const provinceSelect = document.getElementById("provinceSelect");
// const districtSelect = document.getElementById("districtSelect");
// const wardSelect = document.getElementById("wardSelect");

// // 🏙 Khi chọn Tỉnh -> load Quận/Huyện
// provinceSelect.addEventListener("change", async function () {
//   const provinceCode = this.value;
//   districtSelect.innerHTML = '<option value="">-- Chọn quận/huyện --</option>';
//   wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
//   districtSelect.disabled = true;
//   wardSelect.disabled = true;

//   if (provinceCode) {
//     try {
//       const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
//       const data = await res.json();

//       data.districts.forEach(d => {
//         const opt = document.createElement("option");
//         opt.value = d.code;
//         opt.textContent = d.name;
//         districtSelect.appendChild(opt);
//       });

//       districtSelect.disabled = false;
//     } catch (err) {
//       console.error("Lỗi load quận/huyện:", err);
//     }
//   }
// });

// // 🏘 Khi chọn Quận/Huyện -> load Phường/Xã
// districtSelect.addEventListener("change", async function () {
//   const districtCode = this.value;
//   wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
//   wardSelect.disabled = true;

//   if (districtCode) {
//     try {
//       const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
//       const data = await res.json();

//       data.wards.forEach(w => {
//         const opt = document.createElement("option");
//         opt.value = w.code;
//         opt.textContent = w.name;
//         wardSelect.appendChild(opt);
//       });

//       wardSelect.disabled = false;
//     } catch (err) {
//       console.error("Lỗi load xã/phường:", err);
//     }
//   }
// });