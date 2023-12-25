// dependencies
import { RiCheckboxBlankCircleLine } from "react-icons/ri";
import "./SingeTaskOptions.scss";
import { CiStar, CiStickyNote } from "react-icons/ci";
import { IoCalendarOutline } from "react-icons/io5";
import { TbAlertTriangle } from "react-icons/tb";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import { inputDateToReadableDate } from "../../utils/utils";

const SingeTaskOptions = ({sidebarStateAction, statusId}) => {
  // getting single task 
  const [singleTask, setSingleTask] = useState({});

  const getSingleTask = async(id) => {
    const response = await axios.get(`http://localhost:7000/todos/${id}`);
    setSingleTask(response.data);
  }
  useEffect(() => {
    if(statusId.sidebar == true){
    getSingleTask(statusId.task_id);
    }
  }, []);

  return (
    <>
    <div className="text-end mb-2">
    <Button onClick={sidebarStateAction} variant="danger">x</Button>
    </div>
      <ul className="task_option_list">
        <li>
          <div className="task_top d-flex justify-content-between align-items-center">
            <p className="content">
              <span>
                <RiCheckboxBlankCircleLine />
              </span>
              <span>{singleTask.task_name}</span>
            </p>
            <p className="actions d-flex align-items-center">
              <span title="Mark as important">
                <CiStar />
              </span>
            </p>
          </div>
        </li>
      </ul>

      <ul className="task_extra_details">
        <li><IoCalendarOutline /> <span>{inputDateToReadableDate(singleTask.due_date)}</span></li>
        <li><TbAlertTriangle /> <span>{singleTask.priyority}</span></li>
        <li><CiStickyNote /> <span>Note will be appear here</span></li>
      </ul>
    </>
  );
};

export default SingeTaskOptions;
