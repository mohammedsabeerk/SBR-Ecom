import { useState, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { useAppContext } from "../../context/AppContext";
import api from "../../api/axios";
import { toast } from "react-toastify";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];
const EMPTY_FORM = {
  _id: null,
  name: "",
  price: "",
  category: "",
  des: "",
  sizes: [],
  images: [],
  stock: "",
};

function ProductAd() {
  const { products, setProducts } = useAppContext();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteBox, setShowDeleteBox] = useState(false);
  const [deleteProductData, setDeleteProductData] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const categories = useMemo(() => {
    const cats = (products || []).map((p) => p.category).filter(Boolean);
    return ["All", ...new Set(cats)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products || [];
    return (products || []).filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleSize = (size) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.images.length) {
      toast.error("Main image is required");
      return;
    }

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("des", form.des);
    formData.append("stock", form.stock);
    formData.append("sizes", JSON.stringify(form.sizes));

    // Split into new File objects vs existing Cloudinary URLs
    const newImages = [];
    const existingImages = [];

    form.images.forEach((img) => {
      if (img instanceof File) {
        newImages.push(img);
      } else {
        existingImages.push(img);
      }
    });

    newImages.forEach((file) => formData.append("images", file));
    formData.append("existingImages", JSON.stringify(existingImages));

    try {
      if (isEditing) {
        // ✅ FIXED: was /products/:id → now /admin/products/:id
        const res = await api.put(`/admin/products/${form._id}`, formData);
        const updatedProduct = res.data.product || res.data;

        setProducts((prev) =>
          prev.map((p) => (p._id === form._id ? updatedProduct : p))
        );
        toast.success("Product updated");
      } else {
        // ✅ FIXED: was /products → now /admin/products
        const res = await api.post("/admin/products", formData);
        const newProduct = res.data.product || res.data;

        setProducts((prev) => [...(prev || []), newProduct]);
        toast.success("Product added");
      }
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
      console.error("Full error:", error.response?.data);
    }
  };

  const handleEdit = (product) => {
    setForm({
      _id: product._id,
      name: product.name || "",
      price: product.price || "",
      stock: product.stock || "",
      category: product.category || "",
      des: product.des || "",
      sizes: product.sizes || [],
      images: product.images || [],
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteClick = (product) => {
    setDeleteProductData(product);
    setShowDeleteBox(true);
  };

  const confirmDeleteProduct = async () => {
    try {
      // ✅ FIXED: was /products/:id → now /admin/products/:id
      await api.delete(`/admin/products/${deleteProductData._id}`);

      setProducts((prev) =>
        prev.filter((p) => p._id !== deleteProductData._id)
      );
      toast.success("Product deleted");
      setShowDeleteBox(false);
      setDeleteProductData(null);
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] p-4 md:p-20">
      {showDeleteBox && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-[#e1e3e2] rounded-2xl p-6 w-[90%] max-w-md">
            <h2 className="text-lg font-semibold mb-4">Delete Product</h2>
            <p className="mb-6">
              Are you sure you want to delete <b>{deleteProductData?.name}</b>?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteBox(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                No
              </button>
              <button
                onClick={confirmDeleteProduct}
                className="px-4 py-2 bg-[#b94a32] text-white rounded-lg"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4 mb-6 sm:items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#cfd4d6] border border-white rounded-lg px-4 py-2"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {!showForm && (
          <button
            onClick={() => {
              setShowForm(true);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="bg-[#2f2926] text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#cfd4d6] border border-white rounded-2xl p-4 md:p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="border p-2 rounded-lg"
            required
          />
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="border p-2 rounded-lg"
            required
          />
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock"
            className="border p-2 rounded-lg"
            required
          />
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded-lg"
            required
          />

          <textarea
            name="des"
            value={form.des}
            onChange={handleChange}
            placeholder="Description"
            className="md:col-span-2 border p-2 rounded-lg"
          />

          <div className="md:col-span-2">
            <p className="font-medium mb-2">Sizes</p>
            <div className="flex flex-wrap gap-4">
              {ALL_SIZES.map((s) => (
                <label key={s} className="flex gap-2 text-sm items-center">
                  <input
                    type="checkbox"
                    checked={form.sizes.includes(s)}
                    onChange={() => toggleSize(s)}
                  />
                  {s}
                </label>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <p className="font-medium mb-2">Upload Images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                const updatedImages = [...form.images, ...newFiles];
                if (updatedImages.length > 3) {
                  toast.error("Maximum 3 images allowed");
                  return;
                }
                setForm((prev) => ({ ...prev, images: updatedImages }));
              }}
              className="w-full border p-2 rounded-lg"
            />
            <p className="text-sm text-gray-500 mt-2">First image = Main image</p>

            <div className="mt-3 flex flex-col gap-2">
              {form.images.map((img, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-lg"
                >
                  <p className="text-sm truncate">
                    {img instanceof File ? img.name : `Image ${index + 1}`}
                  </p>
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index),
                      }))
                    }
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          {form.images.length > 0 && (
            <div className="flex gap-3 flex-wrap mt-4 md:col-span-2">
              {form.images.map((img, index) => {
                let imgSrc =
                  img instanceof File
                    ? URL.createObjectURL(img)
                    : img.startsWith("http")
                    ? img
                    : `http://127.0.0.1:8001/${img.replace(/^\//, "")}`;

                return (
                  <img
                    key={index}
                    src={imgSrc}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                );
              })}
            </div>
          )}

          <div className="flex gap-4 md:col-span-2">
            <button
              type="submit"
              className="bg-[#2f2926] text-white p-3 rounded-lg w-full"
            >
              {isEditing ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="bg-[#b94a32] text-white p-3 rounded-lg w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-[#e1e3e2]">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Stock</th>
              <th className="p-3 text-left">Sizes</th>
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => {
              let imgSrc =
                (Array.isArray(p.images) ? p.images[0] : p.images) ||
                p.img ||
                p.image ||
                "";

              if (imgSrc && !imgSrc.startsWith("http")) {
                imgSrc = `${import.meta.env.VITE_BACKEND_URL}/${imgSrc}`;
              }

              return (
                <tr
                  key={p._id}
                  className="bg-[#e1e3e2] hover:bg-[#cfd4d6] transition"
                >
                  <td className="p-3">{p.name}</td>
                  <td className="p-3">{p.category}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    {(p.sizes?.length ? p.sizes : ["S", "M", "L", "XL"]).join(", ")}
                  </td>
                  <td className="p-3">
                    <img
                      src={imgSrc || "https://placehold.co/80x80?text=IMG"}
                      alt={p.name}
                      className="w-20 h-20 object-cover rounded-lg"
                      onError={(e) => {
                        e.target.src = "https://placehold.co/80x80?text=IMG";
                      }}
                    />
                  </td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-xl hover:scale-110 transition"
                    >
                      <FaRegEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(p)}
                      className="text-xl hover:scale-110 transition text-red-600"
                    >
                      <FaRegTrashAlt />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductAd;

