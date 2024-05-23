document.addEventListener('DOMContentLoaded', function () {

    const bookList = document.getElementById('booksList');
    let booksData;
    let currentBookId;

    window.myModal = new bootstrap.Modal(document.getElementById('bookModal'));

    window.loadBooks = function () {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'http://localhost:8081/OOPServlLab5_war_exploded/books', true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                booksData = JSON.parse(xhr.responseText);
                displayBooks(booksData);
            } else {
                console.error('Произошла ошибка при загрузке списка книг ', xhr.statusText);
            }
        };

        xhr.send();
    }

    function displayBooks(books) {
        let tableHTML = `
        <tbody>
    `;

        books.forEach(function (book) {
            tableHTML += `
            <tr>
                <td>${book.Title}</td>
                <td>${book.Author}</td>
                <td>${book.Genre}</td>
                <td>${book.Publishing}</td>
                <td>${book.ISBN}</td>
                <td>
                    <button onclick="editBook(${book.ID})">Редактировать</button>
                    <button onclick="deleteBook(${book.ID})">Удалить</button>
                </td>
            </tr>
        `;
        });

        tableHTML += `
        </tbody>
    `;

        bookList.innerHTML = tableHTML;
    }

    window.editBook = function (bookId) {
        const selectedBook = booksData.find(book => book.ID === bookId);

        document.getElementById('editTitle').value = selectedBook.Title;
        document.getElementById('editAuthor').value = selectedBook.Author;
        document.getElementById('editGenre').value = selectedBook.Genre;
        document.getElementById('editPublishing').value = selectedBook.Publishing;
        document.getElementById('editISBN').value = selectedBook.ISBN;
        currentBookId = bookId;
        myModal.show();
    }

    window.closeEdit = function () {
        myModal.hide();
    }

    window.saveChanges = function () {
        const title = document.getElementById('editTitle').value;
        const author = document.getElementById('editAuthor').value;
        const genre = document.getElementById('editGenre').value;
        const publish = document.getElementById('editPublishing').value;
        const isbn = document.getElementById('editISBN').value;

        const xhr = new XMLHttpRequest();

        xhr.open('PUT', `http://localhost:8081/OOPServlLab5_war_exploded/books`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadBooks();
                myModal.hide();
            } else {
                console.error('Произошла ошибка при сохранении изменений: ', xhr.statusText);
            }
        };

        xhr.send(JSON.stringify({
            Title: title,
            Author: author,
            Genre: genre,
            Publishing: publish,
            ISBN: isbn,
            ID: currentBookId
        }));
    }

    window.deleteBook = function (bookId) {
        const xhr = new XMLHttpRequest();
        xhr.open('DELETE', `http://localhost:8081/OOPServlLab5_war_exploded/books?id=${bookId}`, true);

        xhr.onload = function () {
            if (xhr.status === 200) {
                loadBooks();
            } else {
                console.error('Произошла ошибка при удалении книги:', xhr.statusText);
            }
        };

        xhr.send();
        console.log("Удаление книги с ID:", bookId);
    }

    loadBooks();
});
