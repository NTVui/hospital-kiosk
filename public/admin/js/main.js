document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      // Thêm/xóa class vào thẻ <body> để điều khiển toàn cục
      if (window.innerWidth > 768) {
        document.body.classList.toggle("sidebar-collapsed");
      } else {
        document.body.classList.toggle("sidebar-open");
      }
    });
  }
});

//Phải nhớ khi document.querySelected thì lấy ra phải console thử
const buttons = document.querySelectorAll("[buttonStatus]");

if (buttons.length > 0) {
  let url = new URL(window.location.href);
  //console.log(url);
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const status = button.getAttribute("buttonStatus");
      //console.log(status);
      if (status) {
        url.searchParams.set("status", status);
      } else {
        url.searchParams.delete("status");
      }

      // console.log(url.href);
      window.location.href = url.href;
    });
  });
}

//Form Search
const formSearch = document.querySelector("#form-search");
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
    //console.log(e.target.elements.keyword.value);
  });
}

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination) {
  let url = new URL(window.location.href);
  buttonPagination.forEach((button) => {
    button.addEventListener("click", () => {
      const page = button.getAttribute("button-pagination");
      url.searchParams.set("page", page);

      window.location.href = url.href;
    });
  });
}

//Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if (checkboxMulti) {
  //console.log(checkboxMulti);
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
  const inputId = checkboxMulti.querySelectorAll("input[name='id']");
  //console.log(inputCheckAll);
  //console.log(inputId);
  inputCheckAll.addEventListener("click", () => {
    //console.log(inputCheckAll.checked); //trả ra true hoặc false nếu tích
    if (inputCheckAll.checked) {
      inputId.forEach((input) => {
        input.checked = true;
      });
    } else {
      inputId.forEach((input) => {
        input.checked = false;
      });
    }
  });

  inputId.forEach((input) => {
    input.addEventListener("click", () => {
      const countChecked = checkboxMulti.querySelectorAll(
        "input[name='id']:checked"
      ).length;
      // console.log(countChecked);
      // console.log(inputId.length);
      if (countChecked == inputId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    });
  });
}

// Form Change Multi
// Tìm đến form thay đổi hàng loạt
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
  // Lắng nghe sự kiện submit của form
  formChangeMulti.addEventListener("submit", (event) => {
    // 1. Ngăn form submit ngay lập tức để xử lý dữ liệu
    event.preventDefault();

    // 2. Lấy ra các checkbox đã được chọn
    const table = document.querySelector("[checkbox-multi]");
    const inputsChecked = table.querySelectorAll("input[name='id']:checked");

    // 3. Lấy ra hành động (active, inactive, delete-all)
    const typeChange = event.target.elements.type.value;

    if (typeChange === "delete-all") {
      const isConfirm = confirm(
        "Bạn có chắc muốn xóa những bản ghi này không?"
      );
      if (!isConfirm) {
        return; // Nếu người dùng không đồng ý thì dừng lại
      }
    }

    // Kiểm tra xem đã chọn bản ghi nào chưa
    if (inputsChecked.length > 0) {
      // 4. Lấy ID của các bản ghi đã chọn
      const ids = [];
      inputsChecked.forEach((input) => {
        ids.push(input.value);
      });

      // 5. Gán chuỗi ID vào input ẩn
      const inputIds = formChangeMulti.querySelector("input[name='ids']");
      inputIds.value = ids.join(",");

      // 6. QUAN TRỌNG NHẤT: Cho phép form submit đi một cách tự nhiên.
      // Trình duyệt sẽ gửi POST request, nhận lệnh redirect từ server và tự xử lý.
      formChangeMulti.submit();
    } else {
      alert("Vui lòng chọn ít nhất một bản ghi!");
    }
  });
}

//Show Alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  const time = parseInt(showAlert.getAttribute("data-time"));
  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}

//Upload Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");
  const clearThumbnailInput = uploadImage.querySelector("input[name='clearThumbnail']");

  uploadImageInput.addEventListener("change", (e) => {
    //e luôn trả ra object, trong object luôn có key là target
    //e.target chính là ô input uploadImageInput
    const file = e.target.files[0];
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
      if(clearThumbnailInput) {
      clearThumbnailInput.value = "false";
    }
    }
  });
  const uploadImageRemove = document.querySelector("[upload-image-remove]")
  //console.log(uploadImageRemove)
  uploadImageRemove.addEventListener("click", ()=>{
    uploadImageInput.value = ""
    uploadImagePreview.src=""
    if(clearThumbnailInput) {
      clearThumbnailInput.value = "true";
    }
  })
}

//Sort
const sort = document.querySelector("[sort]");
if (sort) {
  let url = new URL(window.location.href);

  const sortSelect = sort.querySelector("[sort-select]");
  const sortClear = sort.querySelector("[sort-clear]");

  // 1. Lắng nghe sự kiện thay đổi sắp xếp
  sortSelect.addEventListener("change", (e) => {
    const value = e.target.value;

    // Chỉ thực hiện khi người dùng chọn một giá trị hợp lệ
    if (value) {
      const [sortKey, sortValue] = value.split("-");

      // Đặt tham số sắp xếp vào URL
      url.searchParams.set("sortKey", sortKey);
      url.searchParams.set("sortValue", sortValue);

      // Chuyển hướng đến URL mới
      window.location.href = url.href;
    }
  });

  // 2. Lắng nghe sự kiện xóa bộ lọc sắp xếp
  sortClear.addEventListener("click", () => {
    // SỬA LỖI: Dùng delete() đúng cách, không cần biến
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  });

  // 3. Hiển thị lựa chọn sắp xếp hiện tại trên dropdown
  const sortKey = url.searchParams.get("sortKey");
  // SỬA LỖI: Dùng .get() thay vì .set()
  const sortValue = url.searchParams.get("sortValue");

  if (sortKey && sortValue) {
    // SỬA LỖI: Bỏ khoảng trắng thừa ở cuối
    const stringSort = `${sortKey}-${sortValue}`;

    const optionSelected = sortSelect.querySelector(
      `option[value='${stringSort}']`
    );
    // SỬA LỖI: Thêm kiểm tra để tránh lỗi nếu không tìm thấy option
    if (optionSelected) {
      optionSelected.selected = true;
    }
  }
}
