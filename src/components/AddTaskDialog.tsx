import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Task } from "./WeeklyTaskTable";

interface AddTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, "id">) => void;
  selectedDay: string;
  selectedHour: number;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 8); // 8 AM to 10 PM

const formatHour = (hour: number) => {
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour} ${period}`;
};

const AddTaskDialog = ({ isOpen, onClose, onCreateTask, selectedDay, selectedHour }: AddTaskDialogProps) => {
  const [title, setTitle] = useState("");
  const [day, setDay] = useState(selectedDay);
  const [hour, setHour] = useState(selectedHour);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [subtasks, setSubtasks] = useState<Array<{ id: string; title: string; completed: boolean }>>([]);
  const [currentSubtask, setCurrentSubtask] = useState("");

  // Update day and hour when props change
  useEffect(() => {
    setDay(selectedDay);
    setHour(selectedHour);
  }, [selectedDay, selectedHour]);

  const handleAddSubtask = () => {
    if (currentSubtask.trim()) {
      setSubtasks([
        ...subtasks,
        {
          id: Date.now().toString(),
          title: currentSubtask.trim(),
          completed: false,
        },
      ]);
      setCurrentSubtask("");
    }
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((st) => st.id !== id));
  };

  const handleSubmit = () => {
    if (title.trim() && day) {
      onCreateTask({
        title: title.trim(),
        day,
        hour,
        priority,
        completed: false,
        subtasks,
      });
      // Reset form
      setTitle("");
      setDay(selectedDay);
      setHour(selectedHour);
      setPriority("medium");
      setSubtasks([]);
      setCurrentSubtask("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Create New Task
          </DialogTitle>
          <DialogDescription>
            Add a new task to your weekly schedule. You can also add subtasks to break it down.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-background"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="day">Day</Label>
              <Select value={day} onValueChange={setDay}>
                <SelectTrigger id="day" className="bg-background">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {DAYS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hour">Time</Label>
              <Select value={hour.toString()} onValueChange={(v) => setHour(parseInt(v))}>
                <SelectTrigger id="hour" className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover max-h-[200px]">
                  {HOURS.map((h) => (
                    <SelectItem key={h} value={h.toString()}>
                      {formatHour(h)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger id="priority" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Subtasks (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add a subtask..."
                value={currentSubtask}
                onChange={(e) => setCurrentSubtask(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                className="bg-background"
              />
              <Button
                type="button"
                size="icon"
                onClick={handleAddSubtask}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-2 mt-3 max-h-32 overflow-y-auto">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between bg-muted p-2 rounded-md"
                  >
                    <span className="text-sm">{subtask.title}</span>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => handleRemoveSubtask(subtask.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!title.trim() || !day}
            className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90"
          >
            Create Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskDialog;
