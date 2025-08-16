const provinceSelect = document.getElementById("provinceSelect");
      const districtSelect = document.getElementById("districtSelect");
      const wardSelect = document.getElementById("wardSelect");
      const provinceNameInput = document.getElementById("provinceName");
      const districtNameInput = document.getElementById("districtName");
      const wardNameInput = document.getElementById("wardName");
      const fullAddressInput = document.getElementById("fullAddress");

      function updateFullAddress() {
        const provinceName = provinceSelect.selectedOptions[0]?.textContent || "";
        const districtName = districtSelect.selectedOptions[0]?.textContent || "";
        const wardName = wardSelect.selectedOptions[0]?.textContent || "";

        fullAddressInput.value = `${wardName} - ${districtName} - ${provinceName}`;
        provinceNameInput.value = provinceName;
        districtNameInput.value = districtName;
        wardNameInput.value = wardName;
      }

      provinceSelect.addEventListener("change", async function () {
        const provinceCode = this.value;
        districtSelect.innerHTML = '<option value="">-- Chọn quận/huyện --</option>';
        wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
        districtSelect.disabled = true;
        wardSelect.disabled = true;

        updateFullAddress();
        if (!provinceCode) return;

        const res = await fetch(`https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`);
        const data = await res.json();

        data.districts.forEach(d => {
          const opt = document.createElement("option");
          opt.value = d.code;
          opt.textContent = d.name;
          districtSelect.appendChild(opt);
        });
        districtSelect.disabled = false;
      });

      districtSelect.addEventListener("change", async function () {
        const districtCode = this.value;
        wardSelect.innerHTML = '<option value="">-- Chọn xã/phường --</option>';
        wardSelect.disabled = true;

        updateFullAddress();
        if (!districtCode) return;

        const res = await fetch(`https://provinces.open-api.vn/api/d/${districtCode}?depth=2`);
        const data = await res.json();

        data.wards.forEach(w => {
          const opt = document.createElement("option");
          opt.value = w.code;
          opt.textContent = w.name;
          wardSelect.appendChild(opt);
        });
        wardSelect.disabled = false;
      });

      wardSelect.addEventListener("change", updateFullAddress);