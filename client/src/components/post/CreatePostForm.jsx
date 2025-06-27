import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  FaCubes,
  FaFeather,
  FaFeatherAlt,
  FaFileAlt,
  FaImage,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { postSchema } from "../../schema";
import { Loader } from "lucide-react";
import useSWR from "swr";

const CreatePostForm = () => {
  const userInfo = localStorage.getItem("user");
  const user = JSON.parse(userInfo);

  const URL = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();

  const fetcher = (...args) =>
    fetch(...args, {
      headers: { Authorization: `Bearer ${user.token}` },
    }).then((res) => res.json());

  const { data: allCategories } = useSWR(`${URL}/categories`, fetcher);

  const [file, setFile] = useState(null);

  // UPLOAD PHOTO
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(res.data.message);
      return res.data.path; // Example: "/uploads/filename.jpg"
    } catch (err) {
      toast.error("Upload failed");
      return null;
    }
  };

  const onSubmit = async (values, actions) => {
    const uploadedImagePath = await handleUpload();

    try {
      const response = await fetch(`${URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          ...values,
          photo: uploadedImagePath || "", // Use the uploaded file path
        }),
      });

      const res = await response.json();
      if (res.success) {
        toast.success(res.message);
        await new Promise((resolve) => setTimeout(resolve, 3000));
        actions.resetForm();
        return navigate("/");
      } else {
        toast.error(res.message);
      }
    } catch (error) {
      toast.error("Error occurred while publishing post.");
      console.log("Post Error:", error.message);
    }
  };

  const {
    values,
    touched,
    isSubmitting,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
  } = useFormik({
    initialValues: {
      title: "",
      body: "",
      categories: "",
      photo: "",
      author: user._id,
    },
    validationSchema: postSchema,
    onSubmit,
  });

  return (
    <section>
      <div className="post-form !h-[90%]">
        <div className="w-full max-w-lg mx-auto">
          <h1 className="font-roboto text-[1.3rem] font-light tracking-medium text-center text-primary mb-8">
            New Post Form
          </h1>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="title" className="label">
                <FaFeather />
                <span>
                  Title <span className="req">*</span>
                </span>
                {touched.title && errors.title && (
                  <p className="form-error">{errors.title}</p>
                )}
              </label>
              <input
                type="text"
                id="title"
                placeholder="Enter Title"
                className="placeholder:text-[#bec6d3] placeholder:font-light text-input-reg"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>

            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="body" className="label">
                <FaFileAlt />
                <span>
                  Body <span className="req">*</span>
                </span>
                {touched.body && errors.body && (
                  <p className="form-error">{errors.body}</p>
                )}
              </label>
              <textarea
                rows={2}
                id="body"
                placeholder="Enter body"
                className="placeholder:text-[#bec6d3] placeholder:font-light text-input-reg"
                value={values.body}
                onChange={handleChange}
                onBlur={handleBlur}
              ></textarea>
            </div>

            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="categories" className="label">
                <FaCubes />
                <span>
                  Category <span className="req">*</span>
                </span>
                {touched.categories && errors.categories && (
                  <p className="form-error">{errors.categories}</p>
                )}
              </label>
              <select
                id="categories"
                className="placeholder:text-[#bec6d3] placeholder:font-light text-input-reg"
                value={values.categories}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select a category</option>
                {allCategories?.data?.map((category) => (
                  <option key={category?._id} value={category?._id}>
                    {category?.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col mb-6 w-full">
              <label htmlFor="photo" className="label">
                <FaImage /> Upload Image
              </label>
              <input
                type="file"
                id="photo"
                accept=".png, .jpeg, .jpg, .gif"
                className="placeholder:text-dark-light text-input-reg"
                onChange={handleFileChange}
              />
            </div>

            <button type="submit" className="btn-dark-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader className="animate-spin" />
              ) : (
                <span className="flex items-center gap-2">
                  <FaFeatherAlt size={12} /> <span> Create Post </span>
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreatePostForm;
