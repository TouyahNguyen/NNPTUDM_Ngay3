document.addEventListener('DOMContentLoaded', () => {
    const productTable = document.getElementById('productTable');
    const searchInput = document.getElementById('searchInput');
    const pagination = document.getElementById('pagination');
    const limitSelect = document.getElementById('limit');
    const sortTitleButton = document.getElementById('sortTitle');
    const sortPriceButton = document.getElementById('sortPrice');

    let products = [];
    let currentPage = 1;
    let limit = parseInt(limitSelect.value);
    let sortConfig = { key: null, direction: 'asc' };

    const fetchData = async () => {
        try {
            const response = await fetch('https://api.escuelajs.co/api/v1/products');
            products = await response.json();
            renderTable();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const renderTable = () => {
        productTable.innerHTML = '';
        const filteredProducts = products.filter(product =>
            product.title.toLowerCase().includes(searchInput.value.toLowerCase())
        );

        sortProducts(filteredProducts);

        const paginatedProducts = filteredProducts.slice((currentPage - 1) * limit, currentPage * limit);

        paginatedProducts.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    ${product.title}
                    <div class="description">${product.description}</div>
                </td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category.name}</td>
                <td><img src="${product.images[0]}" alt="${product.title}" width="50" class="rounded"></td>
            `;
            productTable.appendChild(row);
        });

        renderPagination(filteredProducts.length);
        updateSortButtons();
    };

    const sortProducts = (productsToSort) => {
        if (sortConfig.key) {
            productsToSort.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'title') {
                    aValue = aValue.toLowerCase();
                    bValue = bValue.toLowerCase();
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
    };

    const renderPagination = (totalItems) => {
        pagination.innerHTML = '';
        const totalPages = Math.ceil(totalItems / limit);

        for (let i = 1; i <= totalPages; i++) {
            const li = document.createElement('li');
            li.className = `page-item ${i === currentPage ? 'active' : ''}`;
            li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
            li.addEventListener('click', (e) => {
                e.preventDefault();
                currentPage = i;
                renderTable();
            });
            pagination.appendChild(li);
        }
    };

    const updateSortButtons = () => {
        // Reset icons
        sortTitleButton.innerHTML = 'Title <i class="bi bi-arrow-down-up"></i>';
        sortPriceButton.innerHTML = 'Price <i class="bi bi-arrow-down-up"></i>';

        if (sortConfig.key === 'title') {
            const icon = sortConfig.direction === 'asc' ? 'bi-sort-alpha-down' : 'bi-sort-alpha-up';
            sortTitleButton.innerHTML = `Title <i class="bi ${icon}"></i>`;
        } else if (sortConfig.key === 'price') {
            const icon = sortConfig.direction === 'asc' ? 'bi-sort-numeric-down' : 'bi-sort-numeric-up';
            sortPriceButton.innerHTML = `Price <i class="bi ${icon}"></i>`;
        }
    };

    searchInput.addEventListener('input', () => {
        currentPage = 1;
        renderTable();
    });

    limitSelect.addEventListener('change', () => {
        limit = parseInt(limitSelect.value);
        currentPage = 1;
        renderTable();
    });

    sortTitleButton.addEventListener('click', () => {
        if (sortConfig.key === 'title') {
            sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.key = 'title';
            sortConfig.direction = 'asc';
        }
        renderTable();
    });

    sortPriceButton.addEventListener('click', () => {
        if (sortConfig.key === 'price') {
            sortConfig.direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
        } else {
            sortConfig.key = 'price';
            sortConfig.direction = 'asc';
        }
        renderTable();
    });

    fetchData();
});