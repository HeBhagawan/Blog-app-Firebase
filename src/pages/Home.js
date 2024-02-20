import {
  collection,
  deleteDoc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc } from "firebase/firestore";
import BlogSection from "../components/BlogSection";
import Spinner from "../components/Spinner";
import Tags from "../components/Tags";
import MostPopular from "../components/MostPopular";
import Trending from '../components/Trending'


function Home({ user, setActive }) {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [tags, setTags] = useState([]);
  const [trendBlogs, setTrendBlogs] = useState([]);

  const gettrendingBlogs = async () => {
    const blogRef = collection(db, "blogs");
    const trendQuery = query(blogRef, where("trending", "==", "yes"));
    const querySnapshot = await getDocs(trendQuery);
    querySnapshot.forEach((doc) => {
      trendBlogs.push({ id: doc.id, ...doc.data() });
    });
    setTrendBlogs(trendBlogs);
  };
  useEffect(() => {
    gettrendingBlogs();
    const unSub = onSnapshot(
      collection(db, "blogs"),
      (snapshot) => {
        let list = [];
        let tags = [];

        snapshot.docs.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() });
          tags.push(...doc.get("tags"));
        });
        const uniqueTags = [...new Set(tags)];
        setTags(uniqueTags);
        setBlogs(list);
        setLoading(false);
        setActive("/");
      },
      (error) => {
        console.log(error);
      }
    );
    return () => {
      unSub();
      gettrendingBlogs();
    };
  }, [setActive]); 
  if (loading) {
    return <Spinner />;
  }
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        setLoading(true);
        await deleteDoc(doc(db, "blogs", id));
        setLoading(false);
      } catch (error) {}
    }
  };
  return (
    <div>
      <div className="container-fluid pb-4 pt-4 padding">
        <div className="container padding">
          <div className="row mx-0 text-center">
            <Trending blogs = {trendBlogs} />
            <div className="col-md-8">
              <BlogSection
                blogs={blogs}
                user={user}
                handleDelete={handleDelete}
              />
            </div>
            <div className="col-md-3">
              <Tags tags={tags} />
              <MostPopular blogs={blogs} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
