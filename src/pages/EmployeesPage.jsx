import { useEffect, useState } from "react";
import Layout from "../layouts/Layout";
import api from "../helpers/api";
import { useSearchParams } from "react-router-dom";

const EmployeesPage = () => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    id: null,
    name: "",
    phone: "",
    position: "",
    division: "",
    image: null,
  });
  const [editing, setEditing] = useState(false);
  const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });

  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(searchTerm);
  const page = Number(searchParams.get("page")) || 1;

  console.log("searchparams", searchParams.toString());
  console.log("searchterms", searchTerm);

  useEffect(() => {
    fetchEmployees();
  }, [searchParams]);

  const fetchEmployees = async () => {
    try {
      const res = await api.get("/employees", {
        params: { name: searchTerm, page },
      });
      setEmployees(res.data.data.employees);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("fetch failed", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("phone", form.phone);
    formData.append("position", form.position);
    formData.append("division", form.division);
    if (form.image instanceof File) {
      formData.append("image", form.image);
    }

    try {
      if (editing) {
        await api.post(`/employees/${form.id}?_method=PUT`, formData);
      } else {
        await api.post("/employees", formData);
      }
      resetForm();
      fetchEmployees();
    } catch (err) {
      console.error("submit failed", err.message);
    }
  };

  const handleEdit = (emp) => {
    setForm({
      id: emp.id,
      name: emp.name,
      phone: emp.phone,
      position: emp.position,
      division: emp.division.id,
      image: null,
    });
    setEditing(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      fetchEmployees();
    } catch (err) {
      console.error("delete failed", err.message);
    }
  };

  const resetForm = () => {
    setForm({
      id: null,
      name: "",
      phone: "",
      position: "",
      division: "",
      image: null,
    });
    setEditing(false);
  };

  const goToPage = (newPage) => {
    setSearchParams({ q: searchTerm, page: newPage.toString() });
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Daftar Pegawai</h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 mb-6 bg-gray-100 dark:bg-black p-4 rounded shadow"
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="text" placeholder="Nama" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="border p-2 rounded w-full" required />
            <input type="text" placeholder="No. Telepon" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border p-2 rounded w-full" required />
            <input type="text" placeholder="Posisi" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="border p-2 rounded w-full" required />
            <input type="number" placeholder="ID Divisi" value={form.division} onChange={(e) => setForm({ ...form, division: e.target.value })} className="border p-2 rounded w-full" required />
            <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} className="border p-2 rounded w-full" />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            {editing ? "Update Pegawai" : "Tambah Pegawai"}
          </button>
        </form>

        <div className="flex flex-col md:flex-row mb-4 gap-4 py-2 rounded">
          <input
            type="text"
            placeholder="Cari nama..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <button
            onClick={() => setSearchParams({ q: searchInput, page: "1" })}
            className="bg-blue-500 text-white px-4 rounded md:w-[200px]"
          >
            Cari
          </button>
        </div>


        <table className="min-w-full shadow-md text-left rounded">
          <thead className="bg-gray-200 dark:bg-gray-800">
            <tr>
              <th className="p-2">Nama</th>
              <th className="p-2">Telepon</th>
              <th className="p-2">Posisi</th>
              <th className="p-2">Divisi</th>
              <th className="p-2">Foto</th>
              <th className="p-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-t">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.phone}</td>
                <td className="p-2">{emp.position}</td>
                <td className="p-2">{emp.division.name}</td>
                <td className="p-2">
                  {emp.image && (
                    <img src={emp.image} alt={emp.name} className="w-16 h-16 object-cover rounded" />
                  )}
                </td>
                <td className="p-2 space-x-2">
                  <button onClick={() => handleEdit(emp)} className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(emp.id)} className="bg-red-500 text-white px-2 py-1 rounded">Hapus</button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-700">Tidak ada pegawai.</td>
              </tr>
            )}
          </tbody>
        </table>

        {pagination.last_page > 1 && (
          <div className="flex justify-center mt-4 space-x-2">
            {Array.from({ length: pagination.last_page }).map((_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  pagination.current_page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeesPage;
