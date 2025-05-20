import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { PostResponse, Post, Category } from "../types";

// Function to convert string to URL friendly string 
// (This converts the string to lowercase, replaces spaces and any special characters with hyphens and removes any non-alpha characters.)
const slugify = (str: string) => str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

const POSTS_PER_PAGE = 3;

const Container = styled.div`
    padding: 20px;
`;

const Select = styled.select`
    padding: 8px;
`;

const PaginationButton = styled.button`
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background: #eee;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
`;

const ArticleCard = styled(motion.article)`
    margin-bottom: 30px;
    cursor: pointer;
`;


const Home: React.FC = () => {
  // Adding state to store the different data that is needed e.g the data coming back from the fetch requests for the posts, setting the cateories etc...   
  const [data, setData] = useState<Post[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);
  
  // This is used for getting the search params and also updating them.
  const [searchParams, setSearchParams] = useSearchParams();   
  const navigate = useNavigate();

  //  This is used to for getting the category and page number from the url params. 
  const selectedCategory = searchParams.get("category") || "";
  const currentPage = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    // Here I am fetching the posts and storing them in the setData state and also doing the same for the categories.
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: PostResponse) => {
        setData(data.posts);
        const cats = new Set<string>();
        data.posts.forEach((item: Post) =>
            item.categories.forEach((c: Category) => cats.add(c.name))
        );
        setAllCategories(Array.from(cats));
      });
  }, []);

  // This filters the data based on the category that you select otherwise uses the original data.   
  const filteredData = selectedCategory ? data.filter((post) => post.categories.some((cat: Category) => cat.name === selectedCategory)) : data;
  // This is getting the total number of pages from the data and divding it by how many posts we want to display on the page in this case 3.
  const totalPages = Math.ceil(filteredData.length / POSTS_PER_PAGE);
  // This extracts a subset of the filtered data to diplay on the page by slicing the array based on the currentPage and number of posts per page.   
  const paginatedData = filteredData.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);

  // This is a function to add, change or remove the URL params when a category is selected from the dropdown.    
  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    setSearchParams(params);
  };

  return (
    <section className="section-articles">
      <Container className="container">
        <h1 className="section-articles-title">Rikhil's NetConstruct React Developer Assessment</h1>

        {/* Filter */}
        <div className="filter">
            <label htmlFor="category-select">Filter by Category:</label>
            <Select id="category-select" value={selectedCategory} onChange={(e) => updateParam("category", (e.target as HTMLSelectElement).value)}>
                <option value="">All</option>
                {allCategories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </Select>
        </div>

        {/* Articles */}
        <AnimatePresence>
            <Grid>
            {paginatedData.map((post: Post) => (
                <ArticleCard
                    key={post.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => navigate(`/post/${slugify(post.title)}`)}
                >
                    <div className="card-colour"></div>
                    <div className="card-content">
                        <div className="card-meta">
                        <div className="card-author">
                            <h3>{post.author.name}</h3>
                            <img src={post.author.avatar} alt={post.author.name} width={50} height={50} />
                        </div>
                        </div>
                        <div className="card-cat">
                        {post.categories.map((cat: Category) => (
                            <span key={cat.id}>{cat.name}</span>
                        ))}
                        </div>
                        <h2 className="card-title">{post.title}</h2>
                        <p>{post.summary}</p>
                        <button onClick={() => navigate(`/post/${slugify(post.title)}`)} className="read-more">
                        Read more
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/>
                        </svg>
                        </button>
                    </div>
                </ArticleCard>
            ))}
            </Grid>
      </AnimatePresence>

      {/* Pagination */}
      <div className="pagination">
        <PaginationButton onClick={() => { updateParam("page", String(currentPage - 1)); window.scrollTo({ top: 0, behavior: 'smooth' });}} disabled={currentPage <= 1}>Prev</PaginationButton>
        <span>Page <strong>{currentPage}</strong> of {totalPages}</span>
        <PaginationButton onClick={() => { updateParam("page", String(currentPage + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} disabled={currentPage >= totalPages}>Next</PaginationButton>
      </div>
      </Container>
    </section>
  );
};

export default Home;
