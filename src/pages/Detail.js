import "../scss/Details.scss";
import {
  collection,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
function Detail({ setActive, user }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [tags, setTags] = useState([]);
  const [blogs, setBlogs] = useState([]);
  useEffect(() => {
    id && getBlogDetail();
  }, [id]);
  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const blogRef = collection(db, "blogs");
    const blogDetail = await getDoc(docRef);
    const blogs = await getDocs(blogRef);
    const tags = [];
    blogs.docs.map((doc) => tags.push(...doc.get("tags")));
    let uniqueTags = [...new Set(tags)];
    setTags(uniqueTags);
    setBlog(blogDetail.data());
    setActive(null);
  };
  return (
    <div className="single">
      <div
        className="blog-title-box"
        style={{ backgroundImage: `url('${blog?.imgUrl}')` }}
      >
        <div className="overlay"></div>
        <div className="blog-title">
          <span>{blog?.createdAt.toDate().toDateString()}</span>
          <h2>{blog?.title}</h2>
        </div>
      </div>
      <div className="container-fluid pb-4 pt-4 padding blog-single-content">
        <div className="container padding">
          <div className="row mx-0">
            <div className="col-md-8">
              <span className="meta-info text-start">
                By <p className="author">{blog?.author}</p> -&nbsp;
                {blog?.createdAt.toDate().toDateString()}
              </span>
              <p className="text-start">{blog?.description}</p>
            </div>
            <div className="col-md-3">
              <Tags tags={tags} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
