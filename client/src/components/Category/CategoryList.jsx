import CategoryCard from './CategoryCard'
import CategoryForm from './CategoryForm';
import useSWR from 'swr';

const CategoryList = () => {
  const userInfo = localStorage.getItem('user');
  const user = JSON.parse(userInfo);

  const URL = process.env.REACT_APP_BASE_URL;
  const fecther = (...args) => fetch(...args, {headers: {'Authorization': `Bearer ${user.token}`}}).then((Response) => Response.json());
  const { data: categories, mutate, } = useSWR(`${URL}/categories`, fecther);

  // console.log("categories : ", categories)



  return (
    <section>
      <div className="category-div">
        <div className="cate-wrapper">
            <h2 className='mb-2 font-roboto text-xl font-light tracking-medium text-center'>Category List</h2>  <hr />

            <div className="category-lists">
              {
                categories && categories?.data?.map((category) => (
                  <div key={category?._id} className='category-list'>
                    <CategoryCard category={category}/>
                  </div>
                ))
              }
               
            </div>
        </div>
        

        <div className="category-form">
            <h1 className="font-roboto text-xl font-light tracking-medium text-center text-primary mb-8">
                Category Form
            </h1> 

            <CategoryForm mutate={mutate} user={user}/>
        </div>
      </div>
    </section>
  )
}

export default CategoryList
