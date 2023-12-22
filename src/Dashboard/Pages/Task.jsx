import React from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
const DraggableTask = ({ date, description, status, imageSrc, index, moveTask }) => {
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

    return (
        <div ref={(node) => drag(drop(node))} className={`lg:h-[5.4rem] bg-blue-100 bg-opacity-50 lg:w-[19rem] p-4 flex justify-between items-center rounded-md ${isDragging ? 'opacity-50' : ''}`}>
            <div>
                <h2>{date}</h2>
                <p>{description}</p>
                <p className='bg-red-300 w-[5rem] mt-1 p-[2px] rounded-md bg-opacity-50'>Canceled</p>
            </div>
            <div>
                <img className='rounded-lg h-[3rem]' src={imageSrc} alt="" />
            </div>
        </div>
    );
};
const Task = () => {
    return (
        <div>
            <DndProvider key={index + 1} backend={HTML5Backend}>
                <DraggableTask
                    key={task.id}
                    date={task.date}
                    description={task.description}
                    status={task.status}
                    imageSrc={task.imageSrc}
                    index={index}
                    moveTask={moveTask}
                />

            </DndProvider>
        </div>
    );
};

export default Task;