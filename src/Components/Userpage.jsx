import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { TokenContext } from "./login";
import { useNavigate } from "react-router-dom";

function Userpage() {
  const [task, setTask] = useState([]);
  const [input, setInput] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
  });
  const [buttonState, setButtonState] = useState("add");
  const { Token, setToken } = useContext(TokenContext);

  const navigate = useNavigate();
  const formatDate = (isoDate) => (isoDate ? isoDate.split("T")[0] : "");

  // Fetching tasks from API
  const apiFetching = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/tasks/", {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });

      const formattedTasks = response.data.map((task) => ({
        ...task,
        startDate: formatDate(task.startDate),
        endDate: formatDate(task.endDate),
      }));

      setTask(formattedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    apiFetching();
  }, []);

  // Creating a new task
  const createNewTask = async (newTask) => {
    try {
      await axios.post("http://localhost:5000/api/tasks/", newTask, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });
      apiFetching(); // Refresh tasks after adding
      setInput({ title: "", description: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  // Deleting a task
  const removeTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${Token}`,
        },
      });
      apiFetching(); // Refresh tasks after deletion
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // Updating a task
  const updateTask = async () => {
    if (!input._id) {
      console.error("Error: Task ID is missing!");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/tasks/${input._id}`, input, {
        headers: {
          Authorization: `Bearer ${Token}`,
          "Content-Type": "application/json",
        },
      });
      apiFetching();
    } catch (error) {
      console.error("Error updating task:", error);
    }

    setInput({
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    });
    setButtonState("add");
  };

  //Search Title
  // const [searchTitle, setSearchTitle] = useState("");
  const handleSearch = async () => {
    // setSearchTitle("Tamil");
    try {
      const response = await axios.get(
        `http://localhost:5000/api/tasks/user/search/Tamil`,
        {
          headers: {
            Authorization: `Bearer ${Token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Search result:", response.data?.userExists);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-300 flex justify-between p-3 font-serif">
        <h1>LOgo</h1>

        <div className="mt-1 flex relative ">
          <input type="search" className=" bg-blue-50 rounded-2xl p-2 outline-hidden lg:w-150 " />
          <div className="absolute right-2 top-1.5">
          <button onClick={handleSearch} className=" ">🔍</button>
          </div>
        </div>
        <button
          className="cursor-pointer bg-red-700 p-2 mr-2 rounded-2xl text-blue-50"
          onClick={() => {
            setToken("");
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>

      <div className="bg-gray-300 flex flex-col m-20 p-5 rounded-2xl justify-center items-center gap-4 font-serif">
        <input
          type="text"
          required
          placeholder="Task Title *"
          className="bg-gray-50 p-3 pl-5 rounded-2xl mt-4 outline-none "
          onChange={(e) => setInput({ ...input, title: e.target.value })}
          value={input.title}
        />
        <textarea
          required
          placeholder="Task description *"
          className="bg-gray-50 p-3 pl-5 rounded-2xl min-h-[6rem] max-h-[16rem] outline-none "
          value={input.description}
          onChange={(e) => setInput({ ...input, description: e.target.value })}
        />

        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          value={input.startDate}
          onChange={(e) =>
            setInput({ ...input, startDate: e.target.value.split("T")[0] })
          }
          className="bg-gray-50 p-2 rounded-lg"
        />

        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          value={input.endDate}
          onChange={(e) =>
            setInput({ ...input, endDate: e.target.value.split("T")[0] })
          }
          className="bg-gray-50 p-2 rounded-lg"
        />

        {buttonState === "add" ? (
          <button
            type="submit"
            className="bg-blue-700 text-white p-3 rounded-2xl mt-4 cursor-pointer"
            onClick={() => createNewTask(input)}
          >
            Add Task
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-green-500 text-white p-3 rounded-2xl mt-4 cursor-pointer"
              onClick={updateTask}
            >
              Update Task
            </button>
            <button
              type="button"
              className="bg-orange-600 text-white p-3 rounded-2xl mt-4 cursor-pointer"
              onClick={() => {
                setInput({
                  title: "",
                  description: "",
                  startDate: "",
                  endDate: "",
                });
                setButtonState("add");
              }}
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-center items-center mt-5">
        <table className="mt-5 border border-collapse p-5">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Title</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Start Date</th>
              <th className="border p-2">End Date</th>
              <th className="border p-2">Options</th>
            </tr>
          </thead>
          <tbody>
            {[...task].reverse().map((task) => (
              <tr key={task._id} className="border">
                <td className="border p-2">{task.title}</td>
                <td className="border p-2">{task.description}</td>
                <td className="border p-2">{task.startDate}</td>
                <td className="border p-2">{task.endDate}</td>
                <td className="border p-2">
                  <button
                    onClick={() => {
                      setInput(task);
                      setButtonState("edit");
                    }}
                    className="bg-yellow-500 text-white p-1 mr-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => removeTask(task._id)}
                    className="bg-red-600 text-white p-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Userpage;
