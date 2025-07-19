import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import initialBooks from "../helpers/initialBooks";
import paginate from "../helpers/paginate";
import { useSearchParams } from "react-router-dom";

const STORAGE_KEY = "books";

const EmployeesPage = () => {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ id: null, title: "", author: "", year: "", image: "" });
  const [editing, setEditing] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 5;

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setBooks(JSON.parse(saved));
    } else {
      setBooks(initialBooks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBooks));
    }
  }, []);

  useEffect(() => {
    const params = {};
    if (searchTerm) params.q = searchTerm;
    params.page = String(page);
    setSearchParams(params);
  }, [searchTerm, page]);

  const saveToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { paginated: paginatedBooks, totalPages } = paginate(filteredBooks, page, 5);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.author || !form.year) return;

    let updatedBooks;
    if (editing) {
      updatedBooks = books.map((b) => (b.id === form.id ? form : b));
    } else {
      const newBook = { ...form, id: Date.now() };
      updatedBooks = [...books, newBook];
    }

    setBooks(updatedBooks);
    saveToStorage(updatedBooks);
    setForm({ id: null, title: "", author: "", year: "", image: "" });
    setEditing(false);
  };

  const handleEdit = (book) => {
    setForm(book);
    setEditing(true);
  };

  const handleDelete = (id) => {
    const updated = books.filter((b) => b.id !== id);
    setBooks(updated);
    saveToStorage(updated);
  };

  const goToPage = (newPage) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...currentParams, page: String(newPage) });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Buku</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6 bg-gray-100 dark:bg-black p-4 rounded shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Judul Buku"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border border-gray-300 dark:border-white p-2 rounded w-full"
            />
            <input
              type="text"
              placeholder="Penulis"
              value={form.author}
              onChange={(e) => setForm({ ...form, author: e.target.value })}
              className="border border-gray-300 dark:border-white p-2 rounded w-full"
            />
            <input
              type="number"
              placeholder="Tahun"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
              className="border border-gray-300 dark:border-white p-2 rounded w-full"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setForm((prev) => ({ ...prev, image: reader.result }));
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="border border-gray-300 dark:border-white p-2 rounded w-full"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editing ? "Update Buku" : "Tambah Buku"}
          </button>
        </form>

        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            placeholder="Cari judul..."
            value={searchTerm}
            onChange={(e) => {
              const q = e.target.value
              setSearchParams({ q, page: "1" });
            }}
            className="border border-gray-300 dark:border-white p-2 rounded w-full"
          />
        </div>

        <div className="rounded-lg">
          <table className="min-w-full rounded-lg text-left shadow-md">
            <thead className="bg-gray-200 rounded-lg dark:bg-gray-800">
              <tr className="rounded-lg">
                <th className="p-2">Judul</th>
                <th className="p-2">Penulis</th>
                <th className="p-2">Tahun</th>
                <th className="p-2">Cover</th>
                <th className="p-2">Aksi</th>
              </tr>
            </thead>
            <tbody className="rounded-lg">
              {paginatedBooks.map((book) => (
                <tr key={book.id} className="border-gray-400">
                  <td className="p-2">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.year}</td>
                  <td className="p-2">
                    {book.image && (
                      <img
                        src={book.image}
                        alt={book.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                    )}
                  </td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => handleEdit(book)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(book.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedBooks.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-700">
                    Tidak ada buku.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 rounded ${
                    page === i + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 dark:bg-gray-800 text-black dark:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EmployeesPage;
