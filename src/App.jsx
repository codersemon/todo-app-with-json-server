// dependencies
import "./App.scss";
import Meta from "./component/meta/Meta";
import favIcon from "../src/assets/img/favicon.png";
import { Button, Col, Container, Row } from "react-bootstrap";
import { IoSunnyOutline } from "react-icons/io5";
import { CiStar, CiTrash } from "react-icons/ci";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoMdAdd } from "react-icons/io";
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaStar } from "react-icons/fa";
import { GrInProgress } from "react-icons/gr";
import { useEffect, useState } from "react";
import SingeTaskOptions from "./component/singeTaskOptions/SingeTaskOptions";
import axios from "axios";
import { Toast, inputDateToReadableDate } from "./utils/utils";

function App() {
  /**
   * RIGHT SIDEBAR VISIBILITY STATE & ACTIONS
   */
  const [rightSidebar, setRightSidebar] = useState({
    sidebar: false,
    task_id: "",
  });
  // handle right sidebar action
  const handleRightSidebar = (id) => {
      // execute if sibebar is closed or cliked on same item which is already opened
      setRightSidebar((prevState) => ({      
        sidebar: !prevState.sidebar,
        task_id: id,
      }));

      // execute if right sidebar opened and clicked task is not similar with opened task
      if(rightSidebar.sidebar == true && rightSidebar.task_id != id){
        setRightSidebar({
          sidebar: true,
          task_id: id
        });
      }

  };

  /**
   * ADD NEW TASK STATE AND ALL ACTIONS BELOW
   */
  const [taskInput, setTaskInput] = useState({
    task_name: "",
    due_date: "",
    priyority: "General",
    status: 'Pending'
  });
  // handle taskInput action
  const handleTaskInput = (e) => {
    setTaskInput((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  // handle new task add action
  const handleAddNewTask = async () => {
    // validation
    if (!taskInput.task_name || !taskInput.due_date || !taskInput.priyority) {
      Toast.fire({ title: "All field required!", icon: "warning" });
    } else {
      // sending task to db
      await axios.post("http://localhost:7000/todos", taskInput);

      // reset task input after sending to db
      setTaskInput({
        task_name: "",
        due_date: "",
        priyority: "General",
      });

      // show notification
      Toast.fire({ title: "Task added" });

      // reload all tasks
      getAllTask('Pending');

      // set pending nav active 
    setLeftSidebarNav('Pending');
    }
  };

  /**
   * GET ALL TASK STATE AND ACTIONS BELOW
   */
  const [allTasks, setAllTasks] = useState([]);

  // creating today date like stored in db 
  const today = new Date();
  const todayFormat = `${today.getFullYear()}-${
    today.getMonth() + 1
  }-${today.getDate()}`;

  // get all task function
  async function getAllTask(taskType, searchTerm) {
    let response;

    switch ((taskType)) {
      case "Today":
        response = await axios.get(
          `http://localhost:7000/todos?_sort=due_date&_order=desc&due_date=${todayFormat}&status=Pending`
        );
        break;
      case "Pending":
        response = await axios.get(
          `http://localhost:7000/todos?_sort=due_date&_order=asc&status=Pending`
        );
        break;
      case "Important":
        response = await axios.get(
          `http://localhost:7000/todos?_sort=due_date&_order=asc&priyority=Important&status=Pending`
        );
        break;
      case "Completed":
        response = await axios.get(
          `http://localhost:7000/todos?_sort=due_date&_order=asc&status=Completed`
        );
        break;
      case "Deleted":
        response = await axios.get(
          `http://localhost:7000/todos?_sort=due_date&_order=asc&status=Deleted`
        );
        break;
        case "Search":
          response = await axios.get(
            `http://localhost:7000/todos?_sort=due_date&_order=asc&q=${searchTerm}`
          );
          break;

    }

    setAllTasks(response.data);
  }

  // invoke getAllTask function once on load
  useEffect(() => {
    getAllTask('Pending');
  }, []);

  /**
   * ACTION TO COMPLETE TASK AND UPDATE DATABASE
   */
  const handleTaskComplete = async (id) => {
    await axios.patch(`http://localhost:7000/todos/${id}`, {status: 'Completed', completedAt: Date.now()});

    // set completed nav active 
    setLeftSidebarNav('Completed');
    // load task according to the nav item
    getAllTask('Completed');
  }

  /**
   * ACTION TO SET TASK AS IMPORTANT / GENERAL
   */
  const handleImportantOrGeneral = async(id) => {
    const task = await axios.get(`http://localhost:7000/todos/${id}`);

    if(task.data.priyority == 'General'){
      await axios.patch(`http://localhost:7000/todos/${id}`, {priyority: 'Important'});
    }else{
      await axios.patch(`http://localhost:7000/todos/${id}`, {priyority: 'General'});
    }

    // load task according to the nav item
    getAllTask(leftSidebarNav);
  }


  /**
   * LEFT SIDEBAR NAV STATE & ACTION HANDLE
   */
  const [leftSidebarNav, setLeftSidebarNav] = useState('Pending');

  // ACTION 
  const handleLeftSidebarNavItem = (taskType) => {
    // update State 
    setLeftSidebarNav(taskType);

    // load task according to the nav item
    getAllTask(taskType);
  }


  /**
   * SEARCH STATE & ACTIONS
   */
  const [searchInput, setSearchInput] = useState('');

  // search input change action
  const handleSearchInput = async(e) => {
    // update input value
    setSearchInput(e.target.value);

    // const response = await axios.get(`http://localhost:7000/todos?q=${e.target.value}`);
    // setAllTasks(response.data);

    getAllTask('Search', e.target.value);

  }



  return (
    <>
      <Meta>
        <link rel="shortcut icon" href={favIcon} type="image/x-icon" />
        <title>Todo App with JSON Server</title>
      </Meta>

      <Container fluid className="todo_container">
        <Row className="gx-0">
          <Col md="3">
            <div className="sidebar_left p-3">
              <div className="user_info d-flex align-items-center">
                <img src="https://i.ibb.co/CwWhVdN/user.jpg" />
                <div className="details">
                  <h6>Emon Khan</h6>
                  <p>emon9940@gmail.com</p>
                </div>
              </div>

              <div className="search_todo d-flex py-3">
                <input
                  type="text"
                  name="search_text"
                  className="form-control"
                  placeholder="Search..."
                  onChange={handleSearchInput}
                />
              </div>

              <ul className="todo_category">
              <li className={`d-flex justify-content-between align-items-center ${leftSidebarNav == 'Pending' && 'active'}`} onClick={() => handleLeftSidebarNavItem('Pending')}>
                  <label>
                    <GrInProgress /> Pending
                  </label>{" "}
                  <span className="counter">10</span>
                </li>
                <li className={`d-flex justify-content-between align-items-center ${leftSidebarNav == 'Today' && 'active'}`} onClick={() => handleLeftSidebarNavItem('Today')}>
                  <label>
                    <IoSunnyOutline /> My Day
                  </label>{" "}
                  <span className="counter">10</span>
                </li>
                <li className={`d-flex justify-content-between align-items-center ${leftSidebarNav == 'Important' && 'active'}`} onClick={() => handleLeftSidebarNavItem('Important')}>
                  <label>
                    <CiStar /> Important
                  </label>{" "}
                  <span className="counter">10</span>
                </li>
                <li className={`d-flex justify-content-between align-items-center ${leftSidebarNav == 'Completed' && 'active'}`} onClick={() => handleLeftSidebarNavItem('Completed')}>
                  <label>
                    <IoMdCheckmarkCircleOutline /> Completed
                  </label>{" "}
                  <span className="counter">10</span>
                </li>
                <li className={`d-flex justify-content-between align-items-center ${leftSidebarNav == 'Deleted' && 'active'}`} onClick={() => handleLeftSidebarNavItem('Deleted')}>
                  <label>
                    <CiTrash /> Deleted
                  </label>{" "}
                  <span className="counter">10</span>
                </li>
              </ul>
            </div>
          </Col>

          <Col md={rightSidebar.sidebar == false ? "9" : "6"}> 
            <div className="content_middle p-5">
              <div className="new_task_wrap">
                <Row className="gx-2">
                  <Col md={5}>
                    <label htmlFor="task_name">Task name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="+ Add a task"
                      id="task_name"
                      name="task_name"
                      value={taskInput.task_name}
                      onChange={handleTaskInput}
                    />
                  </Col>
                  <Col md={3}>
                    <label htmlFor="due_date">Due Date</label>
                    <input
                      type="date"
                      className="form-control"
                      id="due_date"
                      name="due_date"
                      value={taskInput.due_date}
                      onChange={handleTaskInput}
                    />
                  </Col>
                  <Col md={3}>
                    <label htmlFor="priyority">Priyority</label>
                    <select
                      name="priyority"
                      id="priyority"
                      className="form-control"
                      value={taskInput.priyority}
                      onChange={handleTaskInput}
                    >
                      <option value="General">General</option>
                      <option value="Important">Important</option>
                    </select>
                  </Col>
                  <Col md={1} className="align-self-end">
                    <Button className="w-100" onClick={handleAddNewTask}>
                      <IoMdAdd />
                    </Button>
                  </Col>
                </Row>
              </div>

              <div className="tasks_list_wrap">
                <ul className="tasks_list">
                  {/* loop over fetched task data  */}
                  {allTasks.length > 0 ? (
                    allTasks.map((item, index) => {
                      return (
                        <li
                          onClick={() => handleRightSidebar(item.id)}
                          key={index}
                          className={item.status}
                        >
                          <div className="task_top d-flex justify-content-between align-items-center">
                            <p className="content">
                              <span onClick={(e) => {
                                e.stopPropagation();
                                handleTaskComplete(item.id);
                              }}>
                                {item.status == 'Pending' ? <RiCheckboxBlankCircleLine /> : ''}
                                {item.status == 'Completed' ? <IoMdCheckmarkCircleOutline /> : ''}
            
                              </span>
                              {item.task_name}
                            </p>
                            <p className="actions d-flex align-items-center">
                              <span
                                title="Mark as important"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImportantOrGeneral(item.id)
                                }}
                              >
                                {item.priyority == "General" ? (
                                  <CiStar />
                                ) : (
                                  <FaStar className="important" />
                                )}
                              </span>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRightSidebar(item.id);
                                }}
                                title="Click to see options"
                              >
                                <HiOutlineDotsHorizontal />
                              </span>
                            </p>
                          </div>
                          <div className="task_bottom d-flex">
                            <p className="due_date">
                              {inputDateToReadableDate(item.due_date)}
                            </p>{" "}
                            |<p>Note will appear</p>
                          </div>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-center">JSON SERVER IS OFFLINE NOW / No Task Found</p>
                  )}
                </ul>
              </div>
            </div>
          </Col>

          {rightSidebar.sidebar && (
            <Col md="3">
              <div className="sidebar_right p-3">
                <SingeTaskOptions
                  righSidebarState={rightSidebar}
                  setRightSidebar={setRightSidebar} 
                  handleTaskComplete={handleTaskComplete}
                />
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </>
  );
}

export default App;
