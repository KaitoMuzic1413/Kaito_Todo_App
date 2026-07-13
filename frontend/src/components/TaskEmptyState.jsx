import React from 'react'
import { Card } from "./ui/card"
import { Circle } from "lucide-react"

const TaskEmtyState = ({ filter }) => {
  return (
    <Card className="p-8 text-center border-0 bg-gradient-card shadow-custom-md ">
        <div className="space-y-3">
            <Circle className="size-12 mx-auto text-muted-foreground" />
            <div>
                <h3 className="font-medium text-foreground ">
                    {
                        filter === 'active' ? 'No active tasks' : 
                        filter === 'completed' ? 'No completed tasks' : 
                        'No tasks'
                    }
                </h3>

                <p className="text-sm text-muted-foreground">
                {
                    filter === 'all' ? 'All tasks will appear here.' : 
                    // SỬA LỖI: Đổi $(...) thành ${...}
                    `Change the filter to see tasks based on their status ${filter === "active" ? "completed." : "active."}`
                }
                </p>
            </div>
        </div>
    </Card>
  )
}

export default TaskEmtyState