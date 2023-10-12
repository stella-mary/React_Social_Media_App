import About from './About'
import Header from './Header'
import Nav from './Nav'
import Home from './Home'
import NewPost from './NewPost'
import PostPage from './PostPage'
import Missing from './Missing'
import Footer from './Footer'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { format } from 'date-fns';
import api from './api/posts'

function App() {

  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('');
  const [postBody, setPostBody] = useState('');
  const navigator = useNavigate()


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data)
      } catch (err) {
        if (err.response) {
          console.log(err.response.data)
          console.log(err.response.status)
          console.log(err.response.headers)
        }
        else {
          console.log(`Error: ${err.message}`)
        }
      }
    }

    fetchPosts();
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try {
      const response = await api.post('/posts', newPost)
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigator('/')
    } catch (err) {
      console.log(`Error: ${err.message}`)
    }
  }
}

const handleDelete = (id) => {
  const postsList = posts.filter(post => post.id !== id);
  setPosts(postsList);
  navigator('/')
}

return (
  <div className="App">
    <Header title="CandorBees Social Media" />
    <Nav search={search} setSearch={setSearch} />
    <Routes>
      <Route path="/" element={<Home posts={searchResults} />} />
      <Route path="post" >
        <Route index element={<NewPost handleSubmit={handleSubmit} postTitle={postTitle} setPostTitle={setPostTitle} postBody={postBody} setPostBody={setPostBody} />} />
        <Route path=':id' element={<PostPage posts={posts} handleDelete={handleDelete} />} />
      </Route>
      <Route path="about" element={<About />} />
      <Route path="*" element={<Missing />} />
    </Routes>
    <Footer />
  </div>
);
}

export default App;
