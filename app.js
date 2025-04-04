const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid').v4
const { getStoredPosts, storePosts } = require('./data/posts');

const app = express();

app.use(bodyParser.json());

app.use(express.json());

app.use((req, res, next) => {
  // Attach CORS headers
  // Required when using a detached backend (that runs on a different domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,PUT,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// FETCH post API.
// url : http://localhost:8080/posts
app.get('/posts', async (req, res) => {
try{
  const storedPosts = await getStoredPosts();
  res.json({ posts: storedPosts });
}catch(err){
  console.log("error",err);
  return err;
}
});


//Edit post API.
//url : http://localhost:8080/editpost
app.put('/editpost', async (req, res) => {
  try{
    const { id, ...updatedData } = req.body; // Extract ID and other fields

  if (!id) {
    return res.status(400).json({ message: 'ID is required in the request body.' });
  }

  const storedPosts = await getStoredPosts();
  const postIndex = storedPosts.findIndex((post) => post.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ message: 'Post not found.' });
  }

  // Update only the given fields while keeping others unchanged
  storedPosts[postIndex] = { ...storedPosts[postIndex], ...updatedData };

  await storePosts(storedPosts);

  res.status(200).json({ message: 'Post updated successfully.', post: storedPosts[postIndex] });

  }catch(err){
    console.log("error",err);
    return err;
  }
});


// ADD post API.
// url : http://localhost:8080/addpost
app.post('/addpost', async (req, res) => {
 try{
  const postData = req.body;
  const existingPosts = await getStoredPosts();
  const newPost = {
    ...postData,
    id : uuid(),
  };
  const updatedPosts = [newPost, ...existingPosts];
  await storePosts(updatedPosts);
  res.status(201).json({ message: 'Stored new post.', post: newPost });
 }catch(err){
  console.log(err);
  return err;
 }
});

// Delete POST API
// url : http://localhost:8080/deletepost

app.delete('/deletepost', async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'ID is required in the request body.' });
    }

    let storedPosts = await getStoredPosts();

    // Find the post and filter it out
    const updatedPosts = storedPosts.filter(post => String(post.id) !== String(id));

    if (updatedPosts.length === storedPosts.length) {
      return res.status(404).json({ message: `Post not found with ID: ${id}` });
    }

    await storePosts(updatedPosts);
    res.status(200).json({ message: 'Post deleted successfully.' });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
});


app.listen(8080,()=>{
  console.log('Server is running on port 8080');
});
