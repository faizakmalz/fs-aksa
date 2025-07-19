import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const Layout = ({ children }) => {
    return (
        <div className="dark:bg-black">
            <Navbar/>
                <div className="min-h-[68vh] my-5 md:my-10 px-10 md:px-24 w-screen bg-white dark:bg-black text-black dark:text-white">
                    {children}
                </div>
            <Footer/>
        </div>
    )
}

export default Layout; 