<template>
  <div>
    <h1>Add Book</h1>
    <form @submit.prevent="addBook">
      <div>
        <label for="isbn">ISBN:</label>
        <input type="text" v-model="isbn" id="isbn" required />
      </div>
      <div>
        <label for="name">Name:</label>
        <input type="text" v-model="name" id="name" required />
      </div>
      <button type="submit">Add Book</button>
    </form>

    <hr />

    <h1>Books with ISBN > 1000</h1>
    <div>
      <label for="searchIsbn">ISBN search:</label>
      <input type="text" v-model="searchIsbn" id="searchIsbn" />
      <button @click="searchByIsbn">search</button>
      <button @click="resetSearch">reset</button>
    </div>
    
    <ul>
      <li v-for="book in books" :key="book.id">
        <div v-if="editingId === book.id">
          <input type="text" v-model="editName" />
          <input type="text" v-model="editIsbn" />
          <button @click="updateBook(book.id)">save</button>
          <button @click="cancelEdit">cancel</button>
        </div>
        <div v-else>
          {{ book.name }} - ISBN: {{ book.isbn }}
          <button @click="startEdit(book)">edit</button>
          <button @click="deleteBook(book.id)">delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import db from '../firebase/init.js';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc
} from 'firebase/firestore';

export default {
  setup() {

    const isbn = ref('');
    const name = ref('');


    const books = ref([]);


    const editingId = ref(null);
    const editName = ref('');
    const editIsbn = ref('');


    const searchIsbn = ref('');


    const fetchBooks = async (isbnQuery = null) => {
      try {
        let q;
        if (isbnQuery) {
 
          q = query(collection(db, 'books'), where('isbn', '==', Number(isbnQuery)));
        } else {

          q = query(collection(db, 'books'), where('isbn', '>', 1000));
        }

        const querySnapshot = await getDocs(q);
        const booksArray = [];
        querySnapshot.forEach((doc) => {
          booksArray.push({ id: doc.id, ...doc.data() });
        });
        books.value = booksArray;
      } catch (error) {
        console.error('Error fetching books: ', error);
      }
    };


    const addBook = async () => {

      try {
        const isbnNumber = Number(isbn.value);
        if (isNaN(isbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }

        await addDoc(collection(db, 'books'), {
          isbn: isbnNumber,
          name: name.value
        });

        isbn.value = '';
        name.value = '';
        alert('Book added successfully!');
        fetchBooks();
      } catch (error) {
        console.error('Error adding book: ', error);
      }
    };
    

    const deleteBook = async (bookId) => {

      try {
        await deleteDoc(doc(db, 'books', bookId));
        alert('Book deleted successfully!');
        fetchBooks(); 
      } catch (error) {
        console.error('Error deleting book: ', error);
      }
    };


    const startEdit = (book) => {

      editingId.value = book.id;
      editName.value = book.name;
      editIsbn.value = book.isbn;
    };


    const cancelEdit = () => {

      editingId.value = null;
    };


    const updateBook = async (bookId) => {

      try {
        const bookRef = doc(db, 'books', bookId);
        const newIsbnNumber = Number(editIsbn.value);
        if (isNaN(newIsbnNumber)) {
          alert('ISBN must be a valid number');
          return;
        }
        await updateDoc(bookRef, {
          name: editName.value,
          isbn: newIsbnNumber,
        });
        alert('Book updated successfully!');
        cancelEdit();
        fetchBooks();
      } catch (error) {
        console.error('Error updating book: ', error);
      }
    };
    

    const searchByIsbn = () => {
      if (searchIsbn.value) {
        fetchBooks(searchIsbn.value);
      } else {
        alert(' ISBN number');
      }
    };


    const resetSearch = () => {
      searchIsbn.value = '';
      fetchBooks();
    };



    onMounted(() => {
      fetchBooks();
    });

    return {
      isbn,
      name,
      addBook,
      books,
      deleteBook,
      startEdit,
      cancelEdit,
      editingId,
      editName,
      editIsbn,
      updateBook,
      searchIsbn,
      searchByIsbn,
      resetSearch
    };
  },
};
</script>