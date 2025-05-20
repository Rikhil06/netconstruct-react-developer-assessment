import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { PostResponse, Post, Category } from "../types";

// Function to convert string to URL friendly string 
// (This converts the string to lowercase, replaces spaces and any special characters with hyphens and removes any non-alpha characters.)
const slugify = (str: string) => str.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '').replace(/--+/g, '-');

const PostDetails: React.FC = () => {
  // This is getting the slug param from the URL.
  const { slug } = useParams<{ slug: string }>();
  // Adding state to store the individial data coming back from the fetch requests for the post  
  const [ post, setPost ] = useState<Post | null>(null);
  const navigate = useNavigate();
  

  useEffect(() => {
    // Here I am fetching the posts from the API, finding the post that is matching the URL slug and then set it to the state whenever the slug changes.
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data: PostResponse) => {
        const found = data.posts.find(
          (item: Post) => slugify(item.title) === slug
        );

        if(!found) { navigate("/404", {replace: true}); return; }

        setPost(found ?? null);
      });
  }, [slug, navigate]);

  if (!post) return null;

  return (
    <motion.main
      className="post-details"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="post-details-hero">
        <div className="post-details-hero-row">
          <div className="post-details-hero-column">
            <div className="post-details-hero-content">
              <div className="post-details-hero-categories">
                {post.categories.map((cat: Category) => (
                  <span key={cat.id}>{cat.name}</span>
                ))}
              </div>
              <h1>{post.title}</h1>
              <p>{post.summary}</p>
              <div className="post-details-hero-author">
                <img src={post.author.avatar} alt={post.author.name} width={50} height={50} />
                <p>By {post.author.name}</p>
              </div>
            </div>
          </div>
          <div className="post-details-hero-column post-details-hero-column-colour"></div>
        </div>
      
      </div>
    </motion.main>
  );
};

export default PostDetails;
