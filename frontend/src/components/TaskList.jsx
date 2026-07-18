import React from 'react'
import TaskEmptyState from './TaskEmptyState' 
import TaskCard from './TaskCard'

const TaskList = ({ filteredTasks, filter, handleTaskChanged }) => {
  if (!filteredTasks || filteredTasks.length === 0) {
    return <TaskEmptyState filter={filter} />
  }

  return (
    <div className="space-y-3">
      {filteredTasks.map((task, index) => (
        <div 
          key={`${filter}-${task._id}`} 
          className="transition-all duration-300 ease-in-out animate-in fade-in-50 slide-in-from-bottom-2"
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <TaskCard 
            task={task} 
            index={index} 
            handleTaskChanged={handleTaskChanged}
          />
        </div>
      ))}
    </div>
  )
}

export default TaskList