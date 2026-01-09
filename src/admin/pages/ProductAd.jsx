import React, { useState, useContext, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-toastify";

const ALL_SIZES = ["XS", "S", "M", "L", "XL"];

function ProductAd() {
  const { products, addProduct, updateProduct, deleteProduct } =
    useContext(AppContext);

  const emptyForm = {
    id: null,
    name: "",
    price: "",
    category: "",
    des: "",
    sizes: [],
    images: [""],
  };

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || "");
    return ["All", ...Array.from(new Set(cats))];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") return products;
    return products.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const toggleSize = (size) => {
    setForm((p) => ({
      ...p,
      sizes: p.sizes.includes(size)
        ? p.sizes.filter((s) => s !== size)
        : [...p.sizes, size],
    }));
  };

  const handleImageChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const addImageField = () => {
    setForm((p) => ({ ...p, images: [...p.images, ""] }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.images[0]) {
      toast.error("Main image is required");
      return;
    }

    const existingProduct = products.find(
      (p) => String(p.id) === String(form.id)
    );

    const nextId =
      products.length > 0
        ? Math.max(...products.map((p) => Number(p.id))) + 1
        : 1;

    const cleanedImages = [
      ...new Set([form.images[0], ...(form.images || [])].filter(Boolean)),
    ];

    const productData = {
      ...(existingProduct || {}),
      id: isEditing ? String(form.id) : String(nextId),
      name: form.name.trim(),
      price: Number(form.price),
      category: form.category.trim(),
      des: form.des.trim(),
      sizes: form.sizes.length ? form.sizes : ["S", "M", "L", "XL"],
      img: cleanedImages[0],
      images: cleanedImages,
    };

    try {
      isEditing
        ? await updateProduct(productData)
        : await addProduct(productData);

      toast.success(isEditing ? "Product updated" : "Product added");
      resetForm();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (product) => {
    const mergedImages = product.images?.length
      ? product.images.includes(product.img)
        ? product.images
        : [product.img, ...product.images.filter(Boolean)]
      : product.img
      ? [product.img]
      : [""];

    setForm({
      id: product.id,
      name: product.name || "",
      price: product.price || "",
      category: product.category || "",
      des: product.des || "",
      sizes: product.sizes || ["S", "M", "L", "XL"],
      images: mergedImages,
    });

    setIsEditing(true);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await deleteProduct(id);
    toast.success("Product deleted");
  };

  return (
    <div className="min-h-screen bg-[#cfd4d6] text-[#2f2926] p-20">
      <div className="flex gap-4 mb-6 items-center">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#cfd4d6] border border-white rounded-lg px-4 py-2 focus:outline-none"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#cfd4d6]">
              {cat}
            </option>
          ))}
        </select>

        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-[#2f2926] hover:bg-[#1f1a18] text-white px-5 py-2 rounded-lg"
          >
            + Add Product
          </button>
        )}
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-[#cfd4d6] border border-white rounded-2xl p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Name"
            className="bg-[#e1e3e2] p-3 rounded-lg border border-white focus:outline-none"
          />

          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="bg-[#e1e3e2] p-3 rounded-lg border border-white focus:outline-none"
          />

          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Category"
            className="bg-[#e1e3e2] p-3 rounded-lg border border-white focus:outline-none"
          />

          <textarea
            name="des"
            value={form.des}
            onChange={handleChange}
            placeholder="Description"
            className="bg-[#e1e3e2] p-3 border border-white rounded-lg md:col-span-2 focus:outline-none"
          />

          <div className="md:col-span-2">
            <p className="font-medium mb-2">Sizes</p>
            <div className="flex gap-4">
              {ALL_SIZES.map((s) => (
                <label key={s} className="flex gap-2 text-sm">
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
            <p className="font-medium mb-2">Images (First = Main)</p>
            {form.images.map((url, i) => (
              <input
                key={i}
                value={url}
                onChange={(e) => handleImageChange(i, e.target.value)}
                placeholder={`Image URL ${i + 1}`}
                className="bg-[#e1e3e2] p-3 rounded-lg w-full mb-2 border border-white focus:outline-none"
              />
            ))}
            <button
              type="button"
              onClick={addImageField}
              className="text-blue-600 text-sm"
            >
              + Add Image
            </button>
          </div>

          <div className="flex gap-4 md:col-span-2">
            <button className="bg-[#2f2926] hover:bg-[#1f1a18] text-white p-3 rounded-lg w-full">
              {isEditing ? "Update Product" : "Add Product"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="bg-[#b94a32] hover:bg-[#a03e2a] text-white p-3 rounded-lg w-full"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-[#e1e3e2] border border-white/20 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10">
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Sizes</th>
              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr
                key={p.id}
                className="border-b border-white hover:bg-[#f3f4f5]"
              >
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">
                  {(p.sizes || ["S", "M", "L", "XL"]).join(", ")}
                </td>
                <td className="p-4">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                </td>
                <td className="p-4 flex gap-3">
                  <button
                    onClick={() => {
                      window.scrollTo({
                        top: 0,
                        behavior: "smooth", 
                      });
                      handleEdit(p);
                    }}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2f2926] text-white hover:bg-[#1f1a18]"
                  >
                    <FaRegEdit />
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-[#2f2926] text-white hover:bg-[#1f1a18]"
                  >
                    <FaRegTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductAd;
