/**
 * Advanced Shop Filtering and Sorting System
 * Handles product filtering, sorting, pagination, and view switching
 */

class ShopFilters {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.filters = {
            categories: [],
            sizes: [],
            colors: [],
            ratings: [],
            priceMin: 0,
            priceMax: 1000
        };
        this.sortBy = 'newest';
        this.viewMode = 'grid';
        
        this.init();
    }

    init() {
        this.loadProducts();
        this.attachEventListeners();
        this.applyFilters();
    }

    loadProducts() {
        // Sample products data - in production, this would come from Firebase
        this.products = [
            {
                id: 1,
                name: 'تيشيرت كلاسيك أسود',
                category: 'تيشيرتات',
                price: 150,
                originalPrice: 200,
                image: 'https://via.placeholder.com/300x300?text=T-Shirt+Black',
                images: {},
                sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
                colors: [
                    { name: 'أسود', hex: '#000000' },
                    { name: 'أبيض', hex: '#FFFFFF' },
                    { name: 'أحمر', hex: '#FF0000' }
                ],
                rating: 4.5,
                reviewCount: 128,
                stock: 45,
                soldCount: 500,
                badge: { type: 'sale', text: 'خصم 25%' }
            },
            {
                id: 2,
                name: 'قميص فورمال أبيض',
                category: 'قمصان',
                price: 250,
                originalPrice: 350,
                image: 'https://via.placeholder.com/300x300?text=Formal+Shirt',
                images: {},
                sizes: ['S', 'M', 'L', 'XL'],
                colors: [
                    { name: 'أبيض', hex: '#FFFFFF' },
                    { name: 'أزرق', hex: '#0000FF' }
                ],
                rating: 4.8,
                reviewCount: 95,
                stock: 30,
                soldCount: 320,
                badge: { type: 'bestseller', text: 'الأكثر مبيعاً' }
            },
            {
                id: 3,
                name: 'فستان أنيق أحمر',
                category: 'فساتين',
                price: 350,
                originalPrice: 500,
                image: 'https://via.placeholder.com/300x300?text=Dress+Red',
                images: {},
                sizes: ['XS', 'S', 'M', 'L'],
                colors: [
                    { name: 'أحمر', hex: '#FF0000' },
                    { name: 'أسود', hex: '#000000' }
                ],
                rating: 4.6,
                reviewCount: 87,
                stock: 20,
                soldCount: 250,
                badge: { type: 'new', text: 'جديد' }
            },
            {
                id: 4,
                name: 'حذاء رياضي أزرق',
                category: 'أحذية',
                price: 200,
                originalPrice: null,
                image: 'https://via.placeholder.com/300x300?text=Sports+Shoe',
                images: {},
                sizes: ['35', '36', '37', '38', '39', '40', '41', '42'],
                colors: [
                    { name: 'أزرق', hex: '#0000FF' },
                    { name: 'أسود', hex: '#000000' }
                ],
                rating: 4.7,
                reviewCount: 156,
                stock: 50,
                soldCount: 680,
                badge: null
            },
            {
                id: 5,
                name: 'جاكيت جلد أسود',
                category: 'جاكيتات',
                price: 450,
                originalPrice: 600,
                image: 'https://via.placeholder.com/300x300?text=Leather+Jacket',
                images: {},
                sizes: ['XS', 'S', 'M', 'L', 'XL'],
                colors: [
                    { name: 'أسود', hex: '#000000' },
                    { name: 'بني', hex: '#8B4513' }
                ],
                rating: 4.9,
                reviewCount: 203,
                stock: 15,
                soldCount: 420,
                badge: { type: 'bestseller', text: 'الأكثر مبيعاً' }
            },
            {
                id: 6,
                name: 'بنطال جينز أزرق',
                category: 'بناطيل',
                price: 180,
                originalPrice: 250,
                image: 'https://via.placeholder.com/300x300?text=Jeans+Blue',
                images: {},
                sizes: ['28', '30', '32', '34', '36', '38'],
                colors: [
                    { name: 'أزرق', hex: '#0000FF' },
                    { name: 'أسود', hex: '#000000' }
                ],
                rating: 4.4,
                reviewCount: 142,
                stock: 60,
                soldCount: 890,
                badge: { type: 'sale', text: 'خصم 28%' }
            }
        ];
    }

    attachEventListeners() {
        // Category filters
        document.querySelectorAll('[data-category]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateCategoryFilters());
        });

        // Size filters
        document.querySelectorAll('[data-size]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSizeFilters());
        });

        // Color filters
        document.querySelectorAll('[data-color]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateColorFilters());
        });

        // Rating filters
        document.querySelectorAll('[data-rating]').forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateRatingFilters());
        });

        // Price filters
        document.getElementById('priceMin').addEventListener('change', () => this.updatePriceFilter());
        document.getElementById('priceMax').addEventListener('change', () => this.updatePriceFilter());
        document.getElementById('priceSlider').addEventListener('input', () => this.updatePriceFilter());

        // Sort
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.applyFilters();
        });

        // Clear filters
        document.querySelector('.clear-filters-btn').addEventListener('click', () => this.clearAllFilters());

        // View toggle
        document.getElementById('gridView').addEventListener('click', () => this.switchView('grid'));
        document.getElementById('listView').addEventListener('click', () => this.switchView('list'));
    }

    updateCategoryFilters() {
        const checked = document.querySelectorAll('[data-category]:checked');
        this.filters.categories = Array.from(checked).map(cb => cb.dataset.category);
        this.currentPage = 1;
        this.applyFilters();
    }

    updateSizeFilters() {
        const checked = document.querySelectorAll('[data-size]:checked');
        this.filters.sizes = Array.from(checked).map(cb => cb.dataset.size);
        this.currentPage = 1;
        this.applyFilters();
    }

    updateColorFilters() {
        const checked = document.querySelectorAll('[data-color]:checked');
        this.filters.colors = Array.from(checked).map(cb => cb.dataset.color);
        this.currentPage = 1;
        this.applyFilters();
    }

    updateRatingFilters() {
        const checked = document.querySelectorAll('[data-rating]:checked');
        this.filters.ratings = Array.from(checked).map(cb => parseInt(cb.dataset.rating));
        this.currentPage = 1;
        this.applyFilters();
    }

    updatePriceFilter() {
        const minInput = document.getElementById('priceMin');
        const maxInput = document.getElementById('priceMax');
        const slider = document.getElementById('priceSlider');

        this.filters.priceMin = parseInt(minInput.value) || 0;
        this.filters.priceMax = parseInt(maxInput.value) || 1000;

        slider.value = this.filters.priceMax;

        this.currentPage = 1;
        this.applyFilters();
    }

    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Category filter
            if (this.filters.categories.length > 0 && !this.filters.categories.includes(product.category)) {
                return false;
            }

            // Price filter
            if (product.price < this.filters.priceMin || product.price > this.filters.priceMax) {
                return false;
            }

            // Size filter
            if (this.filters.sizes.length > 0) {
                const hasSizeMatch = this.filters.sizes.some(size => product.sizes.includes(size));
                if (!hasSizeMatch) return false;
            }

            // Color filter
            if (this.filters.colors.length > 0) {
                const hasColorMatch = this.filters.colors.some(color => 
                    product.colors.some(c => c.name === color)
                );
                if (!hasColorMatch) return false;
            }

            // Rating filter
            if (this.filters.ratings.length > 0) {
                const minRating = Math.min(...this.filters.ratings);
                if (product.rating < minRating) return false;
            }

            return true;
        });

        // Apply sorting
        this.sortProducts();

        // Update UI
        this.updateResultsInfo();
        this.renderProducts();
        this.renderPagination();
    }

    sortProducts() {
        switch (this.sortBy) {
            case 'price-low':
                this.filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                this.filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'best-selling':
                this.filteredProducts.sort((a, b) => b.soldCount - a.soldCount);
                break;
            case 'rating':
                this.filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
            default:
                this.filteredProducts.sort((a, b) => b.id - a.id);
        }
    }

    renderProducts() {
        const container = document.getElementById('productsContainer');
        const start = (this.currentPage - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(start, end);

        if (pageProducts.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">🔍</div>
                    <h3 class="empty-state-title">لم يتم العثور على منتجات</h3>
                    <p class="empty-state-text">جرب تغيير معايير البحث أو الفلاتر</p>
                    <button class="clear-filters-btn" onclick="location.reload()">إعادة تعيين الفلاتر</button>
                </div>
            `;
            return;
        }

        container.innerHTML = pageProducts.map(product => createProductCardHTML(product)).join('');

        // Initialize product cards
        container.querySelectorAll('.product-card-advanced').forEach(card => {
            new ProductCard(card);
        });
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let html = '';

        // Previous button
        if (this.currentPage > 1) {
            html += `<button class="pagination-btn" onclick="shopFilters.goToPage(${this.currentPage - 1})">السابق</button>`;
        }

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
            if (i === this.currentPage) {
                html += `<button class="pagination-btn active">${i}</button>`;
            } else if (i <= 3 || i > totalPages - 3 || Math.abs(i - this.currentPage) <= 1) {
                html += `<button class="pagination-btn" onclick="shopFilters.goToPage(${i})">${i}</button>`;
            } else if (i === 4 || i === totalPages - 3) {
                html += `<span class="pagination-btn" style="cursor: default; border: none;">...</span>`;
            }
        }

        // Next button
        if (this.currentPage < totalPages) {
            html += `<button class="pagination-btn" onclick="shopFilters.goToPage(${this.currentPage + 1})">التالي</button>`;
        }

        container.innerHTML = html;
    }

    goToPage(page) {
        this.currentPage = page;
        this.renderProducts();
        this.renderPagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateResultsInfo() {
        document.getElementById('resultsCount').textContent = this.filteredProducts.length;
        document.getElementById('totalCount').textContent = this.products.length;
    }

    clearAllFilters() {
        // Clear all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Reset price inputs
        document.getElementById('priceMin').value = 0;
        document.getElementById('priceMax').value = 1000;
        document.getElementById('priceSlider').value = 1000;

        // Reset filters
        this.filters = {
            categories: [],
            sizes: [],
            colors: [],
            ratings: [],
            priceMin: 0,
            priceMax: 1000
        };

        this.currentPage = 1;
        this.applyFilters();
    }

    switchView(mode) {
        this.viewMode = mode;
        const gridBtn = document.getElementById('gridView');
        const listBtn = document.getElementById('listView');
        const container = document.getElementById('productsContainer');

        if (mode === 'grid') {
            gridBtn.classList.add('active');
            listBtn.classList.remove('active');
            container.style.gridTemplateColumns = 'repeat(auto-fill, minmax(240px, 1fr))';
        } else {
            listBtn.classList.add('active');
            gridBtn.classList.remove('active');
            container.style.gridTemplateColumns = '1fr';
        }
    }
}

// Initialize shop filters when DOM is ready
let shopFilters;
document.addEventListener('DOMContentLoaded', function() {
    shopFilters = new ShopFilters();
});
