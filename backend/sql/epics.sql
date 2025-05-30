CREATE TABLE epics (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'backlog', -- e.g., Backlog, In Progress, Done
    priority VARCHAR(50) DEFAULT 'low', -- e.g., Low, Medium, High, Critical
    owner_id VARCHAR(10) REFERENCES users(attuid), -- FK to users table
    application_ids TEXT[] NOT NULL,
    start_date DATE,
    due_date DATE,
    completed_date DATE,
    estimated_effort INTEGER, -- e.g., story points or hours
    actual_effort INTEGER,
    progress INTEGER CHECK (progress >= 0 AND progress <= 100) DEFAULT 0,
    tags TEXT[], -- array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);
