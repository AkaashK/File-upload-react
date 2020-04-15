import React, { Fragment, useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState("");
  const [filename, setFilename] = useState("Choose File");
  // eslint-disable-next-line no-unused-vars
  const [uploadedFile, setUploadedFile] = useState({});
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState([]);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { fileName, filePath } = res.data;

      setUploadedFile({ fileName, filePath });
      setMessage("File Uploaded");
    } catch (err) {
      console.log(err);
      if (err.response.status === 500) {
        setMessage("There was a problem with the server");
      } else {
        setMessage(err.response.data.error);
      }
    }
  };

  const handleOnClick = async () => {
    try {
      const res = await axios.get("/getallfiles");
      setFiles(...files, res.data);
    } catch (error) {
      setMessage("some error in getting files");
    }
  };

  return (
    <Fragment>
      {message ? message : null}
      <form onSubmit={onSubmit}>
        <div className="custom-file mb-4">
          <input
            type="file"
            className="custom-file-input"
            id="customFile"
            onChange={onChange}
          />
          <label className="custom-file-label" htmlFor="customFile">
            {filename}
          </label>
        </div>

        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4"
        />
      </form>
      <button
        className="btn btn-primary btn-block mt-4"
        onClick={() => handleOnClick()}
      >
        View files
      </button>{" "}
      <br />
      <div>
        <ol>
          {files.map((newfile) => (
            <li>{newfile}</li>
          ))}
        </ol>
      </div>
    </Fragment>
  );
};

export default FileUpload;
