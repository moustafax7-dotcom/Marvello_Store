// js/admin.js
let editIndex = -1;

function checkAdmin() {
    const user = JSON.parse(localStorage.getItem('marvelloUser'));
    if (!user || user.role !== 'admin') window.location.href = '../index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    checkAdmin();
    renderMyProducts();
});

const productForm = document.getElementById('addProductForm');

if (productForm) {
    productForm.addEventListener('submit', (e) => {
        e.preventDefault();

        let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];

        // تحويل النصوص لمصفوفات
        const imagesStr = document.getElementById('pImages').value;
        const imagesArray = imagesStr.split(',').map(u => u.trim()).filter(u => u !== "");
        const sizesArray = document.getElementById('pSizes').value.split(',').map(s => s.trim()).filter(s => s !== "");
        const colorsArray = document.getElementById('pColors').value.split(',').map(c => c.trim()).filter(c => c !== "");

        const productData = {
            id: editIndex === -1 ? Date.now() : products[editIndex].id,
            name: document.getElementById('pName').value,
            price: Number(document.getElementById('pPrice').value),
            oldPrice: Number(document.getElementById('pOldPrice').value) || 0,
            stock: Number(document.getElementById('pStock').value) || 1,
            description: document.getElementById('pDesc').value,
            category: document.getElementById('pCategory').value,
            images: imagesArray.length > 0 ? imagesArray : ['https://placehold.co/300'],
            video: document.getElementById('pVideo').value || "",
            sizes: sizesArray,
            colors: colorsArray,
            reviews: editIndex === -1 ? [] : (products[editIndex].reviews || [])
        };

        if (editIndex === -1) {
            products.push(productData);
            alert('تم النشر! 🎉');
        } else {
            products[editIndex] = productData;
            alert('تم التعديل! ✅');
            resetForm();
        }

        localStorage.setItem('marvelloProducts', JSON.stringify(products));
        renderMyProducts();
        if(editIndex === -1) productForm.reset();
    });
}

function renderMyProducts() {
    const list = document.getElementById('addedProductsList');
    if(!list) return;
    const products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    list.innerHTML = '';
    products.forEach((p, index) => {
        list.innerHTML += `
            <li style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <div style="display:flex; align-items:center; gap:10px;">
                    <img src="${p.images[0]}" style="width:40px; height:40px; object-fit:cover;">
                    <div>
                        <b>${p.name}</b> <br>
                        <span style="font-size:12px; color:green;">${p.price} ج.م</span>
                        ${p.stock < 10 ? '<span style="color:red; font-size:11px;">(مخزون منخفض: '+p.stock+')</span>' : ''}
                    </div>
                </div>
                <div>
                    <button onclick="startEdit(${index})" style="color:blue; border:none; background:none; cursor:pointer;">تعديل</button>
                    <button onclick="deleteProduct(${index})" style="color:red; border:none; background:none; cursor:pointer;">حذف</button>
                </div>
            </li>
        `;
    });
}

window.startEdit = function(index) {
    let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
    const p = products[index];
    
    document.getElementById('pName').value = p.name;
    document.getElementById('pPrice').value = p.price;
    document.getElementById('pOldPrice').value = p.oldPrice || "";
    document.getElementById('pStock').value = p.stock;
    document.getElementById('pDesc').value = p.description;
    document.getElementById('pCategory').value = p.category;
    document.getElementById('pImages').value = p.images.join(', ');
    document.getElementById('pVideo').value = p.video || "";
    document.getElementById('pSizes').value = p.sizes ? p.sizes.join(', ') : "";
    document.getElementById('pColors').value = p.colors ? p.colors.join(', ') : "";

    editIndex = index;
    document.getElementById('saveBtn').innerText = "حفظ التعديلات";
    document.getElementById('cancelBtn').style.display = "block";
    window.scrollTo(0, 0);
}

window.resetForm = function() {
    editIndex = -1;
    productForm.reset();
    document.getElementById('saveBtn').innerText = "نشر المنتج";
    document.getElementById('cancelBtn').style.display = "none";
}

window.deleteProduct = function(index) {
    if(confirm('حذف؟')) {
        let products = JSON.parse(localStorage.getItem('marvelloProducts')) || [];
        products.splice(index, 1);
        localStorage.setItem('marvelloProducts', JSON.stringify(products));
        renderMyProducts();
    }
}
