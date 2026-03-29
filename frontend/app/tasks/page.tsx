import { PageHeader } from '@/components/ui/PageHeader';
import { TaskList } from '@/components/tasks/TaskList';

export default function TasksPage() {
  return (
    <div>
      <PageHeader
        title="Task Board"
        subtitle="// AI-MANAGED TASK ASSIGNMENT"
        badge="12 TASKS"
      />
      <TaskList />
    </div>
  );
}
