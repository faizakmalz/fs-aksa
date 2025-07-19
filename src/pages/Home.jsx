import {useEffect, useState} from "react";
import {useAuth} from "../context/AuthContext";
import Layout from "../layouts/Layout";
import api from "../helpers/api";

const HomePage = () => {
  const {user} = useAuth()
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    fetchLatestEmployees();
  }, []);

  const fetchLatestEmployees = async () => {
    try {
      const res = await api.get("/employees", { params: { page: 1 } });
      const all = res.data.data.employees;
      console.log(all, "alllll")
      const latest = [...all].slice(-7).reverse();
      setEmployees(latest);
    } catch (err) {
      console.error("Failed to fetch employees:", err);
    }
  };

  const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1wbG95ZWV8ZW58MHx8MHx8fDA%3D";

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

          {employees.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Karyawan Terbaru</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {employees.map((emp) => (
                  <div key={emp.id} className="bg-white dark:bg-gray-700 shadow rounded-lg overflow-hidden">
                    <img
                      src={emp.image || DEFAULT_IMAGE}
                      alt={emp.name}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{emp.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {emp.position} &middot; {emp.division.name}
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
              Anda dapat melakukan pencatatan dan pengelolaan data pegawai pada halaman Employees.
            </p>
          </section>
        </main>
      </div>
    </Layout>
  );
};

export default HomePage;
