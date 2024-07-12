document.addEventListener("DOMContentLoaded", function() {
    const addBookForm = document.getElementById('addBookForm');
    const filterInput = document.getElementById('filter');
    const bookTable = document.getElementById('bookTable').querySelector('tbody');
    const exportBtn = document.getElementById('exportBtn');

    let books = JSON.parse(localStorage.getItem('books')) || [];

    function renderBooks() {
        bookTable.innerHTML = '';
        const filteredBooks = books.filter(book => 
            book.title.toLowerCase().includes(filterInput.value.toLowerCase()) ||
            book.author.toLowerCase().includes(filterInput.value.toLowerCase())
        );

        filteredBooks.forEach((book, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td class="actions">
                    <button onclick="editBook(${index})">Edit</button>
                    <button onclick="deleteBook(${index})">Delete</button>
                </td>
            `;
            bookTable.appendChild(row);
        });
    }

    function saveBooks() {
        localStorage.setItem('books', JSON.stringify(books));
    }

    function addBook(title, author) {
        books.push({ title, author });
        saveBooks();
        renderBooks();
    }

    function deleteBook(index) {
        books.splice(index, 1);
        saveBooks();
        renderBooks();
    }

    function editBook(index) {
        const title = prompt("Enter new title:", books[index].title);
        const author = prompt("Enter new author:", books[index].author);

        if (title && author) {
            books[index].title = title;
            books[index].author = author;
            saveBooks();
            renderBooks();
        }
    }

    function exportBooks() {
        const csvContent = "data:text/csv;charset=utf-8," 
            + books.map(book => `${book.title},${book.author}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "books.csv");
        document.body.appendChild(link);

        link.click();
        document.body.removeChild(link);
    }

    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        
        addBook(title, author);
        addBookForm.reset();
    });

    filterInput.addEventListener('input', renderBooks);
    exportBtn.addEventListener('click', exportBooks);

    // Expose functions to the global scope for button onclick events
    window.editBook = editBook;
    window.deleteBook = deleteBook;

    // Initial render
    renderBooks();
});
