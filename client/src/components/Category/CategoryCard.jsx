import { FaCalendarAlt, FaPen } from 'react-icons/fa'
import { Link } from 'react-router-dom';
import { categorySchema } from '../../schema';
import { useFormik } from 'formik';

const CategoryCard = ({ category }) => {


  

  
  return (
    <div className='h-fit !my-auto'>
      <div className="text-xl text-center font-normal text-gray-600 bg-slate-200 py-3 rounded-t-2xl"> 
        {category?.name }
      </div>

      <p className="my-5 text-sm px-3"> {category?.description} </p>

      <div className="flex justify-between items-center text-sm px-3">
        {/* <div className="flex items-center gap-1">  Posts</div> */}
        <div className="flex items-center gap-1">
          <FaCalendarAlt />
          {new Date(category?.createdAt).getDate()}{" "}
          {new Date(category?.createdAt).toLocaleString("default", { month: "long", })}
        </div>
      </div>

      <div className="flex justify-between items-center text-sm px-3 mt-5 bottom-0 left-0 right-0">
        <Link to={`/categories/edit/${category?._id}`} className='cate-edit-btn'> 
          <FaPen size={10} /> Manage Category 
        </Link>
      </div>
    </div>
  )
}

export default CategoryCard