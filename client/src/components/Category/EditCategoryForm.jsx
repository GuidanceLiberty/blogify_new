import { useState } from 'react';
import { FaCheckCircle, FaCube, FaFileAlt, FaInfoCircle, FaTrashAlt } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import useSWR from 'swr';
import { useFormik } from 'formik';
import { categorySchema } from '../../schema';
import toast from 'react-hot-toast';

const EditCategoryForm = () => {

     const URL = process.env.REACT_APP_BASE_URL;
    const navigate = useNavigate();
    const params = useParams();
    const cate_id = params?.category_id;

    const userInfo = localStorage.getItem('user');
    const user = JSON.parse(userInfo)
    
    
    
    const [error, setError] = useState(null);
    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    let res;
    
    const fetcher = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
    const { data: category, mutate, cate_error, isLoading } = useSWR(`${URL}/categories/${cate_id}`, fetcher);
    console.log("category :: ", category?.category);
    



    const onSubmit =  async(values, actions) => {

    let answer;
    setMessage('');
    answer = window.confirm('Are you sure you want to update category ?');
    if (answer) {
        try {
            const response = await fetch(`${URL}/categories/${cate_id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify({...values}),
            }); 
            res = await response.json();
            if (res.success) { 
                mutate();
                setIsError(false);
                toast.success(res.message);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                actions.resetForm();
                return navigate('/categories'); 
            }
            else {
                setIsError(true);
                setError(res.message);
            }
        } catch (err) {
            setIsError(true);
            setError(err);
            console.log("Error occurred while updating categories ", err.message); 
        }
        finally{ actions.resetForm(); }
        }
    }



    const initialFormData = { name: category?.data?.name, description: category?.data?.description }
    // console.log("initialFormData :: ", initialFormData);
    
    const { values, touched, isSubmitting , errors, handleBlur, handleChange, handleSubmit } = useFormik({
    initialValues: { 
        name: initialFormData?.name,  description: initialFormData?.description 
    },
    validationSchema: categorySchema,
    onSubmit,
    })
    




    const gotoCategoryPage = () => { return navigate('/categories'); }
  



  // DELETE
  const handleRemoveCategory = (e) => {
    e.preventDefault();
    
    let answer;
    setMessage('');
    answer = window.confirm('Are you sure you want to remove category ?');
    if (answer) {
      removeCategory();
    }
  }

  const removeCategory = async () => {
    try {
        const resp = await fetch(`${URL}/categories/${cate_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const res = await resp.json();
        if (res) {  
            setMessage(res.message);
            setTimeout(gotoCategoryPage, 3000);
        }
    } catch (error) {
        setMessage('');
        console.log("Error while removing category ", error); 
    }
  }





  return (

    <div className="category-section">

        <div className="flex justify-between">
            <h1 className="font-roboto text-[1.3rem] font-light tracking-medium text-center text-primary mb-8">
                Manage Category
            </h1>

            <form onSubmit={handleRemoveCategory}>
                <button type='submit' className='cate-delete-btn'> <FaTrashAlt /> </button>
            </form>
        </div>
        

        {  isError && error !== null &&  <p className="error-div">  <FaInfoCircle />  {error}   </p>  }
        {  message !== '' &&  <p className="success-div">  <FaCheckCircle />  {message}   </p>  }

        <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-8 w-full">
                <label htmlFor="name" className="label"> <FaCube /> Name 
                    {touched.name && errors.name ? <p className='form-error'>{errors.name}</p> : null} 
                </label>
                <input type="name" id="name" placeholder="Enter name"
                    className={`placeholder:text-[#bec6d3] placeholder:font-light text-input `}
                    value={values?.name} onChange={handleChange} onBlur={handleBlur}
                />
            </div>

            <div className="flex flex-col mb-8 w-full">
                <label htmlFor="description" className="label"> <FaFileAlt /> Description 
                    {touched.description && errors.description ? <p className='form-error'>{errors.description}</p> : null} 
                </label>
                <textarea rows={4} id="description" placeholder="Enter description"
                    className={`placeholder:text-[#bec6d3] placeholder:font-light text-input`}
                    value={values?.description} onChange={handleChange} onBlur={handleBlur}
                />
            </div>

            <button type="submit"
                className="btn-dark-full" disabled={isSubmitting} >  
                Update Category 
            </button>
        </form>
    </div>
  )
}

export default EditCategoryForm