import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import Layout from "../layouts/Layout";
const STORAGE_KEY = "books";


const HomePage = () => {
  const {user} = useAuth() 
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const savedBooks = localStorage.getItem(STORAGE_KEY);
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    }
  }, []);

  const recentBooks = [...books].slice(-6).reverse();

  return (
    <Layout>
        <div>
          <main className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold mb-4 text-center text-gray-700 dark:text-gray-100">
              Selamat Datang di Kepegawaian Gedangan
            </h1>

            <p className="text-lg text-center mb-6">
              Hai <span className="font-semibold">{user?.username}</span>, selamat datang kembali!  
            </p>

            {recentBooks.length > 0 && (
              <section className="mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recentBooks.map((book) => (
                    <div key={book.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
                      {book.image && (
                        <img
                          src={book.image}
                          alt={book.title}
                          className="w-full h-40 object-cover"
                        />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold">{book.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {book.author} &middot; {book.year}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section className="bg-gray-200 dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
              <p>
                Aplikasi Manajemen Karyawan Gedangan membantu dalam pencatatan dan pengelolaan data karyawan secara efisien. Mulai dari informasi pribadi, jabatan, hingga kehadiran — semua tersedia dalam satu sistem yang mudah diakses.
                Gunakan fitur-fitur pada halaman Employee untuk mengelola data karyawan secara efektif dan mendukung produktivitas tim Anda.
              </p>
              <p>
                Anda dapat melakukan pencatatan dan pengelolaan data koleksi buku pada halaman Employees.
              </p>
            </section>
          </main>
        </div>
    </Layout>
  );
};

export default HomePage;
