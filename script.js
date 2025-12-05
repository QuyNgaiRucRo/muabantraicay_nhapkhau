// script.js

// Dữ liệu sản phẩm
const products = [
  { id: 1, name: "Cherry Đỏ Mỹ", price: 189000, img: "NhapKhau/cherry.jpg", desc: "Cherry đỏ Mỹ được ưa chuộng nhờ vỏ đỏ bóng đẹp, thịt chắc giòn và vị ngọt đậm đặc trưng. Đây là loại trái cây cao cấp, thích hợp để thưởng thức hằng ngày hoặc làm quà biếu." },
  { id: 2, name: "Việt Quất", price: 90000, img: "NhapKhau/VietQuat.jpg", desc: "Quả việt quất nổi bật với màu xanh tím đặc trưng, vị ngọt nhẹ xen chút chua thanh và hàm lượng dinh dưỡng cao. Giàu chất chống oxy hóa, vitamin và chất xơ."},
  { id: 3, name: "Nho Mẫu Đơn Hàn Quốc", price: 650000, img: "NhapKhau/NhoHan.jpg", desc: "Nho mẫu đơn Hàn Quốc gây ấn tượng với chùm lớn, quả to tròn và lớp vỏ tím đậm đẹp mắt. Luôn đạt chất lượng đồng đều, thích hợp làm quà biếu hoặc thưởng thức hằng ngày."},
  { id: 4, name: "Lựu Peru", price: 119000, img: "NhapKhau/LuuPeru.jpg", desc: "Lựu Peru nổi tiếng với hạt đỏ hồng ngọc đẹp mắt, vị ngọt thanh xen chút chua nhẹ và độ giòn đặc trưng. Được ưa chuộng nhờ hương vị thơm ngon và giá trị dinh dưỡng vượt trội."},
  { id: 5, name: "Lê Hàn Quốc", price: 155000, img: "NhapKhau/LeHan.jpg", desc: "Lê Hàn Quốc luôn có kích thước lớn, hương vị thanh mát và chất lượng đồng đều. thích hợp để thưởng thức hằng ngày hoặc làm quà biếu sang trọng"},
  { id: 6, name: "Táo Rockit", price: 129000, img: "NhapKhau/TaoRockit.jpg", desc: "Táo Rockit là dòng táo cao cấp có nguồn gốc từ New Zealand, nổi bật với kích thước nhỏ gọn, vỏ đỏ bóng đẹp và vị ngọt giòn tự nhiên."},
];

let cart = [];
let currentProductId = null;

// Hiển thị sản phẩm ra màn hình
function render() {
  const container = document.getElementById('product-list');
  container.innerHTML = ''; 
  products.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" class="product-image">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${p.price.toLocaleString('vi-VN')} đ/Kg</div>
        <div class="btn-group">
          <button class="btn btn-view" onclick="openModal(${p.id})">Xem thêm</button>
          <button class="btn btn-add" onclick="quickAdd(${p.id})">Thêm vào giỏ</button>
        </div>
      </div>
    `;
  });
}

// Cập nhật giỏ hàng chi tiết
function updateCartList() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    cartItemsDiv.innerHTML = '';
    
    let total = 0;
    
    // 1. Gom nhóm sản phẩm giống nhau để hiển thị
    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = { ...item, totalQty: 0 };
        }
        groupedCart[item.id].totalQty += item.qty;
    });

    // 2. Hiển thị danh sách chi tiết
    for (const id in groupedCart) {
       const item = groupedCart[id];
       const itemTotal = item.price * item.totalQty;
       total += itemTotal;
       
       cartItemsDiv.innerHTML += `
         <div class="cart-item">
           <span style="font-weight: bold;">${item.name} (x${item.totalQty})</span>
           
           <span style="display:flex; align-items:center;">
             <button style="width:20px; height:20px; border:1px solid #ddd; background:#eee; cursor:pointer;" 
                     onclick="decreaseItem(${item.id})">-</button>
             
             <span style="margin: 0 5px;">${itemTotal.toLocaleString('vi-VN')}đ</span>
             
             <button style="width:20px; height:20px; border:none; background:#ff6347; color:white; border-radius:3px; cursor:pointer;"
                     onclick="removeItem(${item.id})">X</button>
           </span>
         </div>
       `;
    }

    totalSpan.innerText = total.toLocaleString('vi-VN');
    
    // Ẩn/Hiện khu vực giỏ hàng
    const cartSec = document.getElementById('cart-section');
    cartSec.style.display = cart.length > 0 ? 'block' : 'none';
    setTimeout(moveCartElevator, 0);
}


// Giảm số lượng sản phẩm
function decreaseItem(id) {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        if (cart[index].qty > 1) {
            cart[index].qty--; 
        } else {
            cart.splice(index, 1);
            }
    }
    updateCartList(); // Cập nhật lại giao diện
}

// Xóa hẳn sản phẩm khỏi giỏ hàng
function removeItem(id) {
    // Xóa tất cả các mục có cùng ID khỏi giỏ hàng
    const product = products.find(p => p.id === id);
    cart = cart.filter(item => item.id !== id);
    alert(`Đã xóa tất cả ${product.name} khỏi giỏ hàng.`);
    updateCartList(); // Cập nhật lại giao diện
}

function toggleCart() {
   const cartSec = document.getElementById('cart-section');
   // Đảo trạng thái hiện/ẩn (nếu hiện thì ẩn, nếu ẩn thì hiện)
   cartSec.style.display = cartSec.style.display === 'none' || cart.length === 0 ? 'block' : 'none';
   if(cart.length === 0 && cartSec.style.display === 'block') {
       alert("Giỏ hàng chưa có sản phẩm nào!");
       cartSec.style.display = 'none';
   }
}


// --- XỬ LÝ THÊM VÀO GIỎ ---
function addToCart(id, quantity) {
  const product = products.find(p => p.id === id);
  
  const existingItem = cart.find(i => i.id === id);
  
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }
  
  updateCartList(); // Cập nhật danh sách chi tiết
}

// --- XỬ LÝ POPUP VÀ THANH TOÁN ---
function openModal(id) {
  const p = products.find(x => x.id === id);
  currentProductId = id;
  
  // Điền thông tin vào Popup
  document.getElementById('m-img').src = p.img;
  document.getElementById('m-name').innerText = p.name;
  document.getElementById('m-price').innerText = p.price.toLocaleString('vi-VN') + 'đ';
  document.getElementById('m-desc').innerText = p.desc;
  document.getElementById('m-qty').value = 1;
  
  // Hiện popup
  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('product-modal');
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function adjustQty(amount) {
  const input = document.getElementById('m-qty');
  let val = parseInt(input.value) + amount;
  if (val < 1) val = 1;
  input.value = val;
}

function quickAdd(id) {
  addToCart(id, 1);
}

function addFromModal() {
  const qty = parseInt(document.getElementById('m-qty').value);
  addToCart(currentProductId, qty);
  closeModal();
}

function checkout() {
  if(cart.length === 0) { alert("Giỏ hàng trống!"); return; }
  
  let message = "Đơn hàng mới:\n";
  let total = 0;
  
  cart.forEach(item => {
     total += item.price * item.qty;
     message += `- ${item.name}: ${item.qty}kg (${(item.price * item.qty).toLocaleString('vi-VN')}đ)\n`;
  });
  
  message += `\nTổng tiền: ${total.toLocaleString('vi-VN')}đ`;
  
  const ZALO_PHONE = '0967745329'; 
  const confirmation = confirm(message + "\n\nBấm OK để gửi qua Zalo.");
  
  if (confirmation) {
    window.open(`https://zalo.me/${ZALO_PHONE}?text=${encodeURIComponent(message)}`, '_blank');
  }
}

function moveCartElevator() {
    const cartSec = document.getElementById('cart-section');
    
    // Chỉ chạy khi giỏ hàng đang hiển thị
    if (cartSec.style.display !== 'block') return;

    // 1. Lấy vị trí cuộn hiện tại
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // 2. Lấy chiều cao màn hình người xem
    const windowHeight = window.innerHeight;
    
    // 3. Lấy chiều cao của bản thân giỏ hàng
    const cartHeight = cartSec.offsetHeight;

    // 4. Tính toán vị trí đích:
    // Vị trí cuộn + Chiều cao màn hình - Chiều cao giỏ - Khoảng cách đáy (20px)
    let targetTop = scrollTop + windowHeight - cartHeight - 20;
    
    // Đảm bảo không bị trôi lên quá cao (nếu cần)
    if (targetTop < 0) targetTop = 20;

    // 5. Gán vị trí mới (CSS transition sẽ làm nó trượt êm đến đây)
    cartSec.style.top = targetTop + 'px';
}

// Kích hoạt khi cuộn chuột
window.addEventListener('scroll', moveCartElevator);

// Kích hoạt khi thay đổi kích thước màn hình
window.addEventListener('resize', moveCartElevator);

render();