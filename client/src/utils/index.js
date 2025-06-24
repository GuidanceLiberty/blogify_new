export const fetchCategoryPosts = async (id) => {
    try {
        const resp = await fetch(`http://localhost:9000/api/categories/category-post-count/${id}`);
        const data = await resp.json();
        return await data?.count;
    } catch (error) {
        console.log(`Error fetching categories posts `, error);
    }
}


export function formatDateString(dateString) {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
  
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString(undefined, options);
  
    const time = date.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });
  
    return `${time}`;
  }