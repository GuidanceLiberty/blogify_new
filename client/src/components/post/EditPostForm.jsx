

import axios from "axios";
import { useFormik } from "formik";
import { useState } from "react";
import toast from "react-hot-toast";
import { FaCubes, FaFeather, FaFeatherAlt, FaFileAlt, FaImage } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import useSWR from "swr";
import { postSchema } from "../../schema";
import { Loader } from "lucide-react";


const EditPostForm = () => {
    const URL = process.env.REACT_APP_BASE_URL;
      let user = localStorage.getItem('user');
      user = JSON.parse(user);
      const params = useParams();
      const post_slug = params?.slug;

      const navigate = useNavigate();

      const [photo, setPhoto] = useState('');
      const [file, setFile] = useState(null);

      let res;

      const fetcher = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
      const { data: allCategories, mutate, } = useSWR(`${URL}/categories`, fetcher);

      const { data: post, mutate: post_mutate, error: post_error, isLoading: post_isLoading } = useSWR(`${URL}/posts/${post_slug}`, fetcher);

      const { data: sing_post, mutate: s_post_mutate, error: s_post_error, isLoading: s_post_isLoading } = useSWR(`${URL}/posts/single-post/${post_slug}`, fetcher);



      const onSubmit = async(values, actions) => {   alert("Yess")
        handleUpload();

        try {
            const response = await fetch(`${URL}/posts/${post_slug}`, {
                method: 'PUT', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({ ...values, photo }),
            });
            const res = await response.json();
            if(res.success){
                toast.success(res.message);
                await new Promise((resolve) => setTimeout(resolve, 3000));
                actions.resetForm();
                return navigate('/');
            }
            else{
                toast.error(res.message);
            }
        } catch (error) {
            toast.error("Error occurred while updating post : ", error.message);
            console.log("Error occurred while updating post : ", error.message);
        }
    }


  // UPLOAD PHOTO
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setPhoto(e.target.value);
  };

  const handleUpload = async () => {  
    if (!file) { return  }

    const formData = new FormData();
    formData.append('file', file);
    // return alert("Uploading photo : ", photo);

    try {
      const res = await axios.post(`${URL}/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      toast.success(res.data.message);
    } catch (err) {
      toast.error('Upload failed :', err);
    }

  };


  const initialFormData = { 
    title: post?.data?.title,
    body: post?.data?.body,
    categories: post?.data?.categories?._id,
    photo: post?.data?.photo,
    author: post?.data?.author
  }



    const { values, touched, isSubmitting, errors, handleBlur, handleChange, handleSubmit } = useFormik({
        initialValues: {
            title: initialFormData?.title,
            body: initialFormData?.body,
            categories: initialFormData?.categories,
            photo: initialFormData?.photo,
            author: user?._id,
        },
        validationSchema: postSchema,
        onSubmit
    })
   

      
  return (
    <section>
      <div className="post-form !h-[90%]">
        <div className="w-full max-w-lg mx-auto">
            <h1 className="font-roboto text-[1.3rem] font-light tracking-medium text-center text-primary mb-8">
                Edit Post Form
            </h1>

            <form onSubmit={handleSubmit}>
                <div className="flex flex-col mb-6 w-full">
                    <label htmlFor="title" className="label"> <FaFeather /> 
                    <span className='req'>Title</span>
                        {touched.title && errors.title ? <p className='form-error'>{errors.title}</p> : null}
                    </label>
                    <input type="text" id="title" placeholder="Enter Title"
                        className={`placeholder:text-[#bec6d3] placeholder:font-light text-input-reg `}
                        value={values.title} onChange={handleChange} onBlur={handleBlur}
                    />
                </div>

                <div className="flex flex-col mb-6 w-full">
                    <label htmlFor="body" className="label"> <FaFileAlt /> 
                    <span className='req'>Body</span>
                    {touched.body && errors.body ? <p className='form-error'>{errors.title}</p> : null} 
                    
                    </label>
                    <textarea rows={2} id="body" placeholder="Enter body"
                        className={`placeholder:text-[#bec6d3] placeholder:font-light text-input-reg `}
                        value={values.body} onChange={handleChange} onBlur={handleBlur}
                    ></textarea>
                </div>

                <div className="flex flex-col mb-6 w-full">
                    <label htmlFor="categories" className="label"> <FaCubes />
                    <span className='req'>Category</span>
                        {touched.title && errors.title ? <p className='form-error'>{errors.title}</p> : null}
                    </label>
                    <select id="categories" className={`placeholder:text-[#bec6d3] placeholder:font-light text-input-reg`}
                    value={values.categories} onChange={handleChange} onBlur={handleBlur}
                        >
                            <option value=""></option>
                            {
                                allCategories && allCategories?.data.map((category) =>(
                                    <option key={category?._id} value={category?._id}>
                                        {category?.name}
                                    </option>
                                ))
                                
                            }
                    </select>
                </div>

                <div className="flex flex-col mb-6 w-full">
                    <label htmlFor="photo" className="label"> <FaImage /> Profile Photo </label>
                    <input type="file" id="photo" accept='.png, .jpeg, .jpg, .gif' className={`placeholder:text-dark-light text-input-reg`}
                    onChange={handleFileChange} />
                </div>

                 <button type="submit" className="btn-dark-full " disabled={isSubmitting} > 
                      {
                        isSubmitting ?
                        <Loader className="animate/spin" /> :
                        <span className="flex items-center gap-2"> 
                        <FaFeatherAlt size={12} /> <span> Update Post </span>  
                      </span> 
        
                      }
                </button>

            </form>
        </div>
    </div>
    </section>
  )
}

export default EditPostForm
