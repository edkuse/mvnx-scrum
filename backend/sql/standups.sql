CREATE TABLE standups (
    id SERIAL PRIMARY KEY,
    team_name VARCHAR(255) NOT NULL,
    user_id VARCHAR(25) NOT NULL REFERENCES users(attuid),
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    responses JSONB NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_standups_user_id ON standups(user_id);
CREATE INDEX idx_standups_date ON standups(date);
CREATE INDEX idx_standups_team_name ON standups(team_name);
CREATE INDEX idx_standups_status ON standups(status); 