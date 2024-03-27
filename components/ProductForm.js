import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Spinner from "./Spinner";
import { ReactSortable } from "react-sortablejs";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImage,
  category: existingCategory,
  properties: existingProperties,
}) {
  const [title, setTitle] = useState(existingTitle || "");
  const [description, setDescription] = useState(existingDescription || "");
  const [price, setPrice] = useState(existingPrice || 0);
  const [goToProducts, setGoToProducts] = useState(false);
  const [images, setImages] = useState(existingImage || []);
  const [category, setCategory] = useState(existingCategory || "");
  const [productProperties, setProductProperties] = useState(
    existingProperties || {}
  );
  const [isUpLoading, setIsUpLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("/api/categories")
      .then((response) => setCategories(response.data));
  }, []);
  async function saveProduct(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      // update
      await axios.put("/api/products", { ...data, _id });
    } else {
      // create
      await axios.post("/api/products", data);
    }

    setGoToProducts(true);
  }

  if (goToProducts === true) {
    router.push("/products");
  }

  async function uploadImages(ev) {
    const files = ev.target?.files;
    setIsUpLoading(true);
    if (files?.length > 0) {
      const data = new FormData();
      for (const file of files) {
        data.append("file", file);
      }
      const res = await axios.post("/api/upload", data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
    }
    setIsUpLoading(false);
  }

  function updateImagesOrder(images) {
    setImages(images);
  }

  function setProductProp(propName, value) {
    // setProductProperties({ ...productProperties, [propName]: value });
    setProductProperties((prev) => {
      const newProductProperties = { ...prev };
      newProductProperties[propName] = value;
      return newProductProperties;
    });
  }

  const propertiesToFill = [];

  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);
    {
      catInfo && propertiesToFill.push(...catInfo.properties);
    }

    while (catInfo?.parent?._id) {
      let parentCat = categories.find(
        ({ _id }) => _id === catInfo?.parent?._id
      );

      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label htmlFor="title" className="text-blue-900">
        Product Name
      </label>
      <input
        id="title"
        type="text"
        placeholder="Product name"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label className="text-blue-900">Categories</label>
      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        {/* <option value="">No Category</option> */}
        {categories.length > 0 &&
          categories.map((category) => (
            <option key={category} value={category._id}>
              {category.name}
            </option>
          ))}
      </select>

      {propertiesToFill.length > 0 &&
        propertiesToFill.map((property) => (
          <>
            <div className="flex gap-1">
              <div>{property.name}</div>

              <select
                value={productProperties[property.name]}
                onChange={(e) => setProductProp(property.name, e.target.value)}
              >
                {property.values.map((value) => (
                  <>
                    <option value={value}>{value}</option>;
                  </>
                ))}
              </select>
            </div>
          </>
        ))}
      <label className="text-blue-900">Photos</label>

      <div className="mb-2 flex flex-wrap gap-2">
        <ReactSortable
          className="flex flex-warp gap-2"
          list={images}
          setList={updateImagesOrder}
        >
          {!!images?.length &&
            images.map((link) => (
              <div
                className="h-24 bg-white p-4 shadow-sm rounded-md border border-gray-200"
                key={link}
              >
                <img src={link} alt="" className="rounded-lg" />
              </div>
            ))}
        </ReactSortable>

        {isUpLoading && (
          <div className="w-24 h-24 flex items-center justify-center">
            <Spinner />
          </div>
        )}
        <label>
          <div className="cursor-pointer bg-white border border-gray-200 h-24 w-24 rounded-lg flex justify-center items-center text-gray-500 gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              dataSlot="icon"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
              />
            </svg>
            <div>Upload</div>

            <input type="file" className="hidden" onChange={uploadImages} />
          </div>
        </label>
        {!images?.length && "No photos for this product"}
      </div>
      <label htmlFor="description" className="text-blue-900">
        Description
      </label>
      <textarea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label htmlFor="price" className="text-blue-900">
        Price
      </label>
      <input
        id="price"
        type="number"
        placeholder="Price in (USD)"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <button
        className="bg-blue-900 text-white p-4 rounded-xl text-xl w-full"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
