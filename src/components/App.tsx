import { BrowserRouter as Router, Route , Routes } from "react-router-dom";
import Home from "./Home";
import PostDetails from "./PostDetails";
import NotFound from "./404";


const App: React.FC = () => (
  // Using React Router Dom to navigate through the different routes for the Home page, 404 and dynamic route for the Post details page
  <Router>
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/post/:slug" element={<PostDetails />}/>
      <Route path="/404" element={<NotFound />}/>
      <Route path="*" element={<NotFound />}/>
    </Routes>
  </Router>
);

export default App;
