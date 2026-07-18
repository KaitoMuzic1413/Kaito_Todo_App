import React from 'react'

const Footer = ({ completedTasksCount = 0, activeTasksCount = 0 }) => {
  return (
    <>
      {completedTasksCount + activeTasksCount > 0 && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {
              completedTasksCount > 0 && (
                <>
                  🔥Good! You've completed {completedTasksCount} {completedTasksCount === 1 ? 'task' : 'tasks'}
                  {
                    activeTasksCount > 0 
                      ? `, and have ${activeTasksCount} ${activeTasksCount === 1 ? 'task' : 'tasks'} left.` 
                      : '.'
                  }
                </>
              )
            }

            {completedTasksCount === 0 && activeTasksCount > 0 && (
              <>
                Let's do {activeTasksCount} {activeTasksCount === 1 ? 'task now !!!' : 'tasks now !!!'}
              </>
            )}
          </p>
        </div>
      )}
    </>
  )
}

export default Footer