import { Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import useAxiosPublic from '../../Components/Hooks/useAxiosPublic';
import { useContext, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../Components/AuthProvider';

const Home = () => {
    const axiosPublic = useAxiosPublic();
    const [loading, setLoading] = useState(true)
    const [searchResult, setSearchResult] = useState([])
    const [searchStatus, setSearchStatus] = useState(false)
    const { email } = useParams();
    const { user } = useContext(AuthContext)
    const { data: tasks = [], } = useQuery({
        queryKey: ['tasks'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/user-task/${email}`);
            setLoading(false)
            return res.data;
        }
    });

    const { data: completedTasks = [] } = useQuery({
        queryKey: ['completedTasks'],
        queryFn: async () => {
            const res = await axiosPublic.get(`/completed-tasks/${email}`);
            setLoading(false)
            return res.data;
        }
    });

    const handleSearchTasks = (e) => {
        const value = e.target.value;
        console.log(value)
        const search = completedTasks?.filter((task) => task.taskName?.toLowerCase().includes(value.toLowerCase()))
        setSearchResult(search)
        setSearchStatus(true)
    }

    const total = parseInt(tasks?.allTasks);
    // cancled percentage
    const caneledTask = parseInt(tasks?.canceledTask);
    const canceledTask = (caneledTask / total) * 100;

    // completed percentage
    const completed = parseInt(tasks?.completedTasks);
    const CompletedPercentage = (completed / total) * 100;

    // ongoing percentage

    const onGoing = tasks?.onGoingTasks;
    const onGoingPercentage = (onGoing / total) * 100;
    return (
        <div>
            <Typography>
                <div>
                    <div className='lg:flex gap-3'>
                        <div className='rounded-md h-[10rem] bg-blue-100 bg-opacity-50 mt-2 lg:w-[15rem]'>
                            <div className='text-center mt-7 font-serif'>
                                <h2 className='text-2xl'>Total Tasks</h2>
                                {
                                    loading ? (
                                        <span className="loading loading-bars loading-lg"></span>
                                    ) : (
                                        <h3 className='text-3xl'>{tasks?.allTasks}</h3>
                                    )
                                }
                            </div>
                        </div>
                        <div className='rounded-md h-[10rem] bg-blue-100 bg-opacity-50 mt-2 lg:w-[15rem]'>
                            <div className='text-center mt-7 font-serif'>
                                <h2 className='text-2xl'>Ongoing Tasks</h2>
                                {
                                    loading ? (
                                        <span className="loading loading-bars loading-lg"></span>
                                    ) : (
                                        tasks?.completedTasks !== undefined ? (
                                            <>
                                                <h3 className='text-3xl'>{tasks?.completedTasks}</h3>
                                                <small>{parseFloat(onGoingPercentage).toFixed(2)}%</small>
                                                <progress className="progress progress-warning w-56" value={onGoingPercentage} max="100"></progress>
                                            </>
                                        ) : (
                                            <p>No completed tasks available.</p>
                                        )
                                    )
                                }
                            </div>
                        </div>
                        <div className='rounded-md h-[10rem] bg-blue-100 bg-opacity-50 mt-2 lg:w-[15rem]'>
                            <div className='text-center mt-7 font-serif'>
                                <h2 className='text-2xl'>Completed Tasks</h2>
                                {
                                    loading ? (
                                        <span className="loading loading-bars loading-lg"></span>
                                    ) : (
                                        tasks?.completedTasks !== undefined ? (
                                            <>
                                                <h3 className='text-3xl'>{tasks?.completedTasks}</h3>
                                                <small>{parseFloat(CompletedPercentage).toFixed(2)}%</small>
                                                <progress className="progress progress-success w-56" value={CompletedPercentage} max="100"></progress>
                                            </>
                                        ) : (
                                            <p>No completed tasks available.</p>
                                        )
                                    )
                                }

                            </div>
                        </div>
                        <div className='rounded-md h-[10rem] bg-blue-100 bg-opacity-50 mt-2 lg:w-[15rem]'>
                            <div className='text-center mt-7 font-serif'>
                                <h2 className='text-2xl'>Canceled Tasks</h2>
                                {
                                    loading ? (
                                        <span className="loading loading-bars loading-lg"></span>
                                    ) : (
                                        tasks?.canceledTask !== undefined ? (
                                            <>
                                                <h3 className='text-3xl'>{tasks?.canceledTask}</h3>
                                                <small>{parseFloat(canceledTask).toFixed(2)}%</small>
                                                <progress className="progress progress-error w-56" value={canceledTask} max="100"></progress>
                                            </>
                                        ) : (
                                            <p>No canceled tasks available.</p>
                                        )
                                    )
                                }

                            </div>
                        </div>
                    </div>
                    <div>
                        <div className='flex mt-10 gap-4 h-[4rem] lg:w-[60rem] w-full lg:p-2 rounded-md lg:bg-blue-100 bg-opacity-50'>
                            <div className=''>
                                <Link to={`/dashboard/all-task/${user?.email}`}><button className='btn btn-outline btn-success'>Creat Task</button></Link>
                            </div>

                            <div>
                                <div className='lg:w-[53rem]'>
                                    <input onChange={handleSearchTasks} type="text" placeholder="Search" className="input input-bordered w-full" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='mt-4 grid lg:grid-cols-3 gap-4 font-serif'>
                        {
                            searchStatus ? (

                                searchResult?.map(task =>

                                    <div key={task._id} className=' bg-blue-100 bg-opacity-50 lg:w-[19rem] p-4 flex justify-between items-center rounded-md'>
                                        <div>
                                            <h2 className=''>{task?.deadLine}</h2>
                                            <p>{task?.taskName}</p>
                                            {
                                                task?.status === 'done' ? (
                                                    <p className='bg-green-300 w-[5rem] mt-1 p-[2px] rounded-md bg-opacity-50'>Completed</p>
                                                ) : null
                                            }
                                        </div>
                                        <div>
                                            <img className='rounded-lg h-[3rem]' src="https://i.ibb.co/jW1jTPG/1700465064286.jpg" alt="" />
                                        </div>
                                    </div>

                                )

                            ) : (

                                completedTasks?.map(task =>

                                    <div key={task._id} className=' bg-blue-100 bg-opacity-50 lg:w-[19rem] p-4 flex justify-between items-center rounded-md'>
                                        <div>
                                            <h2 className=''>{task?.deadLine}</h2>
                                            <p>{task?.taskName}</p>
                                            {
                                                task?.status === 'done' ? (
                                                    <p className='bg-green-300 w-[5rem] mt-1 p-[2px] rounded-md bg-opacity-50'>Completed</p>
                                                ) : null
                                            }
                                        </div>
                                    </div>

                                )

                            )
                        }
                    </div>
                </div>
            </Typography>
        </div>
    );
};

export default Home;