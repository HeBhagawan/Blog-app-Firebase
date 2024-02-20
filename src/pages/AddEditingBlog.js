import React, { useEffect, useState } from "react";
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import "../scss/AddEditBlog.scss";
import { storage } from "../firebase";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import {
  addDoc,
  collection,
  serverTimestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const initialState = {
  title: "",
  tags: [],
  trending: "no",
  category: "",
  description: "",
};
const categoryOption = [
  "Fashion",
  "Technology",
  "Food",
  "Politics",
  "Sports",
  "Bussiness",
];

function AddEditingBlog({ user, setActive }) {
  const [form, setForm] = useState(initialState);
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const { title, tags, category, trending, description } = form;
  const navigate = useNavigate();
  const { id } = useParams();
  const uploadFile = async () => {
    const storageRef = ref(storage, file.name);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          setProgress(progress);
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
            default:
              break;
          }
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadUrl) => {
              toast.info("Image upload ", {
                autoClose: 1000,
              });
              resolve(downloadUrl);
            })
            .catch((error) => {
              console.log(error);
              reject(error);
            });
        }
      );
    });
  };

  useEffect(() => {
    if (file) {
      uploadFile()
        .then((downloadUrl) => {
          setForm((data) => ({
            ...data,
            imgUrl: downloadUrl,
          }));
        })
        .catch((error) => {
          console.error("Error uploading file: ", error);
          toast.error("Error uploading file. Please try again later.");
        });
    }
  }, [file]);
  useEffect(() => {
    id && getBlogDetail();
  }, [id]);
  const getBlogDetail = async () => {
    const docRef = doc(db, "blogs", id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setForm({ ...snapshot.data() });
    }
    setActive(null);
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTags = (tags) => {
    setForm({ ...form, tags });
  };

  const handleTrending = (e) => {
    setForm({ ...form, trending: e.target.value });
  };

  const CategoryChange = (e) => {
    setForm({ ...form, category: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (category && tags.length > 0 && title && description && trending) {
      if (!id) {
        try {
          const downloadUrl = file ? await uploadFile() : null;
          // Add document to Firestore collection
          const docRef = await addDoc(collection(db, "blogs"), {
            title,
            tags,
            trending,
            category,
            description,
            createdAt: serverTimestamp(),
            author: user.displayName,
            imgUrl: downloadUrl,
            userId: user.uid,
          });
          toast.success("Blog added successfully!");
          setForm(initialState);
          setFile(null);
          setProgress(null);
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error("Error adding blog. Please try again later.");
        }
      } else {
        try {
          const downloadUrl = file ? await uploadFile() : null;
          // Update document to Firestore collection
          const docRef = await updateDoc(doc(db, "blogs", id), {
            title,
            tags,
            trending,
            category,
            description,
            createdAt: serverTimestamp(),
            author: user.displayName,
            
            userId: user.uid,
          });
          toast.success("Blog Updated successfully!");
          setForm(initialState);
          setFile(null);
          setProgress(null);
        
        } catch (error) {
          console.error("Error adding document: ", error);
          toast.error("Error Updating blog. Please try again later.");
        }
      }
    } else {
      toast.error("Please fill out all required fields.");
    }
  };
  return (
    <div className="container-fluid mb-4">
      <div className="container">
        <div className="col-12 text-center">
          <div className="text-center heading py-2">
            {id ? "Update Blog" : "Create Blog"}
          </div>
        </div>
        <div className="row h-100 justify-content-center align-items-center">
          <div className="col-10 col-md-8 col-lg-6">
            <form className="row blog-form" onSubmit={handleSubmit}>
              <div className="col-12 py-3">
                <input
                  type="text"
                  className="form-control input-text-box"
                  placeholder="Title"
                  name="title"
                  value={title}
                  onChange={handleChange}
                />
              </div>
              <div className="col-12 py-3">
                <ReactTagInput
                  tags={tags}
                  placeholder="Tags"
                  onChange={handleTags}
                />
              </div>
              <div className="col-12 py-3">
                <p className="trending">Is it trending blog?</p>
                <div className="form-check-inline mx-2">
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={trending === "yes"}
                    name="RadioOption"
                    value="yes"
                    onChange={handleTrending}
                  />
                  <label htmlFor="radioOption" className="form-check-label">
                    Yes&nbsp;
                  </label>
                  <input
                    type="radio"
                    className="form-check-input"
                    checked={trending === "no"}
                    name="RadioOption"
                    value="yes"
                    onChange={handleTrending}
                  />
                  <label htmlFor="radioOption" className="form-check-label">
                    No
                  </label>
                </div>
              </div>
              <div className="col-12 py-3">
                <select
                  value={category}
                  onChange={CategoryChange}
                  className="category-dropdown"
                >
                  <option>Please select a category</option>
                  {categoryOption.map((option, index) => (
                    <option value={option || ""} key={index}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 py-3">
                <textarea
                  name="description"
                  className="form-control description-box"
                  placeholder="Description"
                  value={description}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div className="col-12 py-3 text-center">
                <button
                  type="submit"
                  className="btn btn-add"
                  disabled={progress !== null && progress < 100}
                >
                  {id ? "update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEditingBlog;
