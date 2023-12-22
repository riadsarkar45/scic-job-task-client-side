// AllTasks.js
import React, { useEffect, useState } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import AddBoxIcon from '@mui/icons-material/AddBox';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import useAxiosPublic from "../../Components/Hooks/useAxiosPublic"
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import moment from 'moment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useParams } from 'react-router-dom';
import { Filter } from '@mui/icons-material';
import Swal from 'sweetalert2';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const DraggableTask = ({ date, id, description, handleTaskStatusChange, handleDelete, status, imageSrc, index, moveTask, uploadDate, deadLine }) => {
    const [{ isDragging }, drag] = useDrag({
        type: 'TASK',
        item: { index },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const [, drop] = useDrop({
        accept: 'TASK',
        hover: (item) => {
            if (item.index !== index) {
                moveTask(item.index, index);
                item.index = index;
            }
        },
    });

    // Calculate the difference between the current date and the end of the deadline day
    const daysRemaining = moment(deadLine).endOf('day').diff(moment(), 'days');

    return (
        <div ref={(node) => drag(drop(node))} className={` bg-blue-100 bg-opacity-50 lg:w-[19rem] p-4 flex justify-between items-center rounded-md ${isDragging ? 'opacity-50' : ''}`}>
            <div>
                <p>{description}</p>
                <h2>{deadLine}</h2>
                {
                    daysRemaining === 0 ? (
                        <p className='bg-red-300 w-[5rem] mt-1 p-[2px] rounded-md bg-opacity-50'>Expired</p>

                    ) : daysRemaining < 3 ? (
                        <>
                            <p className='bg-red-300 w-[8.5rem] mt-1 p-[2px] rounded-md bg-opacity-50'>Deadline Is Tight</p>
                        </>
                    ) : (
                        <p>{daysRemaining} days remaining</p>
                    )
                }
                <div>
                    {
                        daysRemaining === 0 ? (
                            null
                        ) : (
                            <>
                                {
                                    status === 'done' ? (
                                        <p className='bg-green-300 w-[8.5rem] mt-1 p-[2px] rounded-md bg-opacity-50 text-center'>Completed</p>
                                    ) : status === 'canceled' ? (
                                        <p className='bg-red-300 w-[8.5rem] mt-1 p-[2px] rounded-md bg-opacity-50 text-center'>Canceled</p>
                                    ) : status === 'onGoing' ? (
                                        <div className='bg-green-50 mt-6 w-full rounded-md text-center'>
                                            <p className='text-center p-1 rounded-md'>Active</p>
                                        </div>
                                    ) : null
                                }
                            </>
                        )
                    }
                </div>
            </div>
            <div>
                <div>
                    <div className="dropdown dropdown-left dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-sm mt-2 m-1"><MoreVertIcon /></div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                            <li onClick={() => handleTaskStatusChange(id, 'done')}><a>Complete</a></li>
                            <li onClick={() => handleTaskStatusChange(id, 'canceled')}><a>Cancel</a></li>
                            <li onClick={() => handleDelete(id)}><a>Delete</a></li>
                            <li><a>Edit</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

const AllTasks = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [loader, setLoader] = useState(true)
    const axiosPublic = useAxiosPublic();
    const [tasks, setTasks] = useState([]);
    const [searchResult, setSearchResult] = useState([])
    const [searchStatus, setSearchStatus] = useState(false)
    const [sort, setSort] = useState(false)
    const [filterData, setFilterData] = useState(false)
    const [date] = useState(moment().format("MMM Do YY"));
    const onlyDay = moment(date, "MMM Do YY").format("Do");
    const [priority, setPriority] = useState([])
    const [prio, setPro] = useState(false)
    const dayWithoutSuffix = onlyDay.replace(/\D/g, '');
    const { email } = useParams();
    console.log(dayWithoutSuffix); // This will give you the day without suffix


    const moveTask = (fromIndex, toIndex) => {
        const updatedTasks = [...tasks];
        const [movedTask] = updatedTasks.splice(fromIndex, 1);
        updatedTasks.splice(toIndex, 0, movedTask);
        setTasks(updatedTasks);
    };

    const { data: userTasks = [], refetch } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/user-tasks/${email}`);
            setTasks([...res.data])
            setLoader(false)
            return res.data;
        }
    });
    useEffect(() => {
        setTasks([...userTasks]);
    }, [userTasks]);

    const handleTaskStatusChange = (id, status) => {
        axiosPublic.patch(`/task-status/${id}`, { status })
            .then(res => {
                toast.success('Congratulations you completed the task')
                refetch()
                console.log(res.data)
            })
    }

    const handleDelete = (_id) => {

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosPublic.delete(`/delete-task/${_id}`)
                    .then(res => {
                        Swal.fire({
                            title: "Deleted!",
                            text: "Your file has been deleted.",
                            icon: "success"
                        });
                        refetch();
                    })

            }
        });

    }

    const handleSearchTasks = (e) => {
        const value = e.target.value;
        console.log(value)
        const search = tasks?.filter((task) => task.taskName?.toLowerCase().includes(value.toLowerCase()))
        setSearchResult(search)
        setSearchStatus(true)
        console.log(search)
    }

    const handleAddTask = (e) => {
        e.preventDefault();
        const form = e.target;
        const priority = form.priority.value;
        const taskName = form.taskName.value;
        const deadLine = form.deadLine.value;
        const desc = form.desc.value;
        const status = 'onGoing'
        const uploadDate = moment().format("MMM Do YY");
        console.log(taskName, deadLine, desc)
        const dataToInsert = { taskName, deadLine, desc, uploadDate, status, email, priority }
        axiosPublic.post('/task-list', dataToInsert)
            .then(res => {
                console.log(res.data)
                refetch();
                handleClose();
                toast.success("Task Added Successfully")
            })
    }

    const handleSortStatus = (e) => {
        const value = e.target.value;
        const filter = userTasks?.filter((task) => task.status === value)
        console.log(filter)
        setFilterData(filter)
        setSort(true)
    }

    const handleFilterPriority = (e) => {
        const value = e.target.value;
        const filter = userTasks?.filter((task) => task.priority === value)
        setPriority(filter)
        setPro(true)
    }

    return (
        <div>
            <div className="rounded-sm shadow-sm bg-blue-500 opacity-35 p-3 flex gap-2">
                <input onChange={handleSearchTasks} type="text" placeholder="Search here" className="input input-bordered w-full" />
                <select onChange={handleSortStatus} className="select select-bordered w-full">
                    <option defaultValue="nnnnn">Filter</option>
                    <option>done</option>
                    <option>canceled</option>
                </select>
                <select onChange={handleFilterPriority} className="select select-bordered w-full">
                    <option defaultValue="Select Prority">Select Priority</option>
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                </select>
                <button onClick={handleOpen} className='btn btn-outline btn-md btn-primary'><AddBoxIcon></AddBoxIcon></button>
            </div>
            {
                loader ? (
                    <div className='text-center flex justify-center mt-10'>
                        <button
                            disabled=""
                            type="button"
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
                        >
                            <svg
                                aria-hidden="true"
                                role="status"
                                className="inline w-4 h-4 me-3 text-white animate-spin"
                                viewBox="0 0 100 101"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="#E5E7EB"
                                />
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentColor"
                                />
                            </svg>
                            Loading...
                        </button>

                    </div>
                ) : (

                    <div>
                        {
                            searchStatus ? (
                                <div>
                                    {
                                        searchResult.length <= 0 ? (
                                            <h2 className='text-center mt-24 text-2xl font-serif' >No result found</h2>
                                        ) : (

                                            <div className='mt-4 grid lg:grid-cols-3 gap-4 font-serif'>
                                                {
                                                    searchResult.map((task, index) => (

                                                        <DndProvider key={index + 1} backend={HTML5Backend}>
                                                            <DraggableTask
                                                                key={task._id}
                                                                description={task.taskName}
                                                                date={task.deadLine}
                                                                status={task.status}
                                                                imageSrc={task.imageSrc}
                                                                index={index}
                                                                deadLine={task.deadLine}
                                                                uploadDate={task.uploadDate}
                                                                moveTask={moveTask}
                                                                id={task._id}
                                                                handleTaskStatusChange={handleTaskStatusChange}
                                                                handleDelete={handleDelete}
                                                            />

                                                        </DndProvider>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                </div>
                            ) : sort ? (
                                <div className='mt-4 grid lg:grid-cols-3 gap-4 font-serif'>
                                    {
                                        filterData.map((task, index) => (

                                            <DndProvider key={index + 1} backend={HTML5Backend}>
                                                <DraggableTask
                                                    key={task._id}
                                                    description={task.taskName}
                                                    date={task.deadLine}
                                                    status={task.status}
                                                    imageSrc={task.imageSrc}
                                                    index={index}
                                                    deadLine={task.deadLine}
                                                    uploadDate={task.uploadDate}
                                                    moveTask={moveTask}
                                                    id={task._id}
                                                    handleTaskStatusChange={handleTaskStatusChange}
                                                    handleDelete={handleDelete}
                                                />

                                            </DndProvider>
                                        ))
                                    }
                                </div>

                            ) : prio ? (
                                <div className='mt-4 grid lg:grid-cols-3 gap-4 font-serif'>
                                    {
                                        priority.map((task, index) => (

                                            <DndProvider key={index + 1} backend={HTML5Backend}>
                                                <DraggableTask
                                                    key={task._id}
                                                    description={task.taskName}
                                                    date={task.deadLine}
                                                    status={task.status}
                                                    imageSrc={task.imageSrc}
                                                    index={index}
                                                    deadLine={task.deadLine}
                                                    uploadDate={task.uploadDate}
                                                    moveTask={moveTask}
                                                    id={task._id}
                                                    handleTaskStatusChange={handleTaskStatusChange}
                                                    handleDelete={handleDelete}
                                                />

                                            </DndProvider>
                                        ))
                                    }
                                </div>
                            ) : (
                                (
                                    <div className='mt-4 grid lg:grid-cols-3 gap-4 font-serif'>
                                        {
                                            tasks.map((task, index) => (

                                                <DndProvider key={index + 1} backend={HTML5Backend}>
                                                    <DraggableTask
                                                        key={task._id}
                                                        description={task.taskName}
                                                        date={task.deadLine}
                                                        status={task.status}
                                                        imageSrc={task.imageSrc}
                                                        index={index}
                                                        deadLine={task.deadLine}
                                                        uploadDate={task.uploadDate}
                                                        moveTask={moveTask}
                                                        id={task._id}
                                                        handleTaskStatusChange={handleTaskStatusChange}
                                                        handleDelete={handleDelete}
                                                    />

                                                </DndProvider>
                                            ))
                                        }
                                    </div>
                                )
                            )



                        }
                    </div>

                )
            }
            <div>
                <Modal
                    keepMounted
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="keep-mounted-modal-title"
                    aria-describedby="keep-mounted-modal-description"
                >
                    <Box sx={style}>
                        <Typography id="keep-mounted-modal-title" variant="h6" sx={{ textAlign: 'center', fontStyle: "normal" }} component="h2">
                            Add New Task
                        </Typography>
                        <Typography id="keep-mounted-modal-description" sx={{ mt: 2 }}>
                            <form onSubmit={handleAddTask}>
                                <div className='text-center'>
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Task Name</span>
                                        </div>
                                        <input name='taskName' type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                                    </label>
                                </div>
                                <div>
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Set Task Deadline</span>
                                        </div>
                                        <input name='deadLine' type="date" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                                    </label>
                                </div>


                                <div className='mt-4'>

                                    <select name='priority' className="select select-bordered w-full max-w-xs">
                                        <option defaultValue="Select Prority">Select Priority</option>
                                        <option>High</option>
                                        <option>Medium</option>
                                        <option>Low</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="form-control w-full max-w-xs">
                                        <div className="label">
                                            <span className="label-text">Task Description</span>
                                        </div>
                                        <textarea name='desc' className="textarea textarea-bordered" placeholder="Task Description"></textarea>                                </label>
                                </div>

                                <div className='text-center mt-6'>
                                    <button className='btn btn-outline btn-md btn-primary'>Submit</button>
                                </div>
                            </form>
                        </Typography>
                    </Box>
                </Modal>
            </div>
        </div>
    );
};

export default AllTasks;
