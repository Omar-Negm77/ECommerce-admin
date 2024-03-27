import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { withSwal } from "react-sweetalert2"; // for delete alert

function Categories({ swal }) {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [parentCategory, setParentCategory] = useState("");
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  function fetchCatgories() {
    axios.get("/api/categories").then((result) => setCategories(result.data));
  }

  async function saveCategory(e) {
    e.preventDefault();
    const data = {
      name,
      parentCategory,
      properties: properties.map((prop) => ({
        name: prop.name,
        values: prop.values.split(","),
      })),
    };

    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null);
    } else {
      await axios.post("/api/categories", data);
    }
    fetchCatgories();

    setName("");
    setParentCategory("");
    setProperties([]);
  }

  useEffect(() => {
    fetchCatgories();
  }, []);

  function editCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties);
  }

  function deleteCategory(category) {
    Swal.fire({
      title: `Are you sure you want to delete category ${category.name}?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: "cancel",
      confirmButtonColor: "red",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { _id } = category;
        await axios.delete("/api/categories?id=" + _id);
        fetchCatgories();
      }
    });
  }

  function addProperty() {
    setProperties((prev) => {
      return [...prev, { name: "", values: "" }];
    });
  }

  function handlePropertyNameChange(index, property, newName) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    });
  }

  function handlePropertyValuesChange(index, property, newValues) {
    setProperties((prev) => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    });
  }

  function deleteProperty(indexToDelete) {
    setProperties((prev) => {
      return [...prev].filter(
        (property, propertyIndex) => propertyIndex !== indexToDelete
      );
    });
  }

  let noParentCategory = "No parent category";
  return (
    <Layout>
      <h1>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : "Create new category"}
      </h1>
      <form onSubmit={saveCategory}>
        <div className="flex mb-4">
          <input
            required
            onChange={(e) => setName(e.target.value)}
            value={name}
            className="mb-0 mr-1"
            placeholder={"Category Name"}
          />
          <select
            className="mb-0 mr-1"
            value={parentCategory}
            onChange={(e) => setParentCategory(e.target.value)}
          >
            {/* <option value=""> No parent category</option> */}
            {categories.length > 0 &&
              categories.map((category) => (
                <>
                  <option value={category._id}>{category.name}</option>
                </>
              ))}
          </select>
        </div>
        <label className="text-blue-900 mb-2">Properties</label>

        {properties.length > 0 &&
          properties.map((property, index) => (
            <>
              <div className="flex gap-2 mb-2">
                <input
                  className="mb-0"
                  type="text"
                  value={property.name}
                  placeholder="property (ex color)"
                  onChange={(e) =>
                    handlePropertyNameChange(index, property, e.target.value)
                  }
                />
                <input
                  className="mb-0"
                  type="text"
                  value={property.values}
                  placeholder="Values (ex red, green, blue)"
                  onChange={(e) =>
                    handlePropertyValuesChange(index, property, e.target.value)
                  }
                />
                <button
                  type="button"
                  className="btn-default"
                  onClick={() => deleteProperty(index)}
                >
                  Delete
                </button>
              </div>
            </>
          ))}
        <button
          type="button"
          className="btn-default block mb-4 mt-2"
          onClick={addProperty}
        >
          Add property
        </button>

        <div className="flex gap-1">
          {editedCategory && (
            <button
              className="btn-default"
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setName("");
                setParentCategory("");
                setProperties([]);
              }}
            >
              Cancel
            </button>
          )}

          <button type="submit" className="btn-primary">
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-6">
          <thead>
            <tr>
              <td>Category Name</td>
              <td>Parent Category</td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <>
                  {category.name === noParentCategory ? (
                    <tr className="hidden">
                      <td>{category.name}</td>
                      <td>{category.parent?.name}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editCategory(category)}
                            className="btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(category)}
                            className="btn-primary"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr>
                      <td>{category.name}</td>
                      {category.parent?.name === noParentCategory ? (
                        <td />
                      ) : (
                        <td>{category.parent?.name}</td>
                      )}
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => editCategory(category)}
                            className="btn-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteCategory(category)}
                            className="btn-primary"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
          </tbody>
        </table>
      )}
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);
