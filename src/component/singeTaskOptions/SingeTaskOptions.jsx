// dependencies
import {
  RiCheckboxBlankCircleLine,
  RiDeleteBin2Fill,
} from "react-icons/ri";
import "./SingeTaskOptions.scss";
import { CiStar, CiStickyNote } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { TbAlertTriangle } from "react-icons/tb";
import { AiOutlineFileDone } from "react-icons/ai";
import { BiSolidEdit } from "react-icons/bi";
import { BsTrash } from "react-icons/bs";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toast, inputDateToReadableDate } from "../../utils/utils";
import { IoIosArrowDropleft, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { FaRegClipboard, FaStar, FaTrashRestore } from "react-icons/fa";
import Swal from "sweetalert2";

const SingeTaskOptions = ({
  righSidebarState,
  setRightSidebar,
  handleTaskComplete,
  handleImportantOrGeneral,
  getAllTask,
  setLeftSidebarNav,
}) => {
  // getting single task
  const [singleTask, setSingleTask] = useState({});

  const getSingleTask = async (id) => {
    const response = await axios.get(`http://localhost:7000/todos/${id}`);
    setSingleTask(response.data);
  };
  useEffect(() => {
    if (righSidebarState.sidebar == true) {
      getSingleTask(righSidebarState.task_id);
    }
  }, [righSidebarState.task_id]);

  // right sidebar close action
  const handleRightSidebarClose = () => {
    setRightSidebar((prevState) => ({
      ...prevState,
      sidebar: false,
    }));
  };

  /**
   * EDIT TASK EDIT STATE & ACTION
   */
  const [taskInput, setTaskInput] = useState({});

  //ACTION
  const handleTaskInputChange = (e) => {
    setTaskInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  /**
   * EDIT VIEW STATE & ACTION
   */
  const [editView, setEditView] = useState(false);

  // ACTION
  const handleEditView = async (id) => {
    setEditView((prevState) => !prevState);

    // set input state value from db when edit option enabled
    if (editView == false) {
      const response = await axios.get(`http://localhost:7000/todos/${id}`);
      setTaskInput(response.data);
    }
  };

  // UPDATE FORM SUBMIT ACTION
  const handleUpdateTaskFormSubmission = async (e) => {
    e.preventDefault();

    // update task
    await axios.patch(
      `http://localhost:7000/todos/${singleTask.id}`,
      taskInput
    );

    // hide edit view
    setEditView(false);

    // update pending task view
    getAllTask("Search", taskInput.task_name);

    Toast.fire({ title: "Task updated!", timer: 2000 });
  };

  /**
   * TRASH, DELETE, RESTORE ACTION
   */
  const handleTrashRestoreDelete = async (type) => {
    switch (type) {
      // send task in 'Trash'
      case "Trash":
        await axios.patch(`http://localhost:7000/todos/${singleTask.id}`, {
          status: "Deleted",
        });
        Toast.fire({ title: "Task moved in Trash", timer: 2000 });

        // set 'Deleted' nav active
        setLeftSidebarNav("Deleted");

        // update 'Deleted' task view
        getAllTask("Deleted");
        break;

      // Permanently 'Delete' Task
      case "Delete":
        Swal.fire({
          title: "Do you want to delete permanently?",
          showCancelButton: true,
          confirmButtonText: "Yes, Delete",
          icon: "question",
        }).then((result) => {
          if (result.isConfirmed) {
            axios.delete(`http://localhost:7000/todos/${singleTask.id}`);

            Swal.fire("Permanently deleted!", "", "success");

            // set 'Deleted' nav active
            setLeftSidebarNav("Deleted");

            // update 'Deleted' task view
            getAllTask("Deleted");
          }
        });
        break;

      // Restore task in 'Pending'
      case "Pending":
        await axios.patch(`http://localhost:7000/todos/${singleTask.id}`, {
          status: "Pending",
        });
        Toast.fire({ title: "Task moved in Pending", timer: 2000 });

        // set 'Pending' nav active
        setLeftSidebarNav("Pending");

        // update 'Pending' task view
        getAllTask("Pending");
        break;
    }

    // hide edit view if edit is opened
    setEditView(false);

    // close right sidebar
    handleRightSidebarClose();
  };

  return (
    <>
      <div className="text-end mb-2">
        <Button onClick={handleRightSidebarClose} className="sidebar_hide_btn">
          <IoIosArrowDropleft />
        </Button>
      </div>

      {/* show details if edit disabled  */}
      {!editView && (
        <>
          <ul className="task_option_list">
            <li>
              <div className="task_top d-flex justify-content-between align-items-center">
                <p className="content">
                  <span
                    onClick={() => {
                      handleTaskComplete(singleTask.id); // complete task on click
                    }}
                  >
                    {singleTask.status == "Pending" ? (
                      <RiCheckboxBlankCircleLine />
                    ) : (
                      ""
                    )}
                    {singleTask.status == "Completed" ? (
                      <IoMdCheckmarkCircleOutline />
                    ) : (
                      ""
                    )}
                  </span>
                  <span>{singleTask.task_name}</span>
                </p>

                {singleTask.status == "Pending" && (
                  <p className="actions d-flex align-items-center">
                    <span
                      title="Priyority Control"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleImportantOrGeneral(singleTask.id);
                      }}
                    >
                      {singleTask.priyority == "General" ? (
                        <CiStar />
                      ) : (
                        <FaStar className="important" />
                      )}
                    </span>
                  </p>
                )}
              </div>
            </li>
          </ul>

          <ul className="task_extra_details">
            <li title="Due date">
              <IoCalendarOutline />{" "}
              <span>{inputDateToReadableDate(singleTask.due_date)}</span>
            </li>
            <li>
              <TbAlertTriangle /> <span>{singleTask.priyority}</span>
            </li>
            <li>
              <CiStickyNote />
              <span>
                {!singleTask.note && <span>Note Empty</span>}
                {singleTask.note}
              </span>
            </li>
            {singleTask.completedAt && (
              <li className="complete_date" title="Completion Date">
                <AiOutlineFileDone />
                <span>{inputDateToReadableDate(singleTask.completedAt)}</span>
              </li>
            )}
          </ul>
        </>
      )}

      {/* show details if edit enabled  */}
      {editView && (
        <div className="edit_wrap">
          <h4>Edit Task</h4>
          <form
            className="edit_task_form"
            onSubmit={handleUpdateTaskFormSubmission}
          >
            <div className="mb-2">
              <label htmlFor="task_name">
                <FaRegClipboard /> Task Name
              </label>
              <textarea
                name="task_name"
                id="task_name"
                rows="5"
                className="form-control"
                value={taskInput.task_name}
                onChange={handleTaskInputChange}
              ></textarea>
            </div>
            <div className="row mb-2">
              <div className="col-md-6">
                <label htmlFor="due_date">
                  <IoCalendarOutline /> Due Date
                </label>
                <input
                  type="date"
                  name="due_date"
                  id="due_date"
                  className="form-control"
                  value={taskInput.due_date}
                  onChange={handleTaskInputChange}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="priyority">
                  <TbAlertTriangle /> Priyority
                </label>
                <select
                  name="priyority"
                  id="priyority"
                  className="form-control"
                  value={taskInput.priyority}
                  onChange={handleTaskInputChange}
                >
                  <option value="General">General</option>
                  <option value="Important">Important</option>
                </select>
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="note">
                <CiStickyNote /> Note
              </label>
              <textarea
                name="note"
                id="note"
                rows="5"
                className="form-control"
                value={taskInput.note}
                onChange={handleTaskInputChange}
              ></textarea>
            </div>
            <Button type="submit" className="d-block w-100 mb-3">
              Save
            </Button>
          </form>
        </div>
      )}

      {/* show 'EDIT & TRASH' button if task is 'PENDING' */}
      {singleTask.status == "Pending" && (
        <div className="mt-2 d-flex justify-content-end single_action_wrap">
          <Button
            className="delete_btn"
            onClick={() => handleTrashRestoreDelete("Trash")}
          >
            <BsTrash />
          </Button>
          <Button
            className="edit_btn"
            onClick={() => handleEditView(singleTask.id)}
          >
            <BiSolidEdit />
          </Button>
        </div>
      )}

      {/* show 'RESTORE & PERMANTEN DELETE' button if task is not 'PENDING' */}
      {singleTask.status != "Pending" && (
        <div className="mt-2 d-flex justify-content-end single_action_wrap">
          <Button
            className="restore_btn"
            title="Restore task"
            onClick={() => handleTrashRestoreDelete("Pending")}
          >
            <FaTrashRestore />
          </Button>

          <Button
            className="delete_btn"
            title="Permanently delete"
            onClick={() => handleTrashRestoreDelete("Delete")}
          >
            <RiDeleteBin2Fill />
          </Button>
        </div>
      )}
    </>
  );
};

export default SingeTaskOptions;

