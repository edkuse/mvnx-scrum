CREATE TABLE stories (
    id SERIAL PRIMARY KEY,
    epic_id INTEGER NOT NULL REFERENCES epics(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) DEFAULT 'Story', -- e.g., Story, Task, Bug, Chore
    status VARCHAR(50) DEFAULT 'To Do', -- e.g., To Do, In Progress, Done
    priority VARCHAR(50) DEFAULT 'Medium', -- Low, Medium, High, Critical
    assignee_ids TEXT[], -- array of user IDs from users table
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    story_points INTEGER,
    time_estimate_minutes INTEGER,
    time_logged_minutes INTEGER,
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    tags TEXT[], -- e.g., ['backend', 'UI', 'critical']
    created_by VARCHAR(10) NOT NULL REFERENCES users(attuid),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(10) REFERENCES users(attuid),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE stories
ADD COLUMN sprint_id INT REFERENCES sprints(id);
