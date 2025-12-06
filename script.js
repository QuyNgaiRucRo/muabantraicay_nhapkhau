// Dữ liệu sản phẩm 
const products = [
  { id: 10, name: "Cherry Đỏ Mỹ", price: 189000, img: "NhapKhau/cherry.jpg", desc: "Cherry đỏ Mỹ được ưa chuộng nhờ vỏ đỏ bóng đẹp, thịt chắc giòn và vị ngọt đậm đặc trưng. Đây là loại trái cây cao cấp, thích hợp để thưởng thức hằng ngày hoặc làm quà biếu." },
  { id: 11, name: "Việt Quất", price: 90000, img: "NhapKhau/VietQuat.jpg", desc: "Quả việt quất nổi bật với màu xanh tím đặc trưng, vị ngọt nhẹ xen chút chua thanh và hàm lượng dinh dưỡng cao. Giàu chất chống oxy hóa, vitamin và chất xơ."},
  { id: 12, name: "Nho Mẫu Đơn Hàn Quốc", price: 650000, img: "NhapKhau/NhoHan.jpg", desc: "Nho mẫu đơn Hàn Quốc gây ấn tượng với chùm lớn, quả to tròn và lớp vỏ tím đậm đẹp mắt. Luôn đạt chất lượng đồng đều, thích hợp làm quà biếu hoặc thưởng thức hằng ngày."},
  { id: 13, name: "Lựu Peru", price: 119000, img: "NhapKhau/LuuPeru.jpg", desc: "Lựu Peru nổi tiếng với hạt đỏ hồng ngọc đẹp mắt, vị ngọt thanh xen chút chua nhẹ và độ giòn đặc trưng. Được ưa chuộng nhờ hương vị thơm ngon và giá trị dinh dưỡng vượt trội."},
  { id: 14, name: "Lê Hàn Quốc", price: 155000, img: "NhapKhau/LeHan.jpg", desc: "Lê Hàn Quốc luôn có kích thước lớn, hương vị thanh mát và chất lượng đồng đều. thích hợp để thưởng thức hằng ngày hoặc làm quà biếu sang trọng"},
  { id: 15, name: "Táo Rockit", price: 129000, img: "NhapKhau/TaoRockit.jpg", desc: "Táo Rockit là dòng táo cao cấp có nguồn gốc từ New Zealand, nổi bật với kích thước nhỏ gọn, vỏ đỏ bóng đẹp và vị ngọt giòn tự nhiên."},
];

let cart = [];
let currentProductId = null;
let isTicking = false; 

// ------------------------------------------------------
// CHỨC NĂNG LƯU TRÊN MÁY (QUAN TRỌNG)
// ------------------------------------------------------

/**
 * Lưu dữ liệu giỏ hàng trên máy.
 * Sẽ được gọi sau mỗi thao tác thêm, giảm, xóa sản phẩm.
 */
function saveCart() {
    localStorage.setItem('myStoreCart', JSON.stringify(cart));
    updateCartList(); 
}

/**
 * Tải dữ liệu giỏ hàng từ Local Storage khi trang tải.
 * Sẽ được gọi ở cuối tệp script.
 */
function loadCart() {
    const savedCart = localStorage.getItem('myStoreCart');
    if (savedCart) {
        try {
            // Chuyển chuỗi JSON thành mảng JavaScript và gán cho biến 'cart'
            cart = JSON.parse(savedCart);
        } catch (e) {
            console.error("Lỗi khi tải giỏ hàng từ LocalStorage:", e);
            cart = [];
        }
    }
  updateCartList();
}


// --- HÀM HIỂN THỊ SẢN PHẨM ---
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

// --- HÀM CẬP NHẬT GIỎ HÀNG VÀ VỊ TRÍ ---
function updateCartList() {
    const cartItemsDiv = document.getElementById('cart-items');
    const totalSpan = document.getElementById('total-price');
    const cartSec = document.getElementById('cart-section');
    const cartTotalDiv = document.querySelector('.cart-total');
    const checkoutBtn = document.querySelector('.btn-checkout');
    
    const minimizedBtn = document.getElementById('minimized-cart-btn'); 
    const minimizedCountSpan = document.getElementById('minimized-cart-count'); 
    
    let total = 0;
    
    // --- Cập nhật số lượng giỏ thu nhỏ ---
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0); 
    if (minimizedCountSpan) {
        minimizedCountSpan.innerText = totalItems;
    }

    // --- Logic giỏ hàng trống ---
    if (cart.length === 0) {
        // Hiển thị nội dung trống
        cartItemsDiv.innerHTML = `
            <div style="text-align: center; color: #777; padding: 30px 10px; font-style: italic;">
                🛒 Bạn chưa chọn sản phẩm nào.
            </div>
        `;
        totalSpan.innerText = '0';
        
        // Ẩn tổng tiền và nút thanh toán 
        if (cartTotalDiv) cartTotalDiv.style.display = 'none';
        if (checkoutBtn) checkoutBtn.style.display = 'none';
        
        // Chỉ hiện biểu tượng nếu giỏ hàng lớn đang ẩn
        if (minimizedBtn) {
            const isCartVisible = getComputedStyle(cartSec).display !== 'none';
            if (isCartVisible) {
                minimizedBtn.classList.remove('show'); // Giỏ đang mở -> Ẩn 
            } else {
                minimizedBtn.classList.add('show'); // Giỏ đang ẩn -> Hiện
            }
        }
        
        return; 
    }

    // --- Logic Khi CÓ sản phẩm ---
    
    // Hiện tổng tiền và nút thanh toán
    if (cartTotalDiv) cartTotalDiv.style.display = 'block';
    if (checkoutBtn) checkoutBtn.style.display = 'block';
    
    // Logic hiển thị biểu tượng/giỏ hàng lớn
    if (minimizedBtn) {
        // Kiểm tra xem giỏ hàng lớn đang mở hay không
        const isCartVisible = getComputedStyle(cartSec).display !== 'none';
        if (isCartVisible) {
            minimizedBtn.classList.remove('show'); // Giỏ lớn đang mở -> Ẩn
        } else {
            minimizedBtn.classList.add('show'); // Giỏ lớn đang đóng -> Hiện
        }
    }
    
    cartItemsDiv.innerHTML = ''; // Xóa nội dung "trống"

    const groupedCart = {};
    cart.forEach(item => {
        if (!groupedCart[item.id]) {
            groupedCart[item.id] = { ...item, totalQty: 0 };
        }
        groupedCart[item.id].totalQty += item.qty;
    });

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
}


// --- HÀM THAO TÁC GIỎ HÀNG ---
function decreaseItem(id) {
    const index = cart.findIndex(item => item.id === id); 
    if (index !== -1) {
        if (cart[index].qty > 1) {
            cart[index].qty--;
        } else {
            cart.splice(index, 1);
        }
    }
    saveCart(); 
}

function removeItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
}

function toggleCart() {
    const cartSec = document.getElementById('cart-section');
    const minimizedBtn = document.getElementById('minimized-cart-btn');

    // Kiểm tra xem giỏ hàng lớn có hiển thị không
    const isCartVisible = getComputedStyle(cartSec).display !== 'none';
    
    if (isCartVisible) {
        // HÀNH ĐỘNG: Bấm Đóng -> Thu nhỏ
        cartSec.style.opacity = '0';
        cartSec.style.transform = 'scale(0.8)';
        
        // Sau hoạt ảnh, ẩn 
        setTimeout(() => {
            cartSec.style.display = 'none';
        }, 300);
        
        if (minimizedBtn) {
            minimizedBtn.classList.add('show'); // Hiện biểu tượng với hiệu ứng
        }
        
    } else {
        // HÀNH ĐỘNG: Bấm thu nhỏ -> Mở lớn
        cartSec.style.display = 'block';
        
        setTimeout(() => {
            cartSec.style.opacity = '1';
            cartSec.style.transform = 'scale(1)';
        }, 10);
        
        if (minimizedBtn) {
            minimizedBtn.classList.remove('show');
        }
    }
}


function addToCart(id, quantity) {
  const product = products.find(p => p.id === id);
  const existingItem = cart.find(i => i.id === id);
  
  if (existingItem) {
    existingItem.qty += quantity;
  } else {
    cart.push({ ...product, qty: quantity });
  }
  
  saveCart();
  updateCartList()
}

// --- HÀM POPUP VÀ THANH TOÁN ---
function openModal(id) {
  const p = products.find(x => x.id === id);
  currentProductId = id;
  
  document.getElementById('m-img').src = p.img;
  document.getElementById('m-name').innerText = p.name;
  document.getElementById('m-price').innerText = p.price.toLocaleString('vi-VN') + 'đ';
  document.getElementById('m-desc').innerText = p.desc;
  document.getElementById('m-qty').value = 1;
  
  const modal = document.getElementById('product-modal');
  
  // const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  // const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  // modal.style.top = scrollTop + 'px'; 
  // modal.style.height = viewportHeight + 'px';
  modal.style.display = 'flex';
}

function closeModal() {
  const modal = document.getElementById('product-modal');
  modal.style.display = 'none';
}

window.onclick = function(event) {
  const modal = document.getElementById('product-modal');
  if (event.target == modal) {
    closeModal(); 
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

loadCart(); 
render();