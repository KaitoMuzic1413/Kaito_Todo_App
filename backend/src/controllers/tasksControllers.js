import Task from "../models/Task.js";
import mongoose from "mongoose";

const DAILY_TASK_LIMIT = 50;
const MONTHLY_TASK_LIMIT = DAILY_TASK_LIMIT * 30;

const getCreationLimitStatus = async () => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [dailyCount, monthlyCount] = await Promise.all([
        Task.countDocuments({ createdAt: { $gte: startOfDay } }),
        Task.countDocuments({ createdAt: { $gte: startOfMonth } }),
    ]);

    const dailyRemaining = DAILY_TASK_LIMIT - dailyCount;
    const monthlyRemaining = MONTHLY_TASK_LIMIT - monthlyCount;

    let message = "";
    let canCreate = true;
    let severity = "info";

    const formatRemainingMessage = (remaining, period) => {
        const noun = remaining === 1 ? "task" : "tasks";
        return `You have ${remaining} ${noun} create left ${period}.`;
    };

    if (monthlyRemaining <= 0) {
        canCreate = false;
        message = "You have reached the monthly task creation limit.";
        severity = "error";
    } else if (dailyRemaining <= 0) {
        canCreate = false;
        message = "You have reached the daily task creation limit.";
        severity = "error";
    } else if (monthlyRemaining <= 10) {
        message = formatRemainingMessage(monthlyRemaining, "this month");
        severity = "warning";
    } else if (dailyRemaining <= 10) {
        message = formatRemainingMessage(dailyRemaining, "today");
        severity = "warning";
    } else {
        message = "You can create more tasks.";
        severity = "info";
    }

    return {
        dailyLimit: DAILY_TASK_LIMIT,
        monthlyLimit: MONTHLY_TASK_LIMIT,
        dailyCount,
        monthlyCount,
        dailyRemaining,
        monthlyRemaining,
        message,
        canCreate,
        severity,
    };
};

export const getAllTasks = async (req, res) => {
    const {filter ='today'} = req.query;
    const now = new Date();
    let startDate;
    switch (filter) {
        case 'today':{
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            break;
        }
        case 'week':{
            const mondayDate = now.getDate() - (now.getDay() -1) - (now.getDay() === 0 ? 7 : 0);
            startDate = new Date(now.getFullYear(), now.getMonth(), mondayDate);
            break;
        }
        case 'month':{
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
        }
        case 'all':
        default:{
            startDate = null;
        }
    }

    const query = startDate ? {createdAt: {$gte: startDate}} : {};

    try {
        const result = await Task.aggregate([
            {$match: query },
            {
                $facet: {
                    tasks: [{ $sort: { createdAt: -1 } }],
                    activeCount: [{ $match: { status: "active" } }, { $count: "count" }],
                    completeCount: [{ $match: { status: "complete" } }, { $count: "count" }],
                },
            },
        ]);

        const rawTasks = result[0].tasks || [];
        const tasks = rawTasks.map(task => ({
            ...task,
            _id: task._id.toString()
        }));

        const activeCount = result[0].activeCount[0]?.count || 0;
        const completeCount = result[0].completeCount[0]?.count || 0;
        const creationLimits = await getCreationLimitStatus();

        res.status(200).json({ tasks, activeCount, completeCount, creationLimits });
    } catch (error) {
        console.error("Error at getAllTasks:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// Tạo Task mới
export const createTask = async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ message: "Title is required" });
        }

        const currentLimits = await getCreationLimitStatus();
        if (!currentLimits.canCreate) {
            return res.status(429).json({
                message: currentLimits.message,
                creationLimits: currentLimits,
            });
        }

        const task = new Task({ title });
        const newTask = await task.save();
        const creationLimits = await getCreationLimitStatus();

        res.status(201).json({ task: newTask, creationLimits });
    } catch (error) {
        console.error("Error at createTask:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateTask = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, status, completedAt } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { title, status, completedAt },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error("Error at updateTask:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format" });
        }

        const deletedTask = await Task.findByIdAndDelete(id); 

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        console.error("Error at deleteTask:", error);
        res.status(500).json({ message: "Server error" });
    }
};