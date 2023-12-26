// dependencies
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import "./SingeTaskOptions.scss";
import { CiStickyNote } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { TbAlertTriangle } from "react-icons/tb";
import { AiOutlineFileDone } from "react-icons/ai";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { inputDateToReadableDate } from "../../utils/utils";
import { IoIosArrowDropleft, IoMdCheckmarkCircleOutline } from "react-icons/io";

const SingeTaskOptions = ({righSidebarState, setRightSidebar, handleTaskComplete, handleImportantOrGeneral}) => {
  // getting single task 
  const [singleTask, setSingleTask] = useState({});

  const getSingleTask = async(id) => {
    const response = await axios.get(`http://localhost:7000/todos/${id}`);
    setSingleTask(response.data);
  }
  useEffect(() => {
    if(righSidebarState.sidebar == true){
    getSingleTask(righSidebarState.task_id);
    }
  }, [righSidebarState.task_id]);

  // right sidebar close action 
  const handleRightSidebarClose = () => {
    setRightSidebar((prevState) => ({
      ...prevState,
      sidebar: false,
    }))
  }
  

  return (
    <>
    <div className="text-end mb-2">
    <Button onClick={handleRightSidebarClose} className="sidebar_hide_btn"><IoIosArrowDropleft /></Button>
    </div>
      <ul className="task_option_list">
        <li>
          <div className="task_top d-flex justify-content-between align-items-center">
            <p className="content">

              <span onClick={() => {
                handleTaskComplete(singleTask.id); // complete task on click
                getSingleTask(singleTask.id); // reload single view on click
              }}>
              {singleTask.status == 'Pending' ? <RiCheckboxBlankCircleLine /> : ''}
                                {singleTask.status == 'Completed' ? <IoMdCheckmarkCircleOutline /> : ''}
              </span>
              <span>{singleTask.task_name}</span>
            </p>
            
          </div>
        </li>
      </ul>

      <ul className="task_extra_details">
        <li title="Due date"><IoCalendarOutline /> <span>{inputDateToReadableDate(singleTask.due_date)}</span></li>
        <li><TbAlertTriangle /> <span>{singleTask.priyority}</span></li>
        <li><CiStickyNote /> <span>Note will be appear here</span></li>
        {singleTask.completedAt && <li className="complete_date" title="Completion Date"><AiOutlineFileDone /><span>{inputDateToReadableDate(singleTask.completedAt)}</span></li>}
      </ul>
    </>
  );
};

export default SingeTaskOptions;
