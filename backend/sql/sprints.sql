CREATE TABLE sprints (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    lead_id VARCHAR(10) REFERENCES users(attuid),
    goal TEXT,                          -- High-level objective of the sprint
    status VARCHAR(50) DEFAULT 'Planned', -- Planned, Active, Completed, Cancelled
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE,
    committed_story_points INTEGER DEFAULT 0,
    completed_story_points INTEGER DEFAULT 0,
    velocity INTEGER, -- Optional: derived or historic average
    progress_percent INTEGER CHECK (progress_percent >= 0 AND progress_percent <= 100) DEFAULT 0,
    burndown_data JSONB,
    tags TEXT[],
    created_by VARCHAR(10) NOT NULL REFERENCES users(attuid),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_by VARCHAR(10) REFERENCES users(attuid),
    updated_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE
);