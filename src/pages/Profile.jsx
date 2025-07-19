import { useState } from "react";
import { useAuth } from "../context/AuthContext"
import Layout from "../layouts/Layout";

const Profile = () => {
    const { user, logout, updateProfile } = useAuth();
    const [form, setForm] = useState({ name: user?.name || "",  email: user?.email, phone: user?.phone});

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.name || form.email || form.phone) {
                await updateProfile(form.name, form.email, form.phone);
                alert("Successfully Updated Profile");
            }
        } catch (err) {
            console.error('submit failed');
        }
    };

    return (
        <Layout>
            <div className="flex flex-col gap-5 h-screen-1/2">
                <h2 className="text-2xl font-bold">Update Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Nama"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                        <input
                            type="text"
                            placeholder="Email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                         <input
                            type="text"
                            placeholder="No Telepon"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className="border p-2 rounded w-full"
                        />
                    </div>
                    <button type="submit" className="mt-5 bg-blue-500 text-white px-4 py-2 rounded">
                        Update Profile
                    </button>
                </form>

                <button type="button" onClick={logout} className="justify-self-end w-[140px] bg-red-500 text-white px-4 py-2 rounded">
                    Logout
                </button>
            </div>
        </Layout>
    )
}   

export default Profile;