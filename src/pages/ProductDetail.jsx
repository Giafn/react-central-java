import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Untuk mengambil params dari URL
import Header from "../components/Header";
import Footer from "../components/Footer";
import Card from "../components/KategoriCard";

const ProductDetail = () => {
  const { id } = useParams(); // Mengambil id produk dari URL
  const [popular, setPopular] = useState([]);
  const [product, setProduct] = useState(null); // Data produk
  const [mainImage, setMainImage] = useState(""); // Gambar utama produk
  const [quantity, setQuantity] = useState(1); // Jumlah produk
  const [activeTab, setActiveTab] = useState("deskripsi"); // Tab aktif

  // Mengambil data produk dari API
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/items/${id}`);
        const data = await response.json();
        if (data) {
          setProduct(data);
          setMainImage("http://localhost:3000/" + data.images[0]?.url || ""); // Set gambar pertama
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    const fetchPopular = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/items?limit=4&filterBy=popular`);
        const data = await response.json();

        setPopular(data);
      } catch (err) {
        console.error("Error fetching popular products:", err);
      }
    };

    fetchProductData();
    fetchPopular();
  }, [id]);

  // Fungsi untuk menambah jumlah produk
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  // Fungsi untuk mengurangi jumlah produk
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Fungsi untuk membuka tab
  const openTab = (tabName) => {
    setActiveTab(tabName);
  };

  // Fungsi untuk menambah produk ke keranjang
  const addToCart = () => {
    console.log("Produk ditambahkan ke keranjang:", product);
    // Implementasi logika untuk menambahkan produk ke keranjang
  };

  const isNew = (createdAt) => {
    const now = new Date();
    const created = new Date(createdAt);
    const diff = now - created;
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDays <= 10;
  }

  if (!product) {
    return <div>Loading...</div>;
  }

  const rating = 4.5; // Rating produk
  return (
    <div className="bg-white text-gray-800">
      <Header />

      {/* Subheader */}
      <div className="container mt-24 mx-auto flex items-center py-4 px-6 border-b border-black">
        <i className="fas fa-shopping-bag text-2xl mr-2"></i>
        <span className="text-xl font-bold">Membeli</span>
      </div>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-6">
        <div className="flex space-x-8">
          {/* Product Image */}
          <div className="w-1/2">
            <img
              id="mainImage"
              alt={product.name}
              className="w-[500px] h-[500px]"
              height="600"
              src={mainImage}
            />
          </div>

          {/* Product Details */}
          <div className="w-1/2">
            <h1 className="text-2xl font-bold">{product.name}</h1>
            <p className="mt-2">{product.desc}</p>
            <div className="flex items-center mt-4">
              <div className="flex items-center text-yellow-500">
                {/* loop rating */}
                {[...Array(Math.floor(rating))].map((_, index) => {
                  const starClass = index < rating ? "fas" : "far";
                  return <i key={index} className={`${starClass} fa-star text-xl`}></i>;
                })}

              </div>
              <span className="ml-2">(90 Review)</span>
            </div>
            <div className="product-details">
              <div>
                <span>Produk</span>: {product.category.name}
              </div>
              <div>
                <span>Warna</span>: {product.color}
              </div>
              <div>
                <span>Ukuran</span>: {product.size}
              </div>
              <div>
                <span>Model</span>: {product.model}
              </div>
              <div>
                <span>Stok</span>: {product.stock > 10 ? "Tersedia" : product.stock + " Tersisa"}
              </div>
            </div>
            <div className="mt-4 text-red-600 text-xl font-bold">
              Rp. {product.price.toLocaleString()}
            </div>
            <div className="flex items-center mt-4 space-x-2">
              <div className="flex items-center border border-gray-300 rounded-md h-12">
                <button className="bg-gray-200 text-gray-800 px-4 py-2 h-full" onClick={decreaseQuantity}>
                  -
                </button>
                <input
                  className="w-16 text-center border-t border-b border-gray-300 h-full"
                  id="quantity"
                  type="number"
                  value={quantity}
                  readOnly
                />
                <button className="bg-gray-200 text-gray-800 px-4 py-2 h-full" onClick={increaseQuantity}>
                  +
                </button>
              </div>
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center h-12"
                onClick={addToCart}
              >
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-8">
          <div className="border-b border-gray-300">
            <ul className="flex space-x-8">
              <li
                className={`py-2 px-4 tablinks ${activeTab === "deskripsi" ? "active" : ""} cursor-pointer`}
                onClick={() => openTab("deskripsi")}
              >
                Deskripsi
              </li>
              <li
                className={`py-2 px-4 tablinks ${activeTab === "informasi" ? "active" : ""} cursor-pointer`}
                onClick={() => openTab("informasi")}
              >
                Informasi
              </li>
              <li className={`py-2 px-4 tablinks ${activeTab === "penilaian" ? "active" : ""} cursor-pointer`}
               onClick={() => openTab("penilaian")}>
                Penilaian Produk
              </li>
            </ul>
          </div>

          <div id="deskripsi" className={`tab-content mt-4 ${activeTab === "deskripsi" ? "block" : "hidden"} min-h-[200px]`}>
            <p>{product.desc}</p>
          </div>

          <div id="informasi" className={`tab-content mt-4 ${activeTab === "informasi" ? "block" : "hidden"} min-h-[200px]`}>
            <table className="w-full text-left">
              <tr>
                <td className="py-2">Kategori</td>
                <td className="py-2">{product.category.name}</td>
              </tr>
              <tr>
                <td className="py-2">Stok</td>
                <td className="py-2">{product.stock}</td>
              </tr>
              <tr>
                <td className="py-2">Harga</td>
                <td className="py-2">{product.price}</td>
              </tr>
              <tr>
                <td className="py-2">Info</td>
                <td className="py-2">{product.info}</td>
              </tr>
            </table>
          </div>

          <div id="penilaian" className={`tab-content mt-4 ${activeTab === "penilaian" ? "block" : "hidden"}`}>
            <div className="mt-4 text-center">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-red-600 text-xl font-bold">4.8 dari 5</span>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Semua</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Bintang 1 (2)</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Bintang 2 (3)</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Bintang 3 (5)</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Bintang 4 (50)</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Bintang 5 (75)</button>
              </div>
              <div className="flex items-center justify-center space-x-2 mt-2">
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Komentar (3)</button>
                <button className="border border-red-600 text-red-600 px-2 py-1 rounded-md text-sm">Gambar (3)</button>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-red-600 p-4 rounded-md">
                <div className="flex items-center">
                  <img alt="Ayu Prameswari" className="w-12 h-12 rounded-full" height="50" src="https://storage.googleapis.com/a1aa/image/8fZmE5GGzYxdW6vBhHDEXAnv4t4upa7TFLToijKFbTxw664JA.jpg" width="50" />
                  <div className="ml-4">
                    <h3 className="font-bold">Ayu Prameswari</h3>
                    <div className="flex items-center text-yellow-500">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="mt-4">Blouse ini sangat nyaman dipakai dan kualitas bahannya bagus! Desainnya modern tapi tetap mempertahankan motif tradisional. Pengiriman juga cepat. Pasti akan beli lagi di sini!</p>
              </div>
              <div className="border border-red-600 p-4 rounded-md">
                <div className="flex items-center">
                  <img alt="Tina Wijayanti" className="w-12 h-12 rounded-full" height="50" src="https://storage.googleapis.com/a1aa/image/f4eIfcOnoLHrkorNMp0MrNefbIVdXEtHyk4bZyeSH3UzVdd8E.jpg" width="50" />
                  <div className="ml-4">
                    <h3 className="font-bold">Tina Wijayanti</h3>
                    <div className="flex items-center text-yellow-500">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="mt-4">Blouse batik kekinian yang saya terima benar-benar sesuai ekspektasi! Bahannya adem dan motifnya indah. Pengemasan juga rapi. Terima kasih, ini belanja yang memuaskan!</p>
              </div>
              <div className="border border-red-600 p-4 rounded-md">
                <div className="flex items-center">
                  <img alt="Siti Aisyah" className="w-12 h-12 rounded-full" height="50" src="https://storage.googleapis.com/a1aa/image/9jsBlfSFpD1lfEqfSP7Pe7axn78EfFSLXMHL5tklAWtXsuOeE.jpg" width="50" />
                  <div className="ml-4">
                    <h3 className="font-bold">Siti Aisyah</h3>
                    <div className="flex items-center text-yellow-500">
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                      <i className="fas fa-star"></i>
                    </div>
                    <span className="text-gray-600">4.8</span>
                  </div>
                </div>
                <p className="mt-4">Dengan harga yang ditawarkan, kualitasnya sangat baik. Terasa sepadan dengan harga, bahkan lebih baik dari ekspektasi saya.</p>
              </div>
            </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold">Produk Terpopuler</h2>
            <div className="flex space-x-4 mt-4">
            <section className="w-4/1">
              <div className="grid grid-cols-4 gap-20 mx-">
                {popular.map((product) => (
                  <Card
                    key={product.id}
                    id={product.id}
                    img={"http://localhost:3000/" + product.images[0]?.url}
                    alt={product.name}
                    title={product.name}
                    price={product.price}
                    rating={4.5} // Assuming count_sold as a placeholder for rating
                    isNew={isNew(product.createdAt)}
                  />
                ))}
              </div>
            </section>
            </div>
          </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;
